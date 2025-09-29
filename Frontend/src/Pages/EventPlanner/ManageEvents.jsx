// pages/ManageEvents.jsx
import React, { useEffect, useState } from "react";
import Header from "../../components/adminHeader";
import Footer from "../../components/adminFooter";
import axios from "axios";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchSessionAndEvents = async () => {
      try {
        const sessionRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/checkSession`, {
          withCredentials: true,
        });
        const plannerId = sessionRes.data?.planner_id;
        //console.log(plannerId);
        if (!plannerId) throw new Error("No planner_id in session");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/plannerEvents`,
          {
            //params: { plannerId },
            withCredentials: true,
          }
        );
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchSessionAndEvents();
  }, []);

  const handleEdit = (id) => {
    const eventToEdit = events.find((event) => event.event_id === id);
    setSelectedEvent({ ...eventToEdit });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.event_id === selectedEvent.event_id ? selectedEvent : event
      )
    );
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this event?");
  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/deleteEvent/${id}`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      setEvents(events.filter((event) => event.event_id !== id));
    } else {
      alert("Failed to delete event.");
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Something went wrong while deleting the event.");
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-1 container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 inline-block mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zM4 8v9a1 1 0 001 1h10a1 1 0 001-1V8H4z" />
          </svg>
          Manage Events
        </h1>
<table className="min-w-full bg-white border border-gray-300">
  <thead>
    <tr>
      <th className="py-2 px-4 border-b text-center">Event Name</th>
      <th className="py-2 px-4 border-b text-center">Date</th>
      <th className="py-2 px-4 border-b text-center">Location</th>
      <th className="py-2 px-4 border-b text-center">Approved</th>
      <th className="py-2 px-4 border-b text-center">Tickets</th>
      <th className="py-2 px-4 border-b text-center">Actions</th>
    </tr>
  </thead>
  <tbody>
    {events.map((event) => (
      <tr key={event.event_id}>
        <td className="py-2 px-4 border-b text-center">{event.event_name}</td>
        <td className="py-2 px-4 border-b text-center">{event.event_date}</td>
        <td className="py-2 px-4 border-b text-center">{event.full_address}</td>
        
        {/* ✅ Fix: Proper boolean display */}
        <td className="py-2 px-4 border-b text-center">
          {event.approved ? "Yes" : "No"}
        </td>

        <td className="py-2 px-4 border-b text-center">
          {event.total_remaining || 0}
        </td>

        <td className="py-2 px-4 border-b text-center">
          <div className="flex justify-center space-x-2">
            <button
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
              onClick={() => handleDelete(event.event_id)}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
            <div className="space-y-4">
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                name="event_name"
                value={selectedEvent?.event_name || ""}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, event_name: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="date"
                name="event_date"
                value={selectedEvent?.event_date?.slice(0, 10) || ""}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, event_date: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 p-2 rounded"
                type="text"
                name="location"
                value={selectedEvent?.full_address || ""}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
              />
              <textarea
                className="w-full border border-gray-300 p-2 rounded"
                name="description"
                rows={4}
                value={selectedEvent?.description || ""}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
              ></textarea>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
