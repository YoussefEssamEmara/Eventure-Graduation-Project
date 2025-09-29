import React, { useState, useEffect } from "react";
import Header from "../components/userHeader";
import Footer from "../components/adminFooter";

const UserProfile = () => {
  const [activeSection, setActiveSection] = useState("My Events");
  const [profilePhoto, setProfilePhoto] = useState("../utils/user.png");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [bookedEvents, setBookedEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/checkSession`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/login";
          return;
        }
        return res.json();
      })
      .then((data) => {
        setUserInfo(data);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/user/booked-events`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => setBookedEvents(data))
          .catch((err) => console.error("Failed to fetch booked events", err));
      })
      .catch((err) => console.error("Failed to fetch session info", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!userInfo.first_name) newErrors.firstName = "First name is required";
    if (!userInfo.last_name) newErrors.lastName = "Last name is required";
    if (!userInfo.email) newErrors.email = "Email is required";
    if (!userInfo.dob) newErrors.dob = "Date of birth is required";
    if (!userInfo.phone) newErrors.phoneNumber = "Phone number is required";
    if (!userInfo.bio) newErrors.about = "About section is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setIsEditing(false);
      console.log(userInfo);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Password change requested:", password);
    setPassword({ current: "", new: "", confirm: "" });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (isProfileMenuOpen && !e.target.closest(".relative")) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [isProfileMenuOpen]);

  const renderContent = () => {
    switch (activeSection) {
      case "My Events":
        return (
          <div className="space-y-4 mt-4">
            {bookedEvents.length === 0 ? (
              <p className="text-center text-gray-500">You have no booked events.</p>
            ) : (
              <table className="min-w-full border border-gray-300 rounded shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border">Event</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Location</th>
                    <th className="p-3 border">Tickets</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedEvents.map((event) => (
                    <tr key={event.ticket_id} className="text-center hover:bg-gray-50">
                      <td className="p-3 border">{event.event_name}</td>
                      <td className="p-3 border">{new Date(event.event_date).toLocaleDateString()}</td>
                      <td className="p-3 border">{event.full_address}</td>
                      <td className="p-3 border">{event.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!userInfo) {
    return <div className="text-center mt-20">Loading user profile...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-blue-50">
      <Header />
      <main className="flex-grow flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-lg border border-gray-300 space-y-6" style={{ minHeight: '600px', maxHeight: '400px' }}>
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={profilePhoto}
                  alt="Profile picture"
                  className="w-30 h-30 rounded-full"
                />
                <button
                  onClick={triggerFileInput}
                  className="profilePhoto absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold flex items-center gap-2">
                {userInfo.first_name} {userInfo.last_name}
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">✓</span>
              </h2>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
              <div className="flex justify-center gap-8 mt-4">
                <div className="text-center">
                  <div className="font-semibold">0</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">2</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 text-center">{userInfo.bio}</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <h2 className="text-2xl font-bold">Welcome, {userInfo.first_name}!</h2>
                <p>This is your personal profile. You can view your saved events, check your Events, and manage your profile from here.</p>
                <button
                  onClick={() => setActiveSection("My Events")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${activeSection === "My Events" ? "bg-blue-950 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} flex items-center justify-center`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  My Events
                </button>
              </div>
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
