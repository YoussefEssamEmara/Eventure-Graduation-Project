const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sanitizeInput } = require("../utils/sanitizeInput");

// Register a new user
exports.register = async (req, res) => {
  try {
    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      firstName: sanitizeInput(req.body.firstName),
      lastName: sanitizeInput(req.body.lastName),
      username: sanitizeInput(req.body.username),
      email: sanitizeInput(req.body.email),
      phoneNumber: sanitizeInput(req.body.phoneNumber),
      dob: req.body.dob,
      password: req.body.password,
    };

    // Check for duplicate email or username
    const existingUser = await User.findOne({
      $or: [{ email: sanitizedData.email }, { username: sanitizedData.username }],
    });

    if (existingUser) {
      return res.status(409).json({
        error:
          existingUser.email === sanitizedData.email
            ? "DUPLICATE_EMAIL"
            : "DUPLICATE_USERNAME",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sanitizedData.password, 10);

    // Create new user
    const newUser = new User({
      ...sanitizedData,
      password: hashedPassword,
    });

    await newUser.save();

    // Respond with success
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ error: "INVALID_CREDENTIALS" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "INVALID_CREDENTIALS" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token in httpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      maxAge: 3600000, // 1 hour
    });

    // Respond with success
    res.status(200).json({ success: true, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
};

// Logout a user
exports.logout = (req, res) => {
  try {
    // Clear the authToken cookie
    res.clearCookie("authToken");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
};

// Refresh token (optional)
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "INVALID_TOKEN" });
    }

    // Generate new access token
    const newToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set new token in httpOnly cookie
    res.cookie("authToken", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
};