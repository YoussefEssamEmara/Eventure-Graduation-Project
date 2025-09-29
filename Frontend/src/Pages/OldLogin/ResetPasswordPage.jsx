import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role"); // 👈 get role from query string

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reset-password`, {
          token,
          password: values.password,
          role, // 👈 include role in request body
        });

        alert("Password reset successful!");
        window.location.href = "/login";
      } catch (error) {
        console.error("Reset error:", error);
        alert("Invalid or expired token. Please try again.");
      }
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
          <h2 className="text-2xl font-bold text-gray-700 text-center">Reset Password</h2>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password*
              </label>
              <input
                type="password"
                id="password"
                {...formik.getFieldProps("password")}
                className={`w-full p-3 border rounded mt-1 ${
                  formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                } focus:ring-blue-950 focus:border-blue-950`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password*
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...formik.getFieldProps("confirmPassword")}
                className={`w-full p-3 border rounded mt-1 ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:ring-blue-950 focus:border-blue-950`}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <button className="w-full bg-blue-950 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
              Reset Password
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            <Link to="/login" className="text-sm text-blue-950 hover:underline mt-1 inline-block">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
