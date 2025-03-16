
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  type: { 
    type: String, 
    enum: ["appointment_created", "appointment_confirmed", "appointment_cancelled", "appointment_rescheduled", "doctor_approved", "system_notification", "follow_up_reminder"],
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  relatedEntity: { 
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'entityModel'
  },
  entityModel: {
    type: String,
    enum: ['Appointment', 'User']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
