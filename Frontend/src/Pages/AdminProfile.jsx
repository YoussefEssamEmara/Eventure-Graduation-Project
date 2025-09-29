import React, { useEffect, useState } from "react";
import Header from "../components/adminHeader";
import Footer from "../components/adminFooter";

const AdminProfile = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/checkSession`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/login";
          return null;
        }
        return res.json();
      })
      .then((data) => setUserInfo(data))
      .catch((err) => console.error("Session fetch failed", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/plannerUpdateProfile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: userInfo.username,
        email: userInfo.email,
        docs: userInfo.docs,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Profile updated successfully");
      setIsEditing(false);
    } else {
      alert(data.error || "Update failed");
    }
  } catch (err) {
    alert("An error occurred while updating profile");
    console.error(err);
  }
};


  const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/plannerChangePassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(password),
    });

    const data = await res.json();
    if (data.success) {
      alert("Password changed successfully");
      setPassword({ current: "", new: "", confirm: "" });
    } else {
      alert(data.error || "Password change failed");
    }
  } catch (err) {
    alert("An error occurred while changing password");
    console.error(err);
  }
};


  if (!userInfo) {
    return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex gap-6">
          <div className="w-80 bg-white p-6 rounded shadow space-y-4">
            <img src="../utils/user.png" alt="avatar" className="rounded-full w-24 h-24 mx-auto" />
            <div className="text-center">
              <h2 className="text-xl font-semibold">{userInfo.username}</h2>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
              <p className="text-xs text-green-600">{userInfo.enabled ? "Account Enabled" : "Pending Approval"}</p>
              <p className="text-xs text-blue-600">{userInfo.is_verified ? "Verified Email" : "Email Not Verified"}</p>
              <p className="text-xs text-gray-400 mt-2">Joined: {new Date(userInfo.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex-1 bg-white p-6 rounded shadow">
            <div className="flex gap-3 mb-6">
              {["home", "about", "settings"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 rounded ${
                    activeSection === section
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>

            {activeSection === "home" && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Welcome back, {userInfo.username}!</h3>
                <p className="text-gray-600">You can manage your profile and planner status here.</p>
              </div>
            )}

            {activeSection === "about" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Account Information</h3>
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-3">
                    <div>
                      <label className="text-sm block">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={userInfo.username}
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm block">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm block">Docs (Link or ID)</label>
                      <input
                        type="text"
                        name="docs"
                        value={userInfo.docs || ""}
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <p><strong>Username:</strong> {userInfo.username}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Docs:</strong> {userInfo.docs || "N/A"}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Edit Info
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === "settings" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Change Password</h3>
                {["current", "new", "confirm"].map((field) => (
                  <div key={field}>
                    <label className="text-sm block">
                      {field === "confirm" ? "Confirm New Password" : field[0].toUpperCase() + field.slice(1) + " Password"}
                    </label>
                    <input
                      type="password"
                      name={field}
                      value={password[field]}
                      onChange={handlePasswordChange}
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                ))}
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Change Password
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <div className="border-t mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default AdminProfile;
