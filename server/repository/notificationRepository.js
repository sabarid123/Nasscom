const Notification = require('../models/Notification');
const mongoose = require('mongoose');

const memoryNotifications = [];

class NotificationRepository {
  async create(userId, title, message) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Notification.create({ userId, title, message });
      } catch (err) {}
    }
    const n = {
      _id: '65c123456789abcdef8000' + (memoryNotifications.length + 1),
      userId,
      title,
      message,
      read: false,
      createdAt: new Date(),
    };
    memoryNotifications.unshift(n);
    return n;
  }

  async findByUserId(userId, limit = 20) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit);
      } catch (err) {}
    }
    return memoryNotifications.filter((n) => n.userId.toString() === userId.toString()).slice(0, limit);
  }

  async markAsRead(notificationId, userId) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Notification.findOneAndUpdate(
          { _id: notificationId, userId },
          { read: true },
          { new: true }
        );
      } catch (err) {}
    }
    const n = memoryNotifications.find((item) => item._id.toString() === notificationId.toString());
    if (n) n.read = true;
    return n;
  }

  async markAllAsRead(userId) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Notification.updateMany({ userId }, { read: true });
      } catch (err) {}
    }
    memoryNotifications.forEach((n) => {
      if (n.userId.toString() === userId.toString()) n.read = true;
    });
    return true;
  }

  async deleteById(notificationId, userId) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Notification.findOneAndDelete({ _id: notificationId, userId });
      } catch (err) {}
    }
    const idx = memoryNotifications.findIndex((n) => n._id.toString() === notificationId.toString());
    if (idx !== -1) memoryNotifications.splice(idx, 1);
    return true;
  }
}

module.exports = new NotificationRepository();
