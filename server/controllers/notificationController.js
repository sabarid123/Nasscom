const notificationService = require('../services/notificationService');
const ApiResponse = require('../utils/apiResponse');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getUserNotifications(req.user._id);
      res.status(200).json(new ApiResponse(200, notifications, 'Notifications retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(req.params.id, req.user._id);
      res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead(req.user._id);
      res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      await notificationService.deleteNotification(req.params.id, req.user._id);
      res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
