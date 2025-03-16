
import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import User from "../models/User.js";
import PatientRecord from "../models/PatientRecord.js";
import Notification from "../models/Notification.js";

// Book a new appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, startTime, endTime, notes } = req.body;
    const patientId = req.user._id;
    
    // Check if doctor exists and is approved
    const doctor = await User.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }
    
    if (doctor.role !== "doctor") {
      return res.status(400).json({ 
        success: false, 
        message: "Selected user is not a doctor" 
      });
    }
    
    if (!doctor.approved) {
      return res.status(400).json({ 
        success: false, 
        message: "This doctor has not been approved yet" 
      });
    }
    
    // Convert date string to Date object
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.toLocaleString('en-us', { weekday: 'long' });
    
    // Check doctor's availability for that day and time
    const availability = await Availability.findOne({
      doctor: doctorId,
      day: dayOfWeek,
      isAvailable: true
    });
    
    if (!availability) {
      return res.status(400).json({ 
        success: false, 
        message: `Doctor is not available on ${dayOfWeek}` 
      });
    }
    
    // Check if the requested time is within the doctor's available hours
    const availableStartTime = availability.startTime;
    const availableEndTime = availability.endTime;
    
    if (startTime < availableStartTime || endTime > availableEndTime) {
      return res.status(400).json({ 
        success: false, 
        message: `Doctor is only available from ${availableStartTime} to ${availableEndTime} on ${dayOfWeek}` 
      });
    }
    
    // Check if doctor already has an appointment at this time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59))
      },
      startTime,
      status: { $in: ["pending", "confirmed"] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ 
        success: false, 
        message: "Doctor already has an appointment at this time" 
      });
    }
    
    // Create the appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date: appointmentDate,
      startTime,
      endTime,
      notes,
      status: "pending"
    });
    
    // Create notification for the doctor
    await Notification.create({
      recipient: doctorId,
      sender: patientId,
      type: "appointment_created",
      message: `You have a new appointment request for ${appointmentDate.toDateString()} at ${startTime}`,
      relatedEntity: appointment._id,
      entityModel: "Appointment"
    });
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to book appointment: " + error.message 
    });
  }
};

// Get all user's appointments
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const appointments = await Appointment.find({ patient: userId })
      .populate("doctor", "name specialty profileImage")
      .sort({ date: 1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch appointments: " + error.message 
    });
  }
};

// Get all doctor's appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    
    // Filter by status if provided
    const { status, date } = req.query;
    const filter = { doctor: doctorId };
    
    if (status) {
      filter.status = status;
    }
    
    if (date) {
      filter.date = {
        $gte: new Date(new Date(date).setHours(0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59))
      };
    }
    
    const appointments = await Appointment.find(filter)
      .populate("patient", "name email profileImage")
      .sort({ date: 1, startTime: 1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch appointments: " + error.message 
    });
  }
};

// Update appointment status (doctor only)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointmentId = req.params.id;
    const doctorId = req.user._id;
    
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: "Appointment not found" 
      });
    }
    
    // Ensure doctor owns this appointment
    if (appointment.doctor.toString() !== doctorId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only update your own appointments" 
      });
    }
    
    // Update appointment
    appointment.status = status;
    if (notes) appointment.notes = notes;
    
    await appointment.save();
    
    // Create notification for the patient
    await Notification.create({
      recipient: appointment.patient,
      sender: doctorId,
      type: `appointment_${status}`,
      message: `Your appointment for ${new Date(appointment.date).toDateString()} at ${appointment.startTime} has been ${status}`,
      relatedEntity: appointment._id,
      entityModel: "Appointment"
    });
    
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update appointment: " + error.message 
    });
  }
};

// Cancel appointment (patient only)
export const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const patientId = req.user._id;
    
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: "Appointment not found" 
      });
    }
    
    // Ensure patient owns this appointment
    if (appointment.patient.toString() !== patientId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only cancel your own appointments" 
      });
    }
    
    // Update appointment
    appointment.status = "cancelled";
    await appointment.save();
    
    // Create notification for the doctor
    await Notification.create({
      recipient: appointment.doctor,
      sender: patientId,
      type: "appointment_cancelled",
      message: `The patient has cancelled their appointment for ${new Date(appointment.date).toDateString()} at ${appointment.startTime}`,
      relatedEntity: appointment._id,
      entityModel: "Appointment"
    });
    
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to cancel appointment: " + error.message 
    });
  }
};

// Complete appointment and add patient record
export const completeAppointment = async (req, res) => {
  try {
    const { diagnosis, prescription, notes, followUpRecommended, followUpDate } = req.body;
    const appointmentId = req.params.id;
    const doctorId = req.user._id;
    
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: "Appointment not found" 
      });
    }
    
    // Ensure doctor owns this appointment
    if (appointment.doctor.toString() !== doctorId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only complete your own appointments" 
      });
    }
    
    // Update appointment status
    appointment.status = "completed";
    await appointment.save();
    
    // Create patient record
    const patientRecord = await PatientRecord.create({
      patient: appointment.patient,
      doctor: doctorId,
      appointment: appointmentId,
      diagnosis,
      prescription,
      notes,
      followUpRecommended,
      followUpDate: followUpRecommended ? new Date(followUpDate) : null
    });
    
    // Create notification for the patient
    await Notification.create({
      recipient: appointment.patient,
      sender: doctorId,
      type: "appointment_completed",
      message: `Your appointment has been completed. Your diagnosis and prescription are available.`,
      relatedEntity: appointment._id,
      entityModel: "Appointment"
    });
    
    // Create follow-up reminder if recommended
    if (followUpRecommended && followUpDate) {
      await Notification.create({
        recipient: appointment.patient,
        sender: doctorId,
        type: "follow_up_reminder",
        message: `Your doctor recommends a follow-up appointment on ${new Date(followUpDate).toDateString()}`,
        relatedEntity: appointment._id,
        entityModel: "Appointment"
      });
    }
    
    res.json({
      success: true,
      data: {
        appointment,
        patientRecord
      }
    });
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to complete appointment: " + error.message 
    });
  }
};
