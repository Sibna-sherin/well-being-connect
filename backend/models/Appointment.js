
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "completed", "cancelled", "rescheduled"], 
    default: "pending" 
  },
  notes: { 
    type: String 
  },
  followUp: { 
    type: Boolean, 
    default: false 
  },
  meetingLink: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
