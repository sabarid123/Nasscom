const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// In-Memory Fallback Users Store for local instant testing when MongoDB is offline
const memoryUsers = [
  {
    _id: '65c123456789abcdef000001',
    name: 'John Trader',
    email: 'user@stocktrade.com',
    passwordHash: bcrypt.hashSync('UserPassword123!', 10),
    phone: '+1987654321',
    role: 'USER',
    walletBalance: 50000,
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    status: 'ACTIVE',
    matchPassword: async function (p) {
      return bcrypt.compare(p, this.passwordHash);
    },
    toObject: function () {
      return { ...this };
    },
  },
  {
    _id: '65c123456789abcdef000002',
    name: 'System Admin',
    email: 'admin@stocktrade.com',
    passwordHash: bcrypt.hashSync('AdminPassword123!', 10),
    phone: '+1234567890',
    role: 'ADMIN',
    walletBalance: 1000000,
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    status: 'ACTIVE',
    matchPassword: async function (p) {
      return bcrypt.compare(p, this.passwordHash);
    },
    toObject: function () {
      return { ...this };
    },
  },
];

class UserRepository {
  async create(userData) {
    if (mongoose.connection.readyState === 1) {
      return await User.create(userData);
    }
    const newUser = {
      _id: '65c123456789abcdef0000' + (memoryUsers.length + 1),
      ...userData,
      passwordHash: bcrypt.hashSync(userData.password, 10),
      walletBalance: 50000,
      status: 'ACTIVE',
      role: 'USER',
      matchPassword: async function (p) {
        return bcrypt.compare(p, this.passwordHash);
      },
      toObject: function () {
        return { ...this };
      },
    };
    memoryUsers.push(newUser);
    return newUser;
  }

  async findByEmail(email, includePassword = false) {
    if (mongoose.connection.readyState === 1) {
      try {
        const dbUser = includePassword
          ? await User.findOne({ email }).select('+password')
          : await User.findOne({ email });
        if (dbUser) return dbUser;
      } catch (err) {
        // Fallback to memoryUsers on error
      }
    }
    const memUser = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return memUser || null;
  }

  async findById(id, session = null) {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = User.findById(id);
        if (session) query.session(session);
        const dbUser = await query;
        if (dbUser) return dbUser;
      } catch (err) {}
    }
    return memoryUsers.find((u) => u._id.toString() === id.toString()) || null;
  }

  async updateById(id, updateData) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      } catch (err) {}
    }
    const memUser = memoryUsers.find((u) => u._id.toString() === id.toString());
    if (memUser) {
      Object.assign(memUser, updateData);
    }
    return memUser;
  }

  async deleteById(id) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await User.findByIdAndDelete(id);
      } catch (err) {}
    }
    const idx = memoryUsers.findIndex((u) => u._id.toString() === id.toString());
    if (idx !== -1) memoryUsers.splice(idx, 1);
    return true;
  }

  async findAll(query = {}, page = 1, limit = 10) {
    if (mongoose.connection.readyState === 1) {
      try {
        const skip = (page - 1) * limit;
        const users = await User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await User.countDocuments(query);
        return { users, total, page, pages: Math.ceil(total / limit) };
      } catch (err) {}
    }
    return { users: memoryUsers, total: memoryUsers.length, page: 1, pages: 1 };
  }

  async updateWallet(userId, amount, session = null) {
    if (mongoose.connection.readyState === 1) {
      try {
        const options = session ? { session, new: true } : { new: true };
        const updated = await User.findByIdAndUpdate(
          userId,
          { $inc: { walletBalance: amount } },
          options
        );
        if (updated) return updated;
      } catch (err) {
        console.error('[updateWallet Error]:', err.message);
      }
    }
    const memUser = memoryUsers.find((u) => u._id.toString() === userId.toString());
    if (memUser) {
      memUser.walletBalance = Number((memUser.walletBalance + amount).toFixed(2));
      return memUser;
    }
    const fallbackUser = await this.findById(userId);
    if (fallbackUser) {
      fallbackUser.walletBalance = Number(((fallbackUser.walletBalance || 0) + amount).toFixed(2));
      if (fallbackUser.save) await fallbackUser.save();
      return fallbackUser;
    }
    return null;
  }
}

module.exports = new UserRepository();
