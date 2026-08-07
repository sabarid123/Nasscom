const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io = null;

const initSocket = (server) => {
  const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:5173'].filter(Boolean);
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`[Socket Connected] Client ID: ${socket.id}`);

    // Join room based on User ID for targeted notifications & updates
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        logger.info(`Client ${socket.id} joined room user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`[Socket Disconnected] Client ID: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

const emitStockPriceUpdate = (stockData) => {
  if (io) {
    io.emit('stock_price_update', stockData);
  }
};

const emitPortfolioUpdate = (userId, portfolioData) => {
  if (io) {
    io.to(`user_${userId}`).emit('portfolio_update', portfolioData);
  }
};

const emitNotification = (userId, notificationData) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', notificationData);
  }
};

const emitTradeStatus = (userId, tradeData) => {
  if (io) {
    io.to(`user_${userId}`).emit('trade_status', tradeData);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitStockPriceUpdate,
  emitPortfolioUpdate,
  emitNotification,
  emitTradeStatus,
};
