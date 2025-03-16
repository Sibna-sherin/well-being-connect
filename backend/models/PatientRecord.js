
import mongoose from "mongoose";

const patientRecordSchema = new mongoose.Schema({
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
  appointment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Appointment" 
  },
  diagnosis: { 
    type: String 
  },
  prescription: { 
    type: String 
  },
  notes: { 
    type: String 
  },
  followUpRecommended: { 
    type: Boolean, 
    default: false 
  },
  followUpDate: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const PatientRecord = mongoose.model("PatientRecord", patientRecordSchema);

export default PatientRecord;
