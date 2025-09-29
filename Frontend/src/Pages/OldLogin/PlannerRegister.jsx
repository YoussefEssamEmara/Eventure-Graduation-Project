import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  docs: Yup.string()
    .url("Docs must be a valid URL")
    .required("Docs link is required"),
});

export default function PlannerRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      docs: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError("");
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/plannerSignUp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.ok) {
         navigate("/verify-email", { state: { email: values.email, isPlanner: true } });
        } else {
          setError(data.error || "Signup failed.");
        }
      } catch (err) {
        console.error(err);
        setError("Signup failed due to network/server error.");
      }
    },
  });

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
          <h2 className="text-2xl font-bold text-blue-950 text-center">
            Planner Account Registration
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-blue-950">
                Username*
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-3 border border-blue-950 rounded mt-1"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm">{formik.errors.username}</div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-950">
                Email*
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-blue-950 rounded mt-1"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-950">
                Password*
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-blue-950 rounded mt-1"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}
            </div>

            <div>
              <label htmlFor="docs" className="block text-sm font-medium text-blue-950">
                Docs URL (e.g., License, ID)*
              </label>
              <input
                type="url"
                id="docs"
                className="w-full p-3 border border-blue-950 rounded mt-1"
                placeholder="https://..."
                {...formik.getFieldProps("docs")}
              />
              {formik.touched.docs && formik.errors.docs && (
                <div className="text-red-500 text-sm">{formik.errors.docs}</div>
              )}
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full bg-orange text-white p-3 rounded-lg font-semibold hover:bg-orangeLight transition"
            >
              Create Account
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-babyBlue hover:underline">
              Sign in
            </Link>
          </div>
          <Link to="/sign_up_options" className="text-babyBlue hover:underline text-center block">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
