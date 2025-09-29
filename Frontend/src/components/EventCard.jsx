import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link to={`/EventDetails/${event.id}`} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={event.image}
          className="w-full h-48 object-cover"
          alt={event.title} 
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">{event.price}</span>
          {event.remaining && (
            <span className="text-sm text-gray-500">
              {event.remaining} Remaining
            </span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span>{event.date}</span>
          <span className="mx-2">•</span>
          <span>{event.time}</span>
          <span className="mx-2">•</span>
          <span>{event.duration}</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;