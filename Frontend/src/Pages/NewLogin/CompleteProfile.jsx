import React, { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "",
        dob: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await getToken();
    const res = await fetch("http://localhost:4000/signUp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      navigate("/"); // Go to homepage
    } else {
      const error = await res.json();
      alert("❌ Error: " + error?.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-center">Complete Your Profile</h2>

        <input name="firstName" value={form.firstName} onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" placeholder="First Name" required />

        <input name="lastName" value={form.lastName} onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" placeholder="Last Name" required />

        <input name="username" value={form.username} onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" placeholder="Username" required />

        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
          className="w-full mb-3 p-2 border rounded" placeholder="Phone Number" required />

        <input type="date" name="dob" value={form.dob} onChange={handleChange}
          className="w-full mb-4 p-2 border rounded" placeholder="Date of Birth" required />

        <button type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
