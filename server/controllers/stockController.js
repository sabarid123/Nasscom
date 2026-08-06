const stockService = require('../services/stockService');
const ApiResponse = require('../utils/apiResponse');

class StockController {
  async getStocks(req, res, next) {
    try {
      const result = await stockService.getStocks(req.query);
      res.status(200).json(new ApiResponse(200, result, 'Stocks retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getStockById(req, res, next) {
    try {
      const stock = await stockService.getStockById(req.params.id);
      res.status(200).json(new ApiResponse(200, stock, 'Stock details retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async createStock(req, res, next) {
    try {
      const stock = await stockService.createStock(req.body);
      res.status(201).json(new ApiResponse(201, stock, 'Stock created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req, res, next) {
    try {
      const stock = await stockService.updateStock(req.params.id, req.body);
      res.status(200).json(new ApiResponse(200, stock, 'Stock updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteStock(req, res, next) {
    try {
      await stockService.deleteStock(req.params.id);
      res.status(200).json(new ApiResponse(200, null, 'Stock deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StockController();
