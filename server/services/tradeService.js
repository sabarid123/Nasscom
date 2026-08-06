const mongoose = require('mongoose');
const userRepository = require('../repository/userRepository');
const stockRepository = require('../repository/stockRepository');
const portfolioRepository = require('../repository/portfolioRepository');
const transactionRepository = require('../repository/transactionRepository');
const notificationService = require('./notificationService');
const { emitTradeStatus, emitPortfolioUpdate } = require('../config/socket');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

const matchStockId = (holdingStockId, targetStockId) => {
  if (!holdingStockId || !targetStockId) return false;
  const hId = holdingStockId._id ? holdingStockId._id.toString() : holdingStockId.toString();
  return hId === targetStockId.toString();
};

class TradeService {
  async buyStock(userId, stockId, quantity) {
    const qty = Number(quantity);
    if (!qty || qty <= 0 || !Number.isInteger(qty)) {
      throw new ApiError(400, 'Quantity must be a positive whole integer');
    }

    let session = null;
    if (mongoose.connection.readyState === 1) {
      try {
        const topologyType = mongoose.connection.client?.topology?.description?.type;
        if (topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded') {
          session = await mongoose.startSession();
          session.startTransaction();
        }
      } catch (e) {
        if (session) {
          try { session.endSession(); } catch (_) {}
        }
        session = null;
      }
    }

    try {
      // 1. Fetch user & stock
      const user = session
        ? await userRepository.findById(userId).session(session)
        : await userRepository.findById(userId);
      if (!user) throw new ApiError(404, 'User not found');

      const stock = session
        ? await stockRepository.findById(stockId).session(session)
        : await stockRepository.findById(stockId);
      if (!stock) throw new ApiError(404, 'Stock not found');

      const totalCost = Number((stock.currentPrice * qty).toFixed(2));

      // 2. Validate wallet balance
      if (user.walletBalance < totalCost) {
        throw new ApiError(
          400,
          `Insufficient wallet balance. Required: $${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}, Available: $${user.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        );
      }

      // 3. Deduct wallet balance
      user.walletBalance = Number((user.walletBalance - totalCost).toFixed(2));
      if (user.save) await user.save(session ? { session } : {});

      // 4. Update Portfolio Holdings
      const portfolio = await portfolioRepository.findByUserId(userId);
      let existingHolding = portfolio.holdings.find((h) => matchStockId(h.stockId, stockId));

      if (existingHolding) {
        const existingQty = existingHolding.quantity;
        const existingAvgPrice = existingHolding.averagePrice;
        const newTotalQty = existingQty + qty;
        const newAvgPrice = Number(
          ((existingQty * existingAvgPrice + qty * stock.currentPrice) / newTotalQty).toFixed(2)
        );

        existingHolding.quantity = newTotalQty;
        existingHolding.averagePrice = newAvgPrice;
      } else {
        portfolio.holdings.push({
          stockId: stock._id || stockId,
          quantity: qty,
          averagePrice: stock.currentPrice,
        });
      }

      if (portfolio.save) await portfolio.save(session ? { session } : {});

      // 5. Create Transaction Record
      const transaction = await transactionRepository.create(
        {
          userId,
          stockId: stock._id || stockId,
          type: 'BUY',
          quantity: qty,
          price: stock.currentPrice,
          totalAmount: totalCost,
          status: 'COMPLETED',
        },
        session
      );

      if (session) {
        await session.commitTransaction();
        session.endSession();
      }

      // Real-time notifications & socket updates
      const updatedPortfolio = await portfolioRepository.findByUserId(userId);
      emitPortfolioUpdate(userId, updatedPortfolio);
      emitTradeStatus(userId, { type: 'BUY', stockSymbol: stock.symbol, status: 'COMPLETED', totalCost });

      await notificationService.sendNotification(
        userId,
        `Bought ${qty} shares of ${stock.symbol}`,
        `Successfully purchased ${qty} shares of ${stock.companyName} (${stock.symbol}) for $${totalCost.toLocaleString()}.`
      );

      return { transaction, walletBalance: user.walletBalance };
    } catch (error) {
      if (session) {
        try {
          await session.abortTransaction();
          session.endSession();
        } catch (_) {}
      }
      logger.error(`[Buy Stock Error for User ${userId}]: ${error.message}`);
      throw error;
    }
  }

  async sellStock(userId, stockId, quantity) {
    const qty = Number(quantity);
    if (!qty || qty <= 0 || !Number.isInteger(qty)) {
      throw new ApiError(400, 'Quantity must be a positive whole integer');
    }

    let session = null;
    if (mongoose.connection.readyState === 1) {
      try {
        const topologyType = mongoose.connection.client?.topology?.description?.type;
        if (topologyType === 'ReplicaSetWithPrimary' || topologyType === 'Sharded') {
          session = await mongoose.startSession();
          session.startTransaction();
        }
      } catch (e) {
        if (session) {
          try { session.endSession(); } catch (_) {}
        }
        session = null;
      }
    }

    try {
      // 1. Fetch stock & user portfolio
      const user = session
        ? await userRepository.findById(userId).session(session)
        : await userRepository.findById(userId);
      if (!user) throw new ApiError(404, 'User not found');

      const stock = session
        ? await stockRepository.findById(stockId).session(session)
        : await stockRepository.findById(stockId);
      if (!stock) throw new ApiError(404, 'Stock not found');

      const portfolio = await portfolioRepository.findByUserId(userId);
      const holdingIndex = portfolio.holdings.findIndex((h) => matchStockId(h.stockId, stockId));

      if (holdingIndex === -1) {
        throw new ApiError(400, `You do not own any shares of ${stock.symbol} in your portfolio`);
      }

      const holding = portfolio.holdings[holdingIndex];
      if (holding.quantity < qty) {
        throw new ApiError(
          400,
          `Insufficient shares. You hold ${holding.quantity} shares of ${stock.symbol}, but attempted to sell ${qty}`
        );
      }

      const totalProceeds = Number((stock.currentPrice * qty).toFixed(2));

      // 2. Add total proceeds to user wallet
      user.walletBalance = Number((user.walletBalance + totalProceeds).toFixed(2));
      if (user.save) await user.save(session ? { session } : {});

      // 3. Update Portfolio Holdings
      if (holding.quantity === qty) {
        portfolio.holdings.splice(holdingIndex, 1);
      } else {
        holding.quantity -= qty;
      }
      if (portfolio.save) await portfolio.save(session ? { session } : {});

      // 4. Create Transaction Record
      const transaction = await transactionRepository.create(
        {
          userId,
          stockId: stock._id || stockId,
          type: 'SELL',
          quantity: qty,
          price: stock.currentPrice,
          totalAmount: totalProceeds,
          status: 'COMPLETED',
        },
        session
      );

      if (session) {
        await session.commitTransaction();
        session.endSession();
      }

      // Real-time notifications & socket updates
      const updatedPortfolio = await portfolioRepository.findByUserId(userId);
      emitPortfolioUpdate(userId, updatedPortfolio);
      emitTradeStatus(userId, { type: 'SELL', stockSymbol: stock.symbol, status: 'COMPLETED', totalProceeds });

      await notificationService.sendNotification(
        userId,
        `Sold ${qty} shares of ${stock.symbol}`,
        `Successfully sold ${qty} shares of ${stock.companyName} (${stock.symbol}) for $${totalProceeds.toLocaleString()}.`
      );

      return { transaction, walletBalance: user.walletBalance };
    } catch (error) {
      if (session) {
        try {
          await session.abortTransaction();
          session.endSession();
        } catch (_) {}
      }
      logger.error(`[Sell Stock Error for User ${userId}]: ${error.message}`);
      throw error;
    }
  }

  async getUserTransactions(userId, page = 1, limit = 10) {
    return await transactionRepository.findByUserId(userId, page, limit);
  }

  async deleteTransaction(transactionId, userId) {
    const deleted = await transactionRepository.deleteById(transactionId, userId);
    if (!deleted) {
      throw new ApiError(404, 'Transaction record not found');
    }
    return true;
  }

  async clearUserTransactions(userId) {
    return await transactionRepository.clearAllByUserId(userId);
  }
}

module.exports = new TradeService();

