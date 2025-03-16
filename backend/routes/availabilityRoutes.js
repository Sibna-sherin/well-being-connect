
import express from "express";
import {
  setAvailability,
  getDoctorAvailability,
  deleteAvailability,
  setBulkAvailability
} from "../controllers/availabilityController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes to view doctor availability
router.get("/:id", getDoctorAvailability);

// Doctor routes
router.get("/", authenticate, authorize("doctor"), getDoctorAvailability);
router.post("/", authenticate, authorize("doctor"), setAvailability);
router.post("/bulk", authenticate, authorize("doctor"), setBulkAvailability);
router.delete("/:day", authenticate, authorize("doctor"), deleteAvailability);

export default router;
