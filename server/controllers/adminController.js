const userRepository = require('../repository/userRepository');
const transactionRepository = require('../repository/transactionRepository');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');
const ApiResponse = require('../utils/apiResponse');
const { exportToCSV } = require('../utils/csvExporter');

class AdminController {
  async getDashboardAnalytics(req, res, next) {
    try {
      const { users, total: totalUsers } = await userRepository.findAll({}, 1, 1000);
      const totalStocks = await Stock.countDocuments();
      
      const totalTransactions = await Transaction.countDocuments();
      const volumeAggregation = await Transaction.aggregate([
        { $match: { status: 'COMPLETED' } },
        { $group: { _id: null, totalVolume: { $sum: '$totalAmount' } } },
      ]);

      const totalVolume = volumeAggregation.length > 0 ? volumeAggregation[0].totalVolume : 0;

      const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
      const totalWalletFunds = users.reduce((sum, u) => sum + (u.walletBalance || 0), 0);

      res.status(200).json(
        new ApiResponse(200, {
          totalUsers,
          activeUsers,
          totalStocks,
          totalTransactions,
          totalVolume: Number(totalVolume.toFixed(2)),
          totalWalletFunds: Number(totalWalletFunds.toFixed(2)),
        }, 'Admin analytics dashboard data')
      );
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const result = await userRepository.findAll({}, page, limit);
      res.status(200).json(new ApiResponse(200, result, 'Users list retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { status, role } = req.body;
      const updateData = {};
      if (status) updateData.status = status;
      if (role) updateData.role = role;

      const user = await userRepository.updateById(req.params.id, updateData);
      res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userRepository.deleteById(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getAllTransactions(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const result = await transactionRepository.findAll(page, limit);
      res.status(200).json(new ApiResponse(200, result, 'All system transactions'));
    } catch (error) {
      next(error);
    }
  }

  async exportTransactionsCSV(req, res, next) {
    try {
      const { transactions } = await transactionRepository.findAll(1, 10000);
      const csvData = transactions.map((t) => ({
        TransactionID: t._id,
        User: t.userId ? t.userId.email : 'N/A',
        Stock: t.stockId ? t.stockId.symbol : 'N/A',
        Type: t.type,
        Quantity: t.quantity,
        Price: t.price,
        TotalAmount: t.totalAmount,
        Status: t.status,
        Date: t.createdAt,
      }));

      const fields = ['TransactionID', 'User', 'Stock', 'Type', 'Quantity', 'Price', 'TotalAmount', 'Status', 'Date'];
      const csv = exportToCSV(csvData, fields);

      res.header('Content-Type', 'text/csv');
      res.attachment('system_transactions_report.csv');
      return res.send(csv);
    } catch (error) {
      next(error);
    }
  }
  async deleteTransaction(req, res, next) {
    try {
      await transactionRepository.deleteById(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Transaction deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
