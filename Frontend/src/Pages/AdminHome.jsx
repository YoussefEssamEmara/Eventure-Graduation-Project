import React from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminHeader from "../components/SuperAdminHeader";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <SuperAdminHeader />
      <div className="flex flex-col items-center mt-16 space-y-6">
        <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-2xl text-lg shadow hover:scale-105 transition" onClick={() => navigate("/admin/clients")}>
          Manage Clients
        </button>
        <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-2xl text-lg shadow hover:scale-105 transition" onClick={() => navigate("/admin/planners")}>
          Manage Planners
        </button>
        <button className="bg-gradient-to-r from-red-500 to-red-700 text-white px-8 py-4 rounded-2xl text-lg shadow hover:scale-105 transition" onClick={() => navigate("/admin/events")}>
          Manage Events
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
