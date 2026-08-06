const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

const memoryTransactions = [];

class TransactionRepository {
  async create(transactionData, session = null) {
    if (mongoose.connection.readyState === 1) {
      try {
        if (session) {
          const [transaction] = await Transaction.create([transactionData], { session });
          return transaction;
        }
        return await Transaction.create(transactionData);
      } catch (err) {}
    }
    const t = {
      _id: '65c123456789abcdef9000' + (memoryTransactions.length + 1),
      ...transactionData,
      createdAt: new Date(),
    };
    memoryTransactions.unshift(t);
    return t;
  }

  async findByUserId(userId, page = 1, limit = 10) {
    if (mongoose.connection.readyState === 1) {
      try {
        const skip = (page - 1) * limit;
        const transactions = await Transaction.find({ userId })
          .populate('stockId', 'symbol companyName sector currentPrice')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);

        const total = await Transaction.countDocuments({ userId });
        if (transactions.length > 0) return { transactions, total, page, pages: Math.ceil(total / limit) };
      } catch (err) {}
    }
    const userTx = memoryTransactions.filter((t) => t.userId.toString() === userId.toString());
    return { transactions: userTx, total: userTx.length, page: 1, pages: 1 };
  }

  async findAll(page = 1, limit = 10) {
    if (mongoose.connection.readyState === 1) {
      try {
        const skip = (page - 1) * limit;
        const transactions = await Transaction.find({})
          .populate('userId', 'name email')
          .populate('stockId', 'symbol companyName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);

        const total = await Transaction.countDocuments({});
        if (transactions.length > 0) return { transactions, total, page, pages: Math.ceil(total / limit) };
      } catch (err) {}
    }
    return { transactions: memoryTransactions, total: memoryTransactions.length, page: 1, pages: 1 };
  }
  async deleteById(transactionId, userId = null) {
    if (mongoose.connection.readyState === 1) {
      try {
        const filter = { _id: transactionId };
        if (userId) filter.userId = userId;
        return await Transaction.findOneAndDelete(filter);
      } catch (err) {}
    }
    const idx = memoryTransactions.findIndex(
      (t) =>
        t._id.toString() === transactionId.toString() &&
        (!userId || t.userId.toString() === userId.toString())
    );
    if (idx !== -1) {
      memoryTransactions.splice(idx, 1);
      return true;
    }
    return false;
  }

  async clearAllByUserId(userId) {
    if (mongoose.connection.readyState === 1) {
      try {
        await Transaction.deleteMany({ userId });
        return true;
      } catch (err) {}
    }
    for (let i = memoryTransactions.length - 1; i >= 0; i--) {
      if (memoryTransactions[i].userId.toString() === userId.toString()) {
        memoryTransactions.splice(i, 1);
      }
    }
    return true;
  }
}

module.exports = new TransactionRepository();
