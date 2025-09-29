import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/checkSession`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        console.log("Session data:", data);
        if (data?.role) {
          setIsLoggedIn(true);
          setRole(data.role);
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setRole(null);
      });
  }, []);

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  return (
    <header className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <span className="text-2xl font-bold text-blue-500">
            <img
              src="../utils/logoBG.png"
              alt="Logo"
              className="w-20 h-20 cursor-pointer"
              onClick={() => navigate("/")}
            />
          </span>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-50 hover:text-gray-300">
              Home
            </Link>
            <Link to="/discoverEvents" className="text-gray-50 hover:text-gray-300">
              Explore Events
            </Link>
            <Link to="/help" className="text-gray-50 hover:text-gray-300">
              Help
            </Link>
          </nav>

          <div className="flex space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="bg-navyBlue hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign_up_options"
                  className="bg-navyBlue hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {role === "user" ? (
                  <Link
                    to="/userProfile"
                    className="bg-navyBlue hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    My Profile
                  </Link>
                ) :(
                  <Link
                    to="/adminProfile"
                    className="bg-navyBlue hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    My Profile
                  </Link>
                ) }
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
