import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

// @desc Protect routes - Verify JWT token
// @route Middleware for protected routes
// @access Private
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // 2. Extract token from "Bearer eyJhbGci..."
      token = req.headers.authorization.split(" ")[1];
      console.log("TOKEN RECEIVED");

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("TOKEN DECODED:", decoded.userId);

      // 4. Get user from DB and attach to request object
      req.user = await User.findById(decoded.userId).select("-password");

      // 5. Check if user still exists
      if (!req.user) {
        console.log("USER NOT FOUND IN DB");
        return res.status(401).json({
          success: false,
          message: "User not found. Please login again.",
        });
      }

      console.log("USER AUTHENTICATED:", req.user.email);

      // 6. Continue to next middleware/route
      next();

    } else {
      console.log("NO TOKEN PROVIDED");
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }
  } catch (error) {
    console.log("MIDDLEWARE ERROR:", error.message);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      error: error.message,
    });
  }
};