import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  emailOrUsername: Yup.string().required("Email or username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto-redirect if already logged in


  const formik = useFormik({
    initialValues: {
      emailOrUsername: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError("");
      if (values.emailOrUsername=="admin" && values.password=="ADMIN135"){
        navigate("/admin");
      }
      if (!role) {
        alert("Please select a role");
        return;
      }
      const url =
        role === "user"
          ? `${import.meta.env.VITE_BACKEND_URL}/loginValidate`
          : `${import.meta.env.VITE_BACKEND_URL}/plannerLoginValidate`;

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials:"include",
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (res.status === 403 && data.error === "Unverified") {
          navigate("/verify-email", {
            state: { email: data.email, isPlanner: role === "eventPlanner" },
          });
          return;
        }

        if (!res.ok) {
          setError(data.error || "Login failed");
          return;
        }

        // Redirect based on role
        navigate(role === "user" ? "/" : "/eventPlanner");

      } catch (err) {
        console.error("Login error:", err);
        setError("Something went wrong");
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
            Sign in to Eventure
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="emailOrUsername" className="block text-sm font-medium text-blue-950">
                Email or Username*
              </label>
              <input
                type="text"
                id="emailOrUsername"
                placeholder="Enter your email or username"
                className="w-full p-3 border border-blue-950 rounded mt-1"
                {...formik.getFieldProps("emailOrUsername")}
              />
              {formik.touched.emailOrUsername && formik.errors.emailOrUsername && (
                <div className="text-red-500 text-sm">{formik.errors.emailOrUsername}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-950">
                Password*
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-blue-950 rounded mt-1"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}
              <Link
                className="text-sm text-babyBlue hover:underline mt-1 inline-block"
                to={"/forgotPassword"}
              >
                Forgot Password?
              </Link>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button
              type="submit"
              className="w-full bg-orange text-white py-3 rounded font-bold hover:bg-orangeLight transition"
            >
              Sign In
            </button>

            <div className="flex items-center space-x-4 mt-4">
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
          </form>

          <div className="text-center text-sm text-gray-600">
            New to Eventure?{" "}
            <Link
              className="text-sm text-babyBlue hover:underline mt-1 inline-block"
              to={"/sign_up_options"}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
