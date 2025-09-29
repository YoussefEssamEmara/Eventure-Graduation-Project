import React, { useState, useEffect } from "react";
import Header from "../../components/userHeader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HeroSection = () => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [events, setEvents] = useState([]); // Replace dummy data
  const navigate = useNavigate();

  // 🔽 Fetch events from backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getAllEvents`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredSuggestions = events.filter((event) =>
        event.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSuggestionClick = (eventId) => {
    navigate(`/eventDetails/${eventId}`);
  };

  return (
    <div className="relative h-screen">
      <div className="relative z-10">
        <Header />
      </div>
      <div className="relative w-full h-full">
        <img
          src="/utils/landing-splash.jpg"
          alt="Eventure Platform Hero Section"
          className="object-cover object-center w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
        >
          <div className="max-w-4xl mx-auto px-16 sm:px-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Your next adventure starts here. Discover the perfect event for you!
            </h1>
            <p className="text-xl text-white mb-8">
              Explore our wide range of rental properties tailored to fit your lifestyle and needs!
            </p>
            <div className="relative">
              <input
                type="search"
                className="w-full p-3.5 md:p-4 pr-10 shadow-sm border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full bg-white"
                id="formSearch"
                placeholder="Find events, matches, parties"
                value={searchInput}
                onChange={handleSearchChange}
              />
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 max-h-48 overflow-y-auto z-10 shadow-lg">
                  {suggestions.map((event) => (
                    <li
                      key={event.id}
                      onClick={() => handleSuggestionClick(event.id)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700 font-medium transition-colors"
                    >
                      {event.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
