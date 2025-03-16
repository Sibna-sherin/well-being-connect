
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "mindease_jwt_secret", {
    expiresIn: "30d"
  });
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists with this email" 
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      address,
      // Set additional fields based on role
      verified: role === "user" ? true : false, // Users auto-verified, doctors need approval
      approved: role === "doctor" ? false : true, // Doctors need admin approval
    });

    // If user is created successfully, generate token and send response
    if (user) {
      const token = generateToken(user._id);
      
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          approved: user.approved,
          token
        }
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed: " + error.message 
    });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      // Check if doctor is approved
      if (user.role === "doctor" && !user.approved) {
        return res.status(403).json({ 
          success: false, 
          message: "Your account is pending approval by administrators" 
        });
      }

      // Generate token and send response
      const token = generateToken(user._id);
      
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          approved: user.approved,
          token
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Login failed: " + error.message 
    });
  }
};

// Get current user's profile
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch profile: " + error.message 
    });
  }
};

// Reset password request (sends email with reset link/token)
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found with this email" 
      });
    }
    
    // Generate password reset token (would be emailed to user in a real app)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_RESET_SECRET || "mindease_reset_secret",
      { expiresIn: "1h" }
    );
    
    // In a real app, send an email with the reset link here
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: "Password reset instructions sent to your email",
      // In development only - remove in production
      resetToken
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Password reset request failed: " + error.message 
    });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_RESET_SECRET || "mindease_reset_secret"
    );
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Invalid or expired token" 
      });
    }
    
    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    res.json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Password reset failed: " + error.message 
    });
  }
};
