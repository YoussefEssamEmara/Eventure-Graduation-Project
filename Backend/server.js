const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const limiter = require("./middleware/rateLimiter");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
// CORS configuration
const corsOptions = {
    origin: "http://localhost:5173",  // Add your frontend URL here
    credentials: true, // Allow cookies to be sent
  };
  app.use(cors(corsOptions));

// Rate limiting for auth routes
app.use("/api/auth", limiter);

// Routes
app.use("/api/auth", authRoutes);

// Database connection
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));