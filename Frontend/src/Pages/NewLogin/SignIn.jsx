import { SignIn } from '@clerk/clerk-react';
import React from 'react';
import { Link } from "react-router-dom";

const SignInPage = () => {
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
      <div className="w-full lg:w-2/3 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* 
          <h2 className="text-2xl font-bold text-blue-950 text-center">
            Sign in to Eventure
          </h2> */}
          <div className="space-y-4">
            <SignIn
              signUpUrl="/sign_up_options" // Custom sign-up route
            />
          </div>
          {/*
          <div className="text-center text-sm text-gray-600">
            New to Eventure?{" "}
            <Link
              className="text-sm text-babyBlue hover:underline mt-1 inline-block"
              to={"/sign_up_options"}
            >
              Sign up
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;