const stockRepository = require('../repository/stockRepository');
const stockApiService = require('./stockApiService');
const { emitStockPriceUpdate } = require('../config/socket');
const ApiError = require('../utils/apiError');

class StockService {
  async getStocks(params) {
    return await stockRepository.findAll(params);
  }

  async getStockById(id) {
    const stock = await stockRepository.findById(id);
    if (!stock) {
      throw new ApiError(404, 'Stock not found');
    }

    // Try fetching real-time quote if API key configured
    const liveQuote = await stockApiService.fetchLiveQuote(stock.symbol);
    if (liveQuote) {
      stock.currentPrice = liveQuote.currentPrice;
      stock.high = Math.max(stock.high, liveQuote.high);
      stock.low = Math.min(stock.low, liveQuote.low);
      await stock.save();
    }

    return stock;
  }

  async createStock(stockData) {
    const existing = await stockRepository.findBySymbol(stockData.symbol);
    if (existing) {
      throw new ApiError(400, `Stock symbol ${stockData.symbol.toUpperCase()} already exists`);
    }
    
    if (!stockData.openPrice) stockData.openPrice = stockData.currentPrice;
    if (!stockData.high) stockData.high = stockData.currentPrice;
    if (!stockData.low) stockData.low = stockData.currentPrice;

    stockData.historicalData = [{ price: stockData.currentPrice, timestamp: new Date() }];

    return await stockRepository.create(stockData);
  }

  async updateStock(id, stockData) {
    const stock = await stockRepository.updateById(id, stockData);
    if (!stock) {
      throw new ApiError(404, 'Stock not found');
    }
    return stock;
  }

  async deleteStock(id) {
    const stock = await stockRepository.deleteById(id);
    if (!stock) {
      throw new ApiError(404, 'Stock not found');
    }
    return stock;
  }

  /**
   * Helper function for simulating live tick price fluctuations & broadcasting via Socket.IO
   */
  async updateLivePrices() {
    const stocks = await stockRepository.getAllSymbols();
    for (const stock of stocks) {
      // 0.5% random change
      const deltaPercent = (Math.random() * 2 - 1) * 0.005;
      const newPrice = Number((stock.currentPrice * (1 + deltaPercent)).toFixed(2));
      const newHigh = Math.max(stock.high || newPrice, newPrice);
      const newLow = Math.min(stock.low || newPrice, newPrice);

      const updated = await stockRepository.updatePrice(stock._id, newPrice, newHigh, newLow);
      
      emitStockPriceUpdate({
        _id: stock._id,
        symbol: stock.symbol,
        currentPrice: newPrice,
        openPrice: stock.openPrice,
        high: newHigh,
        low: newLow,
        change: Number((newPrice - stock.openPrice).toFixed(2)),
        changePercent: Number((((newPrice - stock.openPrice) / stock.openPrice) * 100).toFixed(2)),
      });
    }
  }
}

module.exports = new StockService();
