const Watchlist = require('../models/Watchlist');
const mongoose = require('mongoose');
const stockRepository = require('./stockRepository');

const memoryWatchlists = {};

class WatchlistRepository {
  async findByUserId(userId) {
    if (mongoose.connection.readyState === 1) {
      try {
        let watchlist = await Watchlist.findOne({ userId }).populate('stockIds');
        if (!watchlist) {
          const aapl = await stockRepository.findBySymbol('AAPL');
          const msft = await stockRepository.findBySymbol('MSFT');
          const nvda = await stockRepository.findBySymbol('NVDA');
          const defaultIds = [aapl, msft, nvda].filter(Boolean).map((s) => s._id);

          watchlist = await Watchlist.create({ userId, stockIds: defaultIds });
          watchlist = await Watchlist.findById(watchlist._id).populate('stockIds');
        } else if (watchlist.stockIds) {
          watchlist.stockIds = watchlist.stockIds.filter(Boolean);
        }
        return watchlist;
      } catch (err) {}
    }
    const key = userId.toString();
    if (!memoryWatchlists[key]) {
      const aapl = await stockRepository.findBySymbol('AAPL');
      const msft = await stockRepository.findBySymbol('MSFT');
      memoryWatchlists[key] = {
        userId,
        stockIds: [aapl, msft].filter(Boolean),
        save: async function () { return this; },
      };
    }
    return memoryWatchlists[key];
  }

  async addStock(userId, stockId) {
    if (mongoose.connection.readyState === 1) {
      try {
        let watchlist = await Watchlist.findOne({ userId });
        if (!watchlist) {
          watchlist = await Watchlist.create({ userId, stockIds: [stockId] });
        } else {
          const exists = watchlist.stockIds.some(
            (id) => id && id.toString() === stockId.toString()
          );
          if (!exists) {
            watchlist.stockIds.push(stockId);
            await watchlist.save();
          }
        }
        const updated = await Watchlist.findById(watchlist._id).populate('stockIds');
        if (updated && updated.stockIds) {
          updated.stockIds = updated.stockIds.filter(Boolean);
        }
        return updated;
      } catch (err) {}
    }
    const wl = await this.findByUserId(userId);
    const stockObj = await stockRepository.findById(stockId);
    if (stockObj && !wl.stockIds.some((s) => s && s._id && s._id.toString() === stockId.toString())) {
      wl.stockIds.push(stockObj);
    }
    return wl;
  }

  async removeStock(userId, stockId) {
    if (mongoose.connection.readyState === 1) {
      try {
        const watchlist = await Watchlist.findOne({ userId });
        if (watchlist) {
          watchlist.stockIds = watchlist.stockIds.filter(
            (id) => id && id.toString() !== stockId.toString()
          );
          await watchlist.save();
        }
        const updated = await Watchlist.findOne({ userId }).populate('stockIds');
        if (updated && updated.stockIds) {
          updated.stockIds = updated.stockIds.filter(Boolean);
        }
        return updated;
      } catch (err) {}
    }
    const wl = await this.findByUserId(userId);
    wl.stockIds = wl.stockIds.filter((s) => (s._id ? s._id.toString() !== stockId.toString() : s.toString() !== stockId.toString()));
    return wl;
  }
}

module.exports = new WatchlistRepository();
