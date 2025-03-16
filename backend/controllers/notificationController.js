
import Notification from "../models/Notification.js";

// Get user's notifications
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { read } = req.query;
    
    const filter = { recipient: userId };
    
    // Filter by read status if provided
    if (read !== undefined) {
      filter.read = read === 'true';
    }
    
    const notifications = await Notification.find(filter)
      .populate("sender", "name role")
      .sort({ createdAt: -1 })
      .limit(50); // Limit to most recent 50 notifications
    
    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch notifications: " + error.message 
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    
    // Find the notification
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: "Notification not found" 
      });
    }
    
    // Ensure user owns this notification
    if (notification.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only mark your own notifications as read" 
      });
    }
    
    // Mark as read
    notification.read = true;
    await notification.save();
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to mark notification as read: " + error.message 
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
    
    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to mark all notifications as read: " + error.message 
    });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    
    // Find the notification
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: "Notification not found" 
      });
    }
    
    // Ensure user owns this notification
    if (notification.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only delete your own notifications" 
      });
    }
    
    // Delete notification
    await Notification.findByIdAndDelete(notificationId);
    
    res.json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete notification: " + error.message 
    });
  }
};
