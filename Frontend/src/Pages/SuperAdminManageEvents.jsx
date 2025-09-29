import React, { useEffect, useState } from "react";
import SuperAdminHeader from "../components/SuperAdminHeader";

const SuperAdminManageEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleApproval = async (id) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/events/${id}/toggle`, {
      method: "PUT",
    });
    setEvents(prev =>
      prev.map(event =>
        event.event_id === id ? { ...event, approved: !event.approved } : event
      )
    );
  };

  return (
    <div>
      <SuperAdminHeader />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Manage Events</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">City</th>
                <th className="p-3 border">Approved</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.event_id} className="hover:bg-gray-50">
                  <td className="p-3 border">{event.event_id}</td>
                  <td className="p-3 border">{event.event_name}</td>
                  <td className="p-3 border">{event.city}</td>
                  <td className="p-3 border">{event.approved ? "Yes" : "No"}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => toggleApproval(event.event_id)}
                      className={`px-4 py-2 rounded text-white ${
                        event.approved
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {event.approved ? "Unapprove" : "Approve"}
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

export default SuperAdminManageEvents;
