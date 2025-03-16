
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User schema with additional fields for different roles
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "doctor", "admin"], default: "user" },
  phone: { type: String },
  address: { type: String },
  verified: { type: Boolean, default: false },
  // Fields for doctors
  specialty: { type: String }, // For doctors only
  qualifications: { type: String }, // For doctors only
  experience: { type: Number }, // For doctors only
  approved: { type: Boolean, default: false }, // For doctors only
  consultationFee: { type: Number }, // For doctors only
  bio: { type: String }, // For doctors only
  profileImage: { type: String }, // URL to profile image
  // Common fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
