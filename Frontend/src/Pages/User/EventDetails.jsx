import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/adminFooter";
import Header from "../../components/userHeader";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [planner, setPlanner] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setTicketSelections] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/event/${eventId}`);
        const data = await res.json();
        setEvent(data);

        const res2 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getPlannerName/${data.planner_id}`);
        const plannerData = await res2.json();
        setPlanner(plannerData);

        const ticketRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tickets/${eventId}`);
        const ticketData = await ticketRes.json();
        setTickets(ticketData);

        // Initialize ticket selections
        const initialSelections = {};
        ticketData.forEach(ticket => {
          initialSelections[ticket.category] = {
            category_id:ticket.category_id,
            price: ticket.price,
            quantity: 0
          };
        });
        setTicketSelections(initialSelections);
        console.log(ticketData);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleTicketQuantityChange = (category, quantity) => {
    setTicketSelections(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        quantity: quantity
      }
    }));
  };

  const calculateTotal = () => {
    return Object.values(selectedTickets || {}).reduce(
      (total, curr) => total + (curr.price * curr.quantity), 0
    );
  };

  const goCheckout = async () => {
  const selectedData = [];

  for (const category in selectedTickets) {
    const selection = selectedTickets[category];
    if (selection.quantity > 0) {
      const ticketInfo = tickets.find(t => t.category === category);
      if (ticketInfo) {
        selectedData.push({
          category_id: selection.category_id,
          category_name: category,
          quantity: selection.quantity,
          price: selection.price,
          
        });
      }
    }
  }
  const totalPrice = selectedData.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/setSelectedTickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send session cookie
      body: JSON.stringify({ selectedTickets: selectedData ,totalPrice,eventId}),
    });
    
    const data = await res.json();
    if (data.success) {
      navigate("/checkout");
    } else {
      alert("You must sign in first");
    }
  } catch (err) {
    console.error("Error during ticket selection submission:", err);
    alert("An error occurred. Please try again.");
  }
};



  if (!event) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-50">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-950 text-white p-3 rounded-lg text-center min-w-[80px]">
                  <div className="text-sm font-medium">
                    {new Date(event.event_date).toLocaleString("default", { month: "short" })}
                  </div>
                  <div className="text-2xl font-bold">
                    {new Date(event.event_date).getDate()}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">{event.event_name}</h1>
                  <div className="flex items-center text-gray-600 gap-2">
                    <span>{event.full_address}</span>
                    <span className="text-gray-400">•</span>
                    <span className="inline-flex items-center gap-1">
                      Starts on {new Date(`${event.event_date.split("T")[0]}T${event.event_time}`).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={event.event_image_url || "../public/utils/Event.png"}
                  alt="Event banner"
                  className="w-3/4 h-[400px] object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <p className="text-gray-600 whitespace-pre-line">{event.event_description}</p>
              </div>
            </div>

            <div className="lg:w-[380px]">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-6">Event Details</h2>

                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Organised by</div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <span className="font-medium">{planner ? planner.username : "Loading..."}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                    <div className="text-gray-700">
                      {new Date(`${event.event_date.split("T")[0]}T${event.event_time}`).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="text-gray-700">{event.full_address}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Tickets</div>
                    {tickets.map((ticket) => (
                      <div key={ticket.category} className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-700">
                          {ticket.category} - {ticket.price} L.E
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={selectedTickets[ticket.category]?.quantity || 0}
                          onChange={(e) =>
                            handleTicketQuantityChange(ticket.category, parseInt(e.target.value, 10) || 0)
                          }
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-right"
                        />
                      </div>
                    ))}
                    <div className="mt-2 text-gray-600">
                      Total: <span className="font-bold">{calculateTotal().toFixed(2)} L.E</span>
                    </div>
                  </div>

                  <button
                    onClick={goCheckout}
                    className="w-full bg-blue-950 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetails;
