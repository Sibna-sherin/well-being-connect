
import Availability from "../models/Availability.js";

// Set doctor availability
export const setAvailability = async (req, res) => {
  try {
    const { day, startTime, endTime, isAvailable } = req.body;
    const doctorId = req.user._id;
    
    // Check if availability already exists for this doctor and day
    let availability = await Availability.findOne({ doctor: doctorId, day });
    
    if (availability) {
      // Update existing availability
      availability.startTime = startTime;
      availability.endTime = endTime;
      availability.isAvailable = isAvailable;
      
      await availability.save();
    } else {
      // Create new availability
      availability = await Availability.create({
        doctor: doctorId,
        day,
        startTime,
        endTime,
        isAvailable
      });
    }
    
    res.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error("Error setting availability:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to set availability: " + error.message 
    });
  }
};

// Get doctor's availability schedule
export const getDoctorAvailability = async (req, res) => {
  try {
    const doctorId = req.params.id || req.user._id;
    
    const availability = await Availability.find({ doctor: doctorId });
    
    res.json({
      success: true,
      count: availability.length,
      data: availability
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch availability: " + error.message 
    });
  }
};

// Delete a day from availability
export const deleteAvailability = async (req, res) => {
  try {
    const { day } = req.params;
    const doctorId = req.user._id;
    
    const result = await Availability.findOneAndDelete({ doctor: doctorId, day });
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: `No availability found for ${day}` 
      });
    }
    
    res.json({
      success: true,
      message: `Availability for ${day} deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete availability: " + error.message 
    });
  }
};

// Set bulk availability (multiple days at once)
export const setBulkAvailability = async (req, res) => {
  try {
    const { schedule } = req.body;
    const doctorId = req.user._id;
    
    if (!Array.isArray(schedule) || schedule.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Schedule must be a non-empty array" 
      });
    }
    
    const result = [];
    
    for (const item of schedule) {
      const { day, startTime, endTime, isAvailable } = item;
      
      // Find and update or create
      let availability = await Availability.findOne({ doctor: doctorId, day });
      
      if (availability) {
        availability.startTime = startTime;
        availability.endTime = endTime;
        availability.isAvailable = isAvailable;
        await availability.save();
      } else {
        availability = await Availability.create({
          doctor: doctorId,
          day,
          startTime,
          endTime,
          isAvailable
        });
      }
      
      result.push(availability);
    }
    
    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    console.error("Error setting bulk availability:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to set bulk availability: " + error.message 
    });
  }
};
