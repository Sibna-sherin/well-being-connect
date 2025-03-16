
import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from "../controllers/notificationController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user notifications
router.get("/", getUserNotifications);

// Mark notification as read
router.patch("/read/:id", markNotificationAsRead);

// Mark all notifications as read
router.patch("/read-all", markAllNotificationsAsRead);

// Delete a notification
router.delete("/:id", deleteNotification);

export default router;
