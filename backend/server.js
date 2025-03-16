
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Set JWT secret if not in .env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "mindease_jwt_secret";
  console.warn("Warning: JWT_SECRET not set in environment variables. Using default value.");
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "Server is healthy", 
    time: new Date().toISOString()
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("MindEASE API is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: "Something broke on the server!",
    error: process.env.NODE_ENV === "production" ? null : err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app for testing
export default app;


console.log("✅ Auth routes loaded");

app.use("/api/auth", authRoutes);

