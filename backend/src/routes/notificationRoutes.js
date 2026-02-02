const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// User routes (authenticated users)

// Get user's notifications with filters
router.get(
  '/',
  authenticate,
  notificationController.getMyNotifications
);

// Get unread notification count
router.get(
  '/unread-count',
  authenticate,
  notificationController.getUnreadCount
);

// Mark a notification as read
router.put(
  '/:notificationId/read',
  authenticate,
  notificationController.markAsRead
);

// Mark all notifications as read
router.put(
  '/mark-all-read',
  authenticate,
  notificationController.markAllAsRead
);

// Delete a notification
router.delete(
  '/:notificationId',
  authenticate,
  notificationController.deleteNotification
);

// Get notification preferences
router.get(
  '/preferences',
  authenticate,
  notificationController.getPreferences
);

// Update notification preferences
router.put(
  '/preferences',
  authenticate,
  notificationController.updatePreferences
);

// Admin routes

// Send notification to specific user(s)
router.post(
  '/send',
  authenticate,
  authorizeRole('admin'),
  notificationController.sendNotification
);

module.exports = router;

