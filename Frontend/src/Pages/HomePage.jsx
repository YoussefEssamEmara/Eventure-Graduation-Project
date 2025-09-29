import React, { useState } from "react";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";
import Header from "../components/userHeader";
import Footer from "../components/adminFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const timeFilters = [
  "All",
  "Today",
  "Tomorrow",
  "This Week",
  "This Weekend",
  "Next Week",
  "Next Weekend",
  "This Month",
  "Next Month",
  "This Year",
  "Next Year",
];

const categoryFilters = [
  "All",
  "Arts",
  "Business",
  "Concert",
  "Workshops",
  "Coaching and Consulting",
  "Health and Wellbeing",
  "Volunteer",
  "Sports",
];

const events = [
  {
    id: 1,
    title: "A New Way Of Life",
    image: "../utils/Event.png",
    price: "100 L.E",
    date: "15 Apr",
    time: "Fri, 3:45 PM",
    duration: "1h",
    category: "Workshops",
    remaining: null,
  },
  {
    id: 2,
    title: "Earrings Workshop with Bronwyn David",
    image: "../utils/Event.png",
    price: "125 L.E",
    date: "30 Apr",
    time: "Sat, 11:20 PM",
    duration: "2h",
    category: "Arts",
    remaining: 6,
  },
  {
    id: 3,
    title: "Spring Showcase Saturday April 30th 2022 at 7pm",
    image: "../utils/Event.png",
    price: "Free",
    date: "1 May",
    time: "Sun, 4:30 PM",
    duration: "3h",
    category: "Concert",
    remaining: null,
  },
  {
    id: 4,
    title: "Shutter Life",
    image: "../utils/Event.png",
    price: "200 L.E",
    date: "1 May",
    time: "Sun, 5:30 PM",
    duration: "1h",
    category: "Arts",
    remaining: 7,
  },
  {
    id: 5,
    title: "Friday Night Dinner at The Old Station May 27 2022",
    image: "../utils/Event.png",
    price: "150 L.E",
    date: "27 May",
    time: "Fri, 12:00 PM",
    duration: "5h",
    category: "Business",
    remaining: null,
  },
  {
    id: 6,
    title: "Step Up Open Mic Show",
    image: "../utils/Event.png",
    price: "200 L.E",
    date: "30 Jun",
    time: "Thu, 4:30 PM",
    duration: "1h",
    category: "Concert",
    remaining: null,
  },
  {
    id: 7,
    title: "Tutorial on Canvas Painting for Beginners",
    image: "../utils/Event.png",
    price: "50 L.E",
    date: "17 Jul",
    time: "Sun, 5:30 PM",
    duration: "1h",
    category: "Arts",
    remaining: 17,
  },
  {
    id: 8,
    title: "Trainee Program on Leadership' 2022",
    image: "../utils/Event.png",
    price: "120 L.E",
    date: "20 Jul",
    time: "Wed, 11:30 PM",
    duration: "12h",
    category: "Business",
    remaining: 7,
  },
];

function HomePage() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // New state for search input

  const navigate = useNavigate();

  const goTOExplore = () => {
    navigate("/discoverEvents");
  };

  const toggleSaveEvent = (eventId) => {
    setSavedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };
  /*
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return true;
    }
    return false;
  };
  */
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchInput.toLowerCase()); // Search functionality

    return matchesSearch; // Include search filter
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-50">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center font-bold mb-4 text-4xl text-blue-950 pb-6 pt-6 ">
          The safest platform for buying and selling tickets online
        </div>
        {/* Search Bar */}

        <div className="flex justify-center mb-8">
          <div className="relative w-full md:w-96">
            {" "}
            {/* Center the input */}
            <input
              type="search"
              className="w-full p-3.5 md:p-4 pr-10 shadow-sm border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full bg-white"
              id="formSearch"
              placeholder="Find events, matches, parties"
              required=""
              autoComplete="off"
              value={searchInput} // Bind input value to state
              onChange={(e) => setSearchInput(e.target.value)} // Update state on change
            />
          </div>
        </div>

        {/* Event Grid */}
        <div className="text-lg font-boldtext-2xl md:text-3xl font-bold pb-4">
          Events
        </div>
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isSaved={false}
                onSave={() => {}}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-4 font-bold text-xl">
            No events found.
          </p>
        )}

        {/* Browse All Button */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-950 hover:bg-blue-800 text-white px-8 py-3 rounded-md transition-colors"
            onClick={goTOExplore}
          >
            Browse All
          </button>
        </div>

        {/* Buy section */}
        <div>
          <div className="text-lg font-boldtext-2xl md:text-3xl font-bold text-center pt-20 text-blue-950">
            How do i buy a ticket?
          </div>
          <div className="font-bold md:text-xl font-bold pb-4 text-center pt-5 text-gray-500">
            100% secure
          </div>
          <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-20">
            <div class="bg-gray-200 px-10 py-10 md:py-16 rounded-[22px] relative mb-4 md:mb-0">
              <h1 class="text-blue-950 font-semibold text-base md:text-xl md:text-center my-3 md:mt-0 md:mb-5">
                Choose your ticket
              </h1>
              <p class="text-[#5F5F5F] text-xs md:text-sm md:text-center">
                Choose the ticket you need to attend the event from all the
                tickets displayed on the site. Choose the one that suits you the
                most
              </p>
              <div class="bg-blue-950 absolute -top-10 md:-top-12 start-5 md:start-1/2 md:-translate-x-1/2  border-4 md:border-8 border-white w-20 md:w-24 h-20 md:h-24 -bg--clr-OrangeOne text-white text-3xl rounded-full flex items-center justify-center">
                1
              </div>
            </div>
            <div class="bg-gray-200 px-10 py-10 md:py-16 rounded-[22px] relative mb-4 md:mb-0">
              <h1 class="text-blue-950 font-semibold text-base md:text-xl md:text-center my-3 md:mt-0 md:mb-5">
                Pay for the ticket
              </h1>
              <p class="text-[#5F5F5F] text-xs md:text-sm md:text-center">
                After you choose the ticket, now it is time for you to pay
                through a completely secure payment gateway to collect the
                ticket price from you.
              </p>
              <div class="bg-blue-950 absolute -top-10 md:-top-12 start-5 md:start-1/2 md:-translate-x-1/2  border-4 md:border-8 border-white w-20 md:w-24 h-20 md:h-24 -bg--clr-OrangeOne text-white text-3xl rounded-full flex items-center justify-center">
                2
              </div>
            </div>
            <div class="bg-gray-200 px-10 py-10 md:py-16 rounded-[22px] relative mb-4 md:mb-0">
              <h1 class="text-blue-950 font-semibold text-base md:text-xl md:text-center my-3 md:mt-0 md:mb-5">
                Your ticket is ready now
              </h1>
              <p class="text-[#5F5F5F] text-xs md:text-sm md:text-center">
                All you have to do is attend the day of the event, and your
                tickets will be available and you will be able to attend the
                event with ease, and all that remains is for you to enjoy.
              </p>
              <div class="bg-blue-950 absolute -top-10 md:-top-12 start-5 md:start-1/2 md:-translate-x-1/2  border-4 md:border-8 border-white w-20 md:w-24 h-20 md:h-24 -bg--clr-OrangeOne text-white text-3xl rounded-full flex items-center justify-center">
                3
              </div>
            </div>
          </div>
        </div>

        {/* Create Event */}
        <div className="my-10 md:my-20">
          {/* Selling Tickets Section */}
          <div className="containerCustom bg-blue-100 flex flex-col md:flex-row items-center py-10 px-5 gap-x-10 rounded-lg shadow-md">
            {/* Left Side: Image */}
            <div className="flex-grow mb-5 md:mb-0">
              <img
                src="../utils/CreateEvent.png"
                alt="Selling Tickets"
                className="w-full h-auto max-w-sm mx-auto"
              />
            </div>

            {/* Right Side: Text Content */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Do you want to sell tickets to an event?
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-6">
                This text is an example of text that can be replaced in the same
                space.
              </p>
              <button className="bg-orange hover:bg-orangeLight text-white font-semibold py-2 px-4 rounded shadow-md">
                Sell Tickets
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
