// TicketingDetails.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Ticket,
  Users,
  MoreVertical
} from "lucide-react";
import Header from "../../components/adminHeader";
import Footer from "../../components/adminFooter";
import { useNavigate, useLocation } from "react-router-dom";

export default function TicketingDetails() {
  const [tickets, setTickets] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state?.eventId;
  const [step, setStep] = useState(2);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openDropdown !== null &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleAddTicket = () => {
    setTickets([
      ...tickets,
      {
        id: Date.now(),
        name: "New Ticket",
        price: 0,
        totalTickets: "Unlimited",
        icon: "ticket",
      },
    ]);
  };

  const handleEditTicket = (id, updatedTicket) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
      )
    );
  };

  const handleRemoveTicket = (id) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  const handleSaveTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/saveTickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventId, tickets }),
      });

      if (!res.ok) throw new Error("Failed to save tickets");
      alert("Tickets saved successfully");
      navigate("/eventSuccess");
    } catch (err) {
      console.error(err);
      alert("Error saving tickets");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-50">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Ticketing Details</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((s) => (
                <>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= s ? "bg-blue-950 text-white" : "bg-gray-200"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && <div className={`h-1 w-16 ${step > s ? "bg-blue-950" : "bg-gray-200"}`} />}
                </>
              ))}
            </div>
          </div>

          <div className="p-4 border-b flex items-center">
            <Ticket className="mr-2 h-5 w-5" />
            <h1 className="text-lg font-bold">Tickets</h1>
          </div>

          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Let&apos;s create tickets!</h2>
            <p className="text-gray-600 mt-1">
              Create tickets for your event by clicking on the &apos;Add Tickets&apos; button below.
            </p>
          </div>

          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">Tickets ({tickets.length})</h2>
            <button
              className="bg-blue-950 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={handleAddTicket}
            >
              Add Ticket
            </button>
          </div>

          <div className="divide-y">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Ticket className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {ticket.name} - ${parseFloat(ticket.price).toFixed(2)}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">{ticket.totalTickets} Total Tickets</p>
                  <div className="relative" ref={(el) => (dropdownRefs.current[ticket.id] = el)}>
                    <button
                      onClick={() => setOpenDropdown(ticket.id)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {openDropdown === ticket.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                        <ul className="py-1">
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsEditModalOpen(true);
                            }}
                          >
                            Edit
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                            onClick={() => handleRemoveTicket(ticket.id)}
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center py-6 space-x-4">
              <button
                onClick={handleSaveTickets}
                className="bg-blue-950 hover:bg-blue-800 text-white px-8 py-2 rounded-md"
              >
                Save & Continue
              </button>
              <button
                onClick={() => navigate("/createEvents")}
                className="bg-gray-400 hover:bg-gray-600 text-white px-8 py-2 rounded-md"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedTicket && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Edit Ticket</h2>

              <label className="block text-sm font-medium mb-1">Ticket Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mb-4"
                value={selectedTicket.name}
                onChange={(e) =>
                  setSelectedTicket({ ...selectedTicket, name: e.target.value })
                }
              />

              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded mb-4"
                value={selectedTicket.price}
                onChange={(e) =>
                  setSelectedTicket({
                    ...selectedTicket,
                    price: parseFloat(e.target.value),
                  })
                }
              />

              <label className="block text-sm font-medium mb-1">Total Tickets</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded mb-4"
                value={selectedTicket.totalTickets}
                onChange={(e) =>
                  setSelectedTicket({
                    ...selectedTicket,
                    totalTickets: e.target.value,
                  })
                }
              />

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-950 hover:bg-blue-800 text-white px-8 py-2 rounded-md"
                  onClick={() => {
                    handleEditTicket(selectedTicket.id, selectedTicket);
                    setIsEditModalOpen(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
