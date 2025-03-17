import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { getAllAppointments, deleteAppointment } from "../controllers/adminController.js";

const router = express.Router();

router.get("/appointments", authenticate, authorize("admin"), getAllAppointments);
router.delete("/appointments/:id", authenticate, authorize("admin"), deleteAppointment);

export default router;
