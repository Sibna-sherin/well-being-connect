
import express from "express";
import {
  getDoctorPatientRecords,
  getPatientRecords,
  getRecordById,
  updateRecord,
  getPatientConsultationHistory
} from "../controllers/recordController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Patient routes
router.get("/my-records", authenticate, authorize("user"), getPatientRecords);

// Doctor routes
router.get("/doctor-records", authenticate, authorize("doctor"), getDoctorPatientRecords);
router.get("/patient/:patientId", authenticate, authorize("doctor"), getPatientConsultationHistory);
router.patch("/:id", authenticate, authorize("doctor"), updateRecord);

// Shared routes (both patient and doctor can access)
router.get("/:id", authenticate, getRecordById);

export default router;
