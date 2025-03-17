import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "doctor", "admin"], default: "user" },
  phone: { type: String },
  address: { type: String },
  verified: { type: Boolean, default: false },
  
  // Fields for doctors only
  specialty: { type: String, default: "" }, 
  qualifications: { type: String, default: "" }, 
  experience: { type: Number, default: 0 },
  approved: { type: Boolean, default: false }, 
  consultationFee: { type: Number, default: 0 },
  bio: { type: String, default: "" }, 
  profileImage: { type: String, default: "" }, 
  
}, { timestamps: true });

// 🔒 Hash password before saving
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

// 🔐 Compare entered password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export User model
const User = mongoose.model("User", userSchema);
export default User;
