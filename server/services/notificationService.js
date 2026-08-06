const notificationRepository = require('../repository/notificationRepository');
const { emitNotification } = require('../config/socket');

class NotificationService {
  async sendNotification(userId, title, message) {
    const notification = await notificationRepository.create(userId, title, message);
    emitNotification(userId, notification);
    return notification;
  }

  async getUserNotifications(userId) {
    return await notificationRepository.findByUserId(userId);
  }

  async markAsRead(notificationId, userId) {
    return await notificationRepository.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId) {
    return await notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(notificationId, userId) {
    return await notificationRepository.deleteById(notificationId, userId);
  }
}

module.exports = new NotificationService();
