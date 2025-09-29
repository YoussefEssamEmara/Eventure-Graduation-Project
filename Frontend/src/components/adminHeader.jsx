import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PlannerHeader() {
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
        if (data?.role === "planner") {
          setIsLoggedIn(true);
          setRole("planner");
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
              onClick={() => navigate("/eventPlanner")}
            />
          </span>

          <nav className="hidden md:flex space-x-8">
            <Link to="/eventPlanner" className="text-gray-50 hover:text-gray-300">
              Home
            </Link>
            <Link to="/manageEvents" className="text-gray-50 hover:text-gray-300">
              Manage Events
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
                <Link
                  to="/adminProfile"
                  className="bg-navyBlue hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  to="/createEvents"
                  className="bg-navyBlue hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create Events
                </Link>
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
