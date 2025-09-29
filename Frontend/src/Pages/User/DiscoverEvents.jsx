import { useState, useEffect } from "react";
import EventCard from "../../components/EventCard";
import Header from "../../components/userHeader";
import Footer from "../../components/adminFooter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const categoryOptions = ["All", "Concerts", "Arts", "Sports", "Business"];

function DiscoverEvents() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchInput, setSearchInput] = useState("");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({ category: false });
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/detailedEvents`);
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const eventsForSelectedDateAndCategory = events.filter((event) => {
      const matchesSearch = event.title?.toLowerCase().includes(searchInput.toLowerCase());
      const formattedEventDate = new Date(event.date).toISOString().split("T")[0];

      return (
        matchesSearch &&
        (!isDateSelected || formattedEventDate === formattedDate) &&
        (categoryFilter === "All" || event.category === categoryFilter)
      );
    });
    setFilteredEvents(eventsForSelectedDateAndCategory);
  }, [searchInput, selectedDate, categoryFilter, isDateSelected, events]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    setIsDateSelected(true);
  };

  const toggleDropdown = (type) => {
    setIsDropdownOpen((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-50">
      <Header />

      <div className="py-16 text-center">
        <h1 className="text-4xl font-bold text-blue-950 mb-12">
          Discover Events For All The Things You Love
        </h1>

        <div className="max-w-3xl mx-auto px-4 flex gap-4">
          <div className="relative flex-1">
            <button
              onClick={() => toggleDropdown("category")}
              className="w-full px-4 py-2.5 bg-white border rounded-md flex items-center justify-between text-gray-700 hover:border-gray-400 transition-colors"
            >
              <span>{categoryFilter}</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen.category && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {categoryOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setCategoryFilter(option);
                      toggleDropdown("category");
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Pick Date
            </button>
          </div>
        </div>

        {isDatePickerOpen && (
          <div className="mt-4 flex justify-center">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="border rounded-md p-2"
              placeholderText="Select a date"
            />
          </div>
        )}
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-full md:w-96">
          <input
            type="search"
            className="w-full p-3.5 md:p-4 pr-10 shadow-sm border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full bg-white"
            id="formSearch"
            placeholder="Find events, matches, parties"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isDateSelected
            ? `Events on ${selectedDate.toLocaleDateString()}`
            : "Events"}
        </h2>

        {currentEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEvents.map((event, index) => (
              <EventCard
                key={event.id || index}
                event={event}
                isSaved={false}
                onSave={() => {}}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-4 font-bold text-xl">
            No events available for this date.
          </p>
        )}

        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 mx-1 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-950 text-white"
                  : "bg-white text-blue-950 border border-blue-950"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DiscoverEvents;
