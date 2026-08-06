const tradeService = require('../services/tradeService');
const ApiResponse = require('../utils/apiResponse');

class TradeController {
  async buyStock(req, res, next) {
    try {
      const { stockId, quantity } = req.body;
      const result = await tradeService.buyStock(req.user._id, stockId, quantity);
      res.status(200).json(new ApiResponse(200, result, 'Stock purchase completed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async sellStock(req, res, next) {
    try {
      const { stockId, quantity } = req.body;
      const result = await tradeService.sellStock(req.user._id, stockId, quantity);
      res.status(200).json(new ApiResponse(200, result, 'Stock sale completed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const result = await tradeService.getUserTransactions(req.user._id, page, limit);
      res.status(200).json(new ApiResponse(200, result, 'Transactions retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req, res, next) {
    try {
      await tradeService.deleteTransaction(req.params.id, req.user._id);
      res.status(200).json(new ApiResponse(200, null, 'Transaction deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async clearAllTransactions(req, res, next) {
    try {
      await tradeService.clearUserTransactions(req.user._id);
      res.status(200).json(new ApiResponse(200, null, 'All transaction history cleared'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TradeController();
