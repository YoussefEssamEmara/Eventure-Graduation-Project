import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SignUpOptions() {
  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/3 bg-navyBlue text-white flex-col items-center justify-between p-8 relative">
        <img src="../utils/logoBG.png" alt="Logo" className="w-50 h-50" />
        <div className="text-center mb-8">
          <h1 className="text-xl lg:text-3xl font-bold leading-snug">
            The Easiest Way to Create Events and Sell More Tickets Online
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center p-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-950 mb-8">Sign Up</h1>
        <div className="flex space-x-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-64 h-64 flex items-center justify-center bg-white shadow-lg rounded-lg"
          >
            <Link
              to="/planner_register"
              className="block w-full h-full bg-navyBlue text-white text-center p-4 rounded-lg font-semibold hover:bg-blue-950 flex items-center justify-center"
            >
              Sign Up as Event Planner
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-64 h-64 flex items-center justify-center bg-white shadow-lg rounded-lg"
          >   
            <Link
              to="/user_register"
              className="block w-full h-full bg-navyBlue text-white text-center p-4 rounded-lg font-semibold hover:bg-blue-950 flex items-center justify-center"
            >
              Sign Up as Client
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}