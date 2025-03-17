import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// 🔑 Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "mindease_jwt_secret", {
    expiresIn: "30d",
  });
};

// 📝 Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      verified: role === "user",
      approved: role === "doctor" ? false : true,
    });

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
          token,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed: " + error.message });
  }
};

// 🔓 Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.role === "doctor" && !user.approved) {
        return res.status(403).json({ success: false, message: "Your account is pending approval by administrators" });
      }

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
          token,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed: " + error.message });
  }
};

// 🔍 Get logged-in user's profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile: " + error.message });
  }
};

// 🔄 Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetTokenExpires = Date.now() + 3600000;

    await user.save();

    console.log(`Password reset link: ${resetToken}`);

    res.json({ success: true, message: "Password reset instructions sent to your email", resetToken });
  } catch (error) {
    res.status(500).json({ success: false, message: "Password reset request failed: " + error.message });
  }
};

// 🔑 Reset password using token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetToken: hashedToken, resetTokenExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired password reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Password reset failed: " + error.message });
  }
};
