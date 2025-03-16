
import express from "express";
import { 
  getUsers, 
  getUserById, 
  updateUserProfile, 
  updateDoctorProfile, 
  approveDoctorStatus, 
  getDoctors,
  getDoctorWithAvailability,
  deleteUser
} from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorWithAvailability);

// Protected routes for all users
router.get("/profile", authenticate, getUserById);
router.put("/profile", authenticate, updateUserProfile);

// Doctor routes
router.put("/doctor-profile", authenticate, authorize("doctor"), updateDoctorProfile);

// Admin routes
router.get("/", authenticate, authorize("admin"), getUsers);
router.get("/:id", authenticate, authorize("admin"), getUserById);
router.patch("/approve-doctor/:id", authenticate, authorize("admin"), approveDoctorStatus);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);

export default router;
