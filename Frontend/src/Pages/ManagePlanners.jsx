import React, { useEffect, useState } from "react";
import SuperAdminHeader from "../components/SuperAdminHeader";

const ManagePlanners = () => {
  const [planners, setPlanners] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/planners`)
      .then((res) => res.json())
      .then((data) => setPlanners(data))
      .catch((err) => console.error(err));
  }, []);

  const togglePlanner = async (id) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/planners/${id}/toggle`, {
      method: "PUT",
    });
    setPlanners(prev =>
      prev.map(planner =>
        planner.planner_id === id
          ? { ...planner, enabled: !planner.enabled }
          : planner
      )
    );
  };

  return (
    <div>
      <SuperAdminHeader />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Manage Planners</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Username</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {planners.map((planner) => (
                <tr key={planner.planner_id} className="hover:bg-gray-50">
                  <td className="p-3 border">{planner.planner_id}</td>
                  <td className="p-3 border">{planner.username}</td>
                  <td className="p-3 border">{planner.email}</td>
                  <td className="p-3 border">
                    {planner.enabled ? "Approved" : "Banned"}
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => togglePlanner(planner.planner_id)}
                      className={`px-4 py-2 rounded text-white ${
                        planner.enabled
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {planner.enabled ? "Ban" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagePlanners;
