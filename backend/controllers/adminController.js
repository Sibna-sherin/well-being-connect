import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

// ✅ Admin can approve a doctor
export const approveDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.approved = true;
    await doctor.save();

    res.json({ success: true, message: "Doctor approved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await appointment.deleteOne();

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
    });
  }
};
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Get all appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};
