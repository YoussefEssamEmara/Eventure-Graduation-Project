import React, { useEffect, useState } from "react";
import Footer from "../../components/adminFooter";
import Header from "../../components/userHeader";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactInputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [tickets, setTickets] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/checkSession`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.role === "planner") {
          setIsLoggedIn(true);
          setRole("planner");
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setRole(null);
      });

    const fetchTickets = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getSelectedTickets`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setTickets(data.selectedTickets);
          setTotalPrice(parseFloat(data.totalPrice));
        } else {
          alert("No tickets selected. Please select tickets before checkout.");
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        alert("Could not fetch ticket info.");
      }
    };

    fetchTickets();
  }, []);

  const formik = useFormik({
    initialValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema: Yup.object({
      cardNumber: Yup.string()
        .transform((value) => value.replace(/\s+/g, ""))
        .length(16, "Card number must be 16 digits")
        .matches(/^\d+$/, "Card number must be numeric")
        .required("Card number is required"),
      cardName: Yup.string()
        .matches(/^[a-zA-Z ]+$/, "Card name must contain only alphabets")
        .min(3)
        .required("Card name is required"),
      expiryDate: Yup.string()
        .required("Expiry date is required")
        .test("validExpiry", "Invalid format MM/YY", (value) => {
          const [month, year] = value.split("/").map(Number);
          return month >= 1 && month <= 12 && year >= 0 && year <= 99;
        }),
      cvv: Yup.string()
        .matches(/^\d{3}$/, "CVV must be 3 digits")
        .required("CVV is required"),
    }),
    onSubmit: async () => {
      try {
        if (!otpVerified) {
          alert("Please verify the OTP before proceeding.");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/confirmPurchase`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success) {
          alert("Purchase failed: " + data.error);
          return;
        }

        const qrRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-qr`, {
          credentials: "include",
        });
        const qrData = await qrRes.json();

        if (!qrData.success) {
          alert("Purchase succeeded, but QR codes could not be emailed.");
        } else {
          alert("Payment successful! QR codes have been sent to your email.");
        }

        navigate("/");
      } catch (err) {
        console.error("Checkout error:", err);
        alert("Something went wrong. Try again.");
      }
    },
  });

  const sendOtp = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send-otp`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        alert("OTP has been sent to your email.");
      } else {
        alert("Failed to send OTP.");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      alert("Could not send OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        alert("OTP verified successfully.");
      } else {
        alert("Invalid OTP.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      alert("Could not verify OTP.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-50">
      <Header />
      <div className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={formik.handleSubmit} className="lg:col-span-2 bg-white p-6 rounded shadow space-y-5">
            <div>
              <label className="block mb-1 font-medium">Card Number</label>
              <ReactInputMask
                mask="9999 9999 9999 9999"
                value={formik.values.cardNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {(inputProps) => (
                  <input
                    {...inputProps}
                    name="cardNumber"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Card Number"
                  />
                )}
              </ReactInputMask>
              {formik.touched.cardNumber && formik.errors.cardNumber && (
                <div className="text-red-600 text-sm">{formik.errors.cardNumber}</div>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Cardholder Name</label>
              <input
                name="cardName"
                value={formik.values.cardName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border px-3 py-2 rounded"
              />
              {formik.touched.cardName && formik.errors.cardName && (
                <div className="text-red-600 text-sm">{formik.errors.cardName}</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Expiry Date (MM/YY)</label>
                <ReactInputMask
                  mask="99/99"
                  name="expiryDate"
                  value={formik.values.expiryDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {(inputProps) => (
                    <input {...inputProps} className="w-full border px-3 py-2 rounded" />
                  )}
                </ReactInputMask>
                {formik.touched.expiryDate && formik.errors.expiryDate && (
                  <div className="text-red-600 text-sm">{formik.errors.expiryDate}</div>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">CVV</label>
                <input
                  name="cvv"
                  maxLength={3}
                  value={formik.values.cvv}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border px-3 py-2 rounded"
                />
                {formik.touched.cvv && formik.errors.cvv && (
                  <div className="text-red-600 text-sm">{formik.errors.cvv}</div>
                )}
              </div>
            </div>

            {!otpVerified && (
              <div className="space-y-3">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="bg-blue-950 text-white px-4 py-2 rounded"
                  >
                    Send OTP to Email
                  </button>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={verifyOtp}
                      className="bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>
            )}

            <div>
              <p className="font-semibold mb-2">Total: {totalPrice.toFixed(2)} L.E</p>
              <button
                type="submit"
                disabled={!otpVerified}
                className={`w-full py-3 text-white rounded ${
                  otpVerified ? "bg-blue-950 hover:bg-blue-900" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm & Pay
              </button>
            </div>
          </form>

          <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Tickets</h2>
            {tickets.map((ticket, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  {ticket.quantity} × {ticket.category_name}
                </span>
                <span>{(ticket.price * ticket.quantity).toFixed(2)} L.E</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} L.E</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
