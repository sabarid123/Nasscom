const Portfolio = require('../models/Portfolio');
const mongoose = require('mongoose');
const stockRepository = require('./stockRepository');

const memoryPortfolios = {};

class PortfolioRepository {
  async findByUserId(userId, session = null) {
    if (mongoose.connection.readyState === 1) {
      try {
        let portfolio = session ? await Portfolio.findOne({ userId }).session(session) : await Portfolio.findOne({ userId });
        if (!portfolio) {
          if (session) {
            const created = await Portfolio.create([{ userId, holdings: [] }], { session });
            portfolio = created[0];
          } else {
            portfolio = await Portfolio.create({ userId, holdings: [] });
          }
        }
        return portfolio;
      } catch (err) {
        console.error('[PortfolioRepository findByUserId error]:', err.message);
        try {
          let portfolio = await Portfolio.findOne({ userId });
          if (!portfolio) portfolio = await Portfolio.create({ userId, holdings: [] });
          return portfolio;
        } catch (_) {}
      }
    }
    const key = userId.toString();
    if (!memoryPortfolios[key]) {
      const rel = await stockRepository.findBySymbol('RELIANCE');
      memoryPortfolios[key] = {
        userId,
        holdings: rel
          ? [
              {
                stockId: rel._id || rel,
                quantity: 10,
                averagePrice: 2950.0,
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

  async findEnrichedByUserId(userId) {
    if (mongoose.connection.readyState === 1) {
      try {
        let portfolio = await Portfolio.findOne({ userId }).populate('holdings.stockId');
        if (!portfolio) {
          portfolio = await Portfolio.create({ userId, holdings: [] });
          portfolio = await Portfolio.findOne({ userId }).populate('holdings.stockId');
        }
        return portfolio;
      } catch (err) {
        console.error('[PortfolioRepository findEnrichedByUserId error]:', err.message);
      }
    }
    return await this.findByUserId(userId);
  }

  async updateHoldings(userId, holdings, session = null) {
    if (mongoose.connection.readyState === 1) {
      try {
        const options = { new: true, upsert: true };
        if (session) options.session = session;
        return await Portfolio.findOneAndUpdate({ userId }, { holdings }, options);
      } catch (err) {
        console.error('[PortfolioRepository updateHoldings error]:', err.message);
        return await Portfolio.findOneAndUpdate({ userId }, { holdings }, { new: true, upsert: true });
      }
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

