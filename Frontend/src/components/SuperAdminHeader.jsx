import React from "react";
import { useNavigate } from "react-router-dom";

const SuperAdminHeader = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow-md">
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/admin")}>
        Eventure
      </div>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </header>
  );
};

export default SuperAdminHeader;
