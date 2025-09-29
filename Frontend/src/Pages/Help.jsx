import { useState } from "react";
import Header from "../components/userHeader";
import Footer from "../components/adminFooter";
import * as Yup from "yup";
import { useFormik } from "formik";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .matches(/^[a-zA-Z\s]+$/, "Full name must contain only letters and spaces"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{11}$/, "Phone number must be exactly 11 digits"),
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters long"),
});

export default function Help() {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen ">
      <div>
        {/* Header */}
        <Header />
      </div>
      {/* Middle Section */}
      <div className=" bg-gradient-to-r from-blue-50 to-blue-50 px-60 py-20">
        <h1 className="text-2xl md:text-3xl text--clr-Blue font-bold mb-10 md:mb-20">
          Contact Us
        </h1>
        <div className="flex flex-col-reverse lg:flex-row justify-between">
          <div>
            <img
              src="../utils/contact.png"
              alt="Contact"
              className="mb-10 basis-3/5 py-20"
            />
            <h4 className="text-2xl md:text-3xl text--clr-Blue font-bold mb-10 md:mb-20">
              Keep in touch
            </h4>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 basis-2/5 w-full"
          >
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
              for=":r5:-form-item"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Full Name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3.5 md:p-4 pe-12 text-sm shadow-sm bg-white border ${
                formik.touched.fullName && formik.errors.fullName
                  ? "border-red-500"
                  : "border-gray-300"
              } placeholder:text-[#808080]/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-3`}
              required
            />
            {formik.touched.fullName && formik.errors.fullName ? (
              <div className="text-red-500 text-sm">
                {formik.errors.fullName}
              </div>
            ) : null}

            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
              for=":r5:-form-item"
            >
              Phone Number
            </label>
            <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-3.5 md:p-4 pe-12 text-sm shadow-sm bg-white border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} placeholder:text-[#808080]/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-3`}
                required
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>
              ) : null}
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
              for=":r5:-form-item"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3.5 md:p-4 pe-12 text-sm shadow-sm bg-white border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} placeholder:text-[#808080]/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-3`}
              required
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}

            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
              for=":r5:-form-item"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              className={`flex min-h-[80px] w-full rounded-[22px] border ${formik.touched.message && formik.errors.message ? 'border-red-500' : 'border-gray-300'} placeholder:text-[#808080]/50 focus:border-blue-500 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-32`}
              rows="4"
            />
            {formik.touched.message && formik.errors.message ? (
              <div className="text-red-500 text-sm">{formik.errors.message}</div>
            ) : null}
            
            <button
              type="submit"
              className="bg-blue-950 text-white p-2 rounded hover:bg-blue-800 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
