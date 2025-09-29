import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [role, setRole] = useState('');
  
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!role) {
        alert("Please select a role");
        return;
      }

      const url =`${import.meta.env.VITE_BACKEND_URL}/forgotPassword`;
        

      try {
        const response = await axios.post(url, { email: values.email,role });

        alert("If the email is registered, a reset link has been sent.");
      } catch (error) {
        console.error("Forgot password error:", error);
        alert("Something went wrong. Please try again.");
      }

      console.log("Reset password for:", values.email);
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/3 bg-blue-950 text-white flex-col items-center justify-between p-8 relative">
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
          <h2 className="text-2xl font-bold text-gray-700 text-center">
            Forgot Password
          </h2>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Your Email*
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
                className={`w-full p-3 border border-gray-300 rounded mt-1 focus:ring-blue-950 focus:border-blue-950 ${
                  formik.touched.email && formik.errors.email ? "border-red-500" : ""
                }`}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              ) : null}
            </div>

            {/* Role Selection */}
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">User</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="planner"
                  checked={role === "planner"}
                  onChange={() => setRole("planner")}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Event Planner</span>
              </label>
            </div>

            {/* Reset Button */}
            <button className="w-full bg-blue-950 text-white py-3 rounded font-bold hover:bg-blue-600 transition">
              Send to email
            </button>
          </form>

          {/* Sign In */}
          <div className="text-center text-sm text-gray-600">
            <Link
              className="text-sm text-blue-950 hover:underline mt-1 inline-block"
              to={"/login"}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
