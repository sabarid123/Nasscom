const Portfolio = require('../models/Portfolio');
const mongoose = require('mongoose');
const stockRepository = require('./stockRepository');

const memoryPortfolios = {};

class PortfolioRepository {
  async findByUserId(userId) {
    if (mongoose.connection.readyState === 1) {
      try {
        let portfolio = await Portfolio.findOne({ userId }).populate('holdings.stockId');
        if (!portfolio) {
          portfolio = await Portfolio.create({ userId, holdings: [] });
        }
        return portfolio;
      } catch (err) {}
    }
    const key = userId.toString();
    if (!memoryPortfolios[key]) {
      const aapl = await stockRepository.findBySymbol('AAPL');
      memoryPortfolios[key] = {
        userId,
        holdings: aapl
          ? [
              {
                stockId: aapl,
                quantity: 10,
                averagePrice: 180.0,
              },
            ]
          : [],
        save: async function () {
          return this;
        },
      };
    }
    return memoryPortfolios[key];
  }

  async updateHoldings(userId, holdings, session = null) {
    if (mongoose.connection.readyState === 1) {
      try {
        const options = session ? { session, new: true } : { new: true };
        return await Portfolio.findOneAndUpdate({ userId }, { holdings }, { ...options, upsert: true });
      } catch (err) {}
    }
    const key = userId.toString();
    if (!memoryPortfolios[key]) {
      memoryPortfolios[key] = { userId, holdings: [], save: async function () { return this; } };
    }
    memoryPortfolios[key].holdings = holdings;
    return memoryPortfolios[key];
  }
}

module.exports = new PortfolioRepository();
