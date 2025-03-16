
import PatientRecord from "../models/PatientRecord.js";
import Appointment from "../models/Appointment.js";

// Get all patient records (for a doctor)
export const getDoctorPatientRecords = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { patientId } = req.query;
    
    const filter = { doctor: doctorId };
    
    // Filter by patient if provided
    if (patientId) {
      filter.patient = patientId;
    }
    
    const records = await PatientRecord.find(filter)
      .populate("patient", "name email profileImage")
      .populate("appointment", "date startTime endTime")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error("Error fetching patient records:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch patient records: " + error.message 
    });
  }
};

// Get all records for a specific patient (patient access)
export const getPatientRecords = async (req, res) => {
  try {
    const patientId = req.user._id;
    
    const records = await PatientRecord.find({ patient: patientId })
      .populate("doctor", "name specialty profileImage")
      .populate("appointment", "date startTime endTime")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error("Error fetching patient records:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch patient records: " + error.message 
    });
  }
};

// Get a specific record by ID
export const getRecordById = async (req, res) => {
  try {
    const recordId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    const record = await PatientRecord.findById(recordId)
      .populate("patient", "name email profileImage")
      .populate("doctor", "name specialty profileImage")
      .populate("appointment", "date startTime endTime status");
    
    if (!record) {
      return res.status(404).json({ 
        success: false, 
        message: "Record not found" 
      });
    }
    
    // Security check: only the associated doctor or patient can view the record
    if (
      userRole !== "admin" && 
      record.patient._id.toString() !== userId.toString() && 
      record.doctor._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({ 
        success: false, 
        message: "You do not have permission to view this record" 
      });
    }
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch record: " + error.message 
    });
  }
};

// Update a patient record (doctor only)
export const updateRecord = async (req, res) => {
  try {
    const { diagnosis, prescription, notes, followUpRecommended, followUpDate } = req.body;
    const recordId = req.params.id;
    const doctorId = req.user._id;
    
    // Find the record
    const record = await PatientRecord.findById(recordId);
    
    if (!record) {
      return res.status(404).json({ 
        success: false, 
        message: "Record not found" 
      });
    }
    
    // Ensure doctor owns this record
    if (record.doctor.toString() !== doctorId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only update your own patient records" 
      });
    }
    
    // Update record
    record.diagnosis = diagnosis || record.diagnosis;
    record.prescription = prescription || record.prescription;
    record.notes = notes || record.notes;
    
    if (followUpRecommended !== undefined) {
      record.followUpRecommended = followUpRecommended;
      record.followUpDate = followUpRecommended && followUpDate ? new Date(followUpDate) : null;
    }
    
    await record.save();
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update record: " + error.message 
    });
  }
};

// Get patient consultation history (doctor view)
export const getPatientConsultationHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user._id;
    
    // Find all records for this patient by this doctor
    const records = await PatientRecord.find({ 
      doctor: doctorId,
      patient: patientId 
    })
      .populate("appointment", "date startTime endTime status")
      .sort({ createdAt: -1 });
    
    // Find all appointments for this patient by this doctor
    const appointments = await Appointment.find({
      doctor: doctorId,
      patient: patientId
    }).sort({ date: -1 });
    
    res.json({
      success: true,
      data: {
        records,
        appointments
      }
    });
  } catch (error) {
    console.error("Error fetching patient history:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch patient history: " + error.message 
    });
  }
};
