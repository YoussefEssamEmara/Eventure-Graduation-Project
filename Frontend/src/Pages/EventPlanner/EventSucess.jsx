import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/adminHeader';
import Footer from '../../components/adminFooter';

const EventSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-50">
      <Header />
      <main className="flex grow items-center justify-center max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold mb-6 text-blue-950">Event Created Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your event has been created and is now live. You can manage your event from the dashboard.
          </p>
          <Link
            to="/eventPlanner"
            className="bg-blue-950 hover:bg-blue-800 text-white px-8 py-2 rounded-md"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventSuccess;