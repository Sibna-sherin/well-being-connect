
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import PatientRecord from "../models/PatientRecord.js";

// Update existing function to use the correct model and add new functionality
export const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists with this email" 
      });
    }
    
    const newUser = await User.create({
      name,
      email,
      password,
      role: role || "user"
    });
    
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add user: " + error.message 
    });
  }
};

// Get all users with optional filtering
export const getUsers = async (req, res) => {
  try {
    const { role, approved } = req.query;
    
    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (approved !== undefined) filter.approved = approved === 'true';
    
    const users = await User.find(filter).select("-password");
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch users: " + error.message 
    });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user: " + error.message 
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage } = req.body;
    const userId = req.user._id;
    
    // Find user and update
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        address,
        profileImage,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update profile: " + error.message 
    });
  }
};

// Update doctor profile (specialized fields)
export const updateDoctorProfile = async (req, res) => {
  try {
    const { 
      name, phone, address, profileImage,
      specialty, qualifications, experience, bio, consultationFee 
    } = req.body;
    
    const userId = req.user._id;
    
    // Ensure user is a doctor
    if (req.user.role !== "doctor") {
      return res.status(403).json({ 
        success: false, 
        message: "Only doctors can update doctor profiles" 
      });
    }
    
    // Find doctor and update
    const doctor = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        address,
        profileImage,
        specialty,
        qualifications,
        experience,
        bio,
        consultationFee,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }
    
    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update doctor profile: " + error.message 
    });
  }
};

// Admin: Approve or reject a doctor
export const approveDoctorStatus = async (req, res) => {
  try {
    const { approved } = req.body;
    const doctorId = req.params.id;
    
    // Find doctor and update approval status
    const doctor = await User.findByIdAndUpdate(
      doctorId,
      {
        approved,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }
    
    // Check if user is actually a doctor
    if (doctor.role !== "doctor") {
      return res.status(400).json({ 
        success: false, 
        message: "This user is not a doctor" 
      });
    }
    
    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error("Error approving/rejecting doctor:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update doctor status: " + error.message 
    });
  }
};

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const { specialty, approved } = req.query;
    
    // Build filter object
    const filter = { role: "doctor" };
    if (specialty) filter.specialty = specialty;
    if (approved !== undefined) filter.approved = approved === 'true';
    
    const doctors = await User.find(filter).select("-password");
    
    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch doctors: " + error.message 
    });
  }
};

// Get doctor by ID with availability
export const getDoctorWithAvailability = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    const doctor = await User.findById(doctorId).select("-password");
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }
    
    // Check if user is a doctor
    if (doctor.role !== "doctor") {
      return res.status(400).json({ 
        success: false, 
        message: "This user is not a doctor" 
      });
    }
    
    // Get doctor's availability
    const availability = await Availability.find({ doctor: doctorId });
    
    res.json({
      success: true,
      data: {
        doctor,
        availability
      }
    });
  } catch (error) {
    console.error("Error fetching doctor with availability:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch doctor with availability: " + error.message 
    });
  }
};

// Delete a user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Delete user and related data
    await User.findByIdAndDelete(userId);
    
    // Also delete related data (appointments, patient records, etc.)
    if (user.role === "doctor") {
      await Appointment.deleteMany({ doctor: userId });
      await Availability.deleteMany({ doctor: userId });
      await PatientRecord.deleteMany({ doctor: userId });
    } else if (user.role === "user") {
      await Appointment.deleteMany({ patient: userId });
      await PatientRecord.deleteMany({ patient: userId });
    }
    
    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete user: " + error.message 
    });
  }
};
