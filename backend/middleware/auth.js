
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Middleware to check if request has a valid JWT token
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No auth token provided. Access denied." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mindease_jwt_secret");
    
    // Find user by id
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ 
      success: false, 
      message: "Authentication failed: " + error.message 
    });
  }
};

// Middleware to check user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized - Not authenticated" 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden - ${req.user.role} is not authorized to access this resource` 
      });
    }

    next();
  };
};
