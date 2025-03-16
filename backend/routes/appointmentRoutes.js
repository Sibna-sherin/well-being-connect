
import express from "express";
import {
  bookAppointment,
  getUserAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  completeAppointment
} from "../controllers/appointmentController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Patient routes
router.post("/", authenticate, authorize("user"), bookAppointment);
router.get("/my-appointments", authenticate, authorize("user"), getUserAppointments);
router.patch("/cancel/:id", authenticate, authorize("user"), cancelAppointment);

// Doctor routes
router.get("/doctor-appointments", authenticate, authorize("doctor"), getDoctorAppointments);
router.patch("/update-status/:id", authenticate, authorize("doctor"), updateAppointmentStatus);
router.patch("/complete/:id", authenticate, authorize("doctor"), completeAppointment);

export default router;
