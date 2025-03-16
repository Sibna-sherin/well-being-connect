
import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  day: { 
    type: String, 
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Compound index to ensure a doctor doesn't have duplicate entries for the same day
availabilitySchema.index({ doctor: 1, day: 1 }, { unique: true });

const Availability = mongoose.model("Availability", availabilitySchema);

export default Availability;
