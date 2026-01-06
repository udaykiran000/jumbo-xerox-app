const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Token Generation
const generateToken = (id, name, role) => {
  return jwt.sign({ id, name, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// --- REGISTER DEBUG LOGS ---
exports.register = async (req, res) => {
  console.log("\n--- [START] Register Attempt ---");
  const { name, email, password } = req.body;
  console.log("Data Received:", { name, email, password: "PROTECTED" });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("DEBUG: User already exists in Database.");
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("DEBUG: Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("DEBUG: Password hashed successfully.");

    const user = await User.create({ name, email, password: hashedPassword });
    console.log("DEBUG: User saved to MongoDB with ID:", user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.name, user.role),
    });
    console.log("--- [SUCCESS] Register Completed ---\n");
  } catch (error) {
    console.error("DEBUG: Register Error ->", error.message);
    res.status(500).json({ message: error.message });
  }
};

// --- LOGIN DEBUG LOGS ---
exports.login = async (req, res) => {
  console.log("\n--- [START] Login Attempt ---");
  const { email, password } = req.body;
  console.log("Login Input Email:", email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("DEBUG: No user found with this email in Database.");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("DEBUG: User found. Comparing passwords...");
    console.log("DEBUG: Stored Hash in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("DEBUG: Password match result:", isMatch);

    if (isMatch) {
      console.log("DEBUG: Password matches! Generating token...");
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.name, user.role),
      });
      console.log("--- [SUCCESS] Login Completed ---\n");
    } else {
      console.log("DEBUG: Password did NOT match.");
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("DEBUG: Login Error ->", error.message);
    res.status(500).json({ message: error.message });
  }
};
