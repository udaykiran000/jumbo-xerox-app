// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // DEBUG LOG
  console.log(
    "[DEBUG-AUTH] Headers Received:",
    req.headers.authorization ? "YES" : "NO"
  );

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("[DEBUG-AUTH] Token Verified for UserID:", decoded.id);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(
        "[DEBUG-AUTH-ERR] Token Verification Failed:",
        error.message
      );
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.warn("[DEBUG-AUTH-WARN] No Bearer Token found in headers");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
