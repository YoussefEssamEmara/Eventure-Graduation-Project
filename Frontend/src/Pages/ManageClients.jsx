import React, { useEffect, useState } from "react";
import SuperAdminHeader from "../components/SuperAdminHeader";

const ManageClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/clients`)
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleClient = async (id) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/clients/${id}/toggle`, {
      method: "PUT",
    });
    setClients(prev =>
      prev.map(client =>
        client.client_id === id
          ? { ...client, enabled: !client.enabled }
          : client
      )
    );
  };

  return (
    <div>
      <SuperAdminHeader />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Manage Clients</h2>
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
              {clients.map((client) => (
                <tr key={client.client_id} className="hover:bg-gray-50">
                  <td className="p-3 border">{client.client_id}</td>
                  <td className="p-3 border">{client.username}</td>
                  <td className="p-3 border">{client.email}</td>
                  <td className="p-3 border">
                    {client.enabled ? "Active" : "Banned"}
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => toggleClient(client.client_id)}
                      className={`px-4 py-2 rounded text-white ${
                        client.enabled
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {client.enabled ? "Ban" : "Activate"}
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

export default ManageClients;
