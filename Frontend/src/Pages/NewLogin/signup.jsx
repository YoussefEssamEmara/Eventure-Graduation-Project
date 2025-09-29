import { SignUp, useAuth, useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const saveToBackend = async () => {
      if (!user || !isSignedIn) return;

      const token = await getToken();

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signUp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || null,
          dob: null // you’ll need to collect this elsewhere if you want to store it
        })
      });

      const data = await res.json();
      console.log("✅ Synced to backend:", data);

      navigate("/complete-profile"); // complete sign up
    };

    saveToBackend();
  }, [isSignedIn, user]);

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
          <SignUp signInUrl="/signin" />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
