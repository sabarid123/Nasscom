const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Watchlist = require('../models/Watchlist');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

const stocksData = [
  {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    sector: 'Technology',
    currentPrice: 185.5,
    openPrice: 184.2,
    high: 187.1,
    low: 183.9,
    volume: 52400000,
    marketCap: '$2.88 Trillion',
    historicalData: [
      { price: 180.0, timestamp: new Date(Date.now() - 86400000 * 5) },
      { price: 182.3, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 181.5, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 184.2, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 185.5, timestamp: new Date() },
    ],
  },
  {
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    sector: 'Technology',
    currentPrice: 415.2,
    openPrice: 410.0,
    high: 418.5,
    low: 409.8,
    volume: 24100000,
    marketCap: '$3.08 Trillion',
    historicalData: [
      { price: 402.0, timestamp: new Date(Date.now() - 86400000 * 5) },
      { price: 406.8, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 410.0, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 412.5, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 415.2, timestamp: new Date() },
    ],
  },
  {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    sector: 'Technology',
    currentPrice: 172.8,
    openPrice: 170.5,
    high: 174.2,
    low: 169.9,
    volume: 31000000,
    marketCap: '$2.15 Trillion',
    historicalData: [
      { price: 168.0, timestamp: new Date(Date.now() - 86400000 * 5) },
      { price: 169.5, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 170.1, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 171.8, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 172.8, timestamp: new Date() },
    ],
  },
  {
    symbol: 'AMZN',
    companyName: 'Amazon.com Inc.',
    sector: 'Consumer Cyclical',
    currentPrice: 182.4,
    openPrice: 180.0,
    high: 184.0,
    low: 179.5,
    volume: 38200000,
    marketCap: '$1.89 Trillion',
    historicalData: [
      { price: 175.2, timestamp: new Date(Date.now() - 86400000 * 5) },
      { price: 178.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 179.8, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 181.1, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 182.4, timestamp: new Date() },
    ],
  },
  {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    sector: 'Technology',
    currentPrice: 125.6,
    openPrice: 121.0,
    high: 127.8,
    low: 120.5,
    volume: 75000000,
    marketCap: '$3.09 Trillion',
    historicalData: [
      { price: 115.0, timestamp: new Date(Date.now() - 86400000 * 5) },
      { price: 118.2, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 122.0, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 124.1, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 125.6, timestamp: new Date() },
    ],
  },
  {
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    sector: 'Automotive',
    currentPrice: 215.3,
    openPrice: 220.0,
    high: 222.5,
    low: 212.8,
    volume: 68000000,
    marketCap: '$685.2 Billion',
    historicalData: [
      { price: 230.0, timestamp: new Date(Date.now() - 86400000 * 5) },
      { price: 225.4, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 221.0, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 218.6, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 215.3, timestamp: new Date() },
    ],
  },
  {
    symbol: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    sector: 'Financial Services',
    currentPrice: 204.7,
    openPrice: 203.1,
    high: 206.0,
    low: 202.8,
    volume: 12500000,
    marketCap: '$582.6 Billion',
    historicalData: [
      { price: 198.5, timestamp: new Date(Date.now() - 86400000 * 5) },
      { price: 200.2, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 202.0, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 203.8, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 204.7, timestamp: new Date() },
    ],
  },
  {
    symbol: 'NFLX',
    companyName: 'Netflix Inc.',
    sector: 'Communication Services',
    currentPrice: 642.1,
    openPrice: 635.0,
    high: 648.0,
    low: 634.2,
    volume: 8900000,
    marketCap: '$276.4 Billion',
    historicalData: [
      { price: 620.0, timestamp: new Date(Date.now() - 86400000 * 5) },
      { price: 628.5, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 632.0, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 638.4, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 642.1, timestamp: new Date() },
    ],
  },
];

const seedDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/stock_trading_db';
      await mongoose.connect(mongoUri);
      console.log('[Seed]: Connected to MongoDB');
    }

    // Clean existing collections
    await User.deleteMany({});
    await Stock.deleteMany({});
    await Portfolio.deleteMany({});
    await Watchlist.deleteMany({});
    await Transaction.deleteMany({});
    await Notification.deleteMany({});
    console.log('[Seed]: Cleared existing database collections');

    // Create Admin User
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@stocktrade.com',
      password: 'AdminPassword123!',
      phone: '+1234567890',
      role: 'ADMIN',
      walletBalance: 1000000,
      isEmailVerified: true,
    });
    console.log('[Seed]: Created Admin User -> admin@stocktrade.com / AdminPassword123!');

    // Create Demo Normal User
    const demoUser = await User.create({
      name: 'John Trader',
      email: 'user@stocktrade.com',
      password: 'UserPassword123!',
      phone: '+1987654321',
      role: 'USER',
      walletBalance: 50000,
      isEmailVerified: true,
    });
    console.log('[Seed]: Created Demo User -> user@stocktrade.com / UserPassword123!');

    // Insert Stocks
    const insertedStocks = await Stock.insertMany(stocksData);
    console.log(`[Seed]: Inserted ${insertedStocks.length} blue-chip stocks`);

    // Create Watchlist for Demo User
    await Watchlist.create({
      userId: demoUser._id,
      stockIds: [insertedStocks[0]._id, insertedStocks[1]._id, insertedStocks[4]._id],
    });

    // Create Initial Portfolio for Demo User (10 shares of AAPL, 5 shares of MSFT)
    const aapl = insertedStocks.find((s) => s.symbol === 'AAPL');
    const msft = insertedStocks.find((s) => s.symbol === 'MSFT');

    await Portfolio.create({
      userId: demoUser._id,
      holdings: [
        { stockId: aapl._id, quantity: 10, averagePrice: 180.0 },
        { stockId: msft._id, quantity: 5, averagePrice: 405.0 },
      ],
    });

    // Insert Demo Transactions
    await Transaction.create([
      {
        userId: demoUser._id,
        stockId: aapl._id,
        type: 'BUY',
        quantity: 10,
        price: 180.0,
        totalAmount: 1800.0,
        status: 'COMPLETED',
      },
      {
        userId: demoUser._id,
        stockId: msft._id,
        type: 'BUY',
        quantity: 5,
        price: 405.0,
        totalAmount: 2025.0,
        status: 'COMPLETED',
      },
    ]);

    // Insert Initial Notification
    await Notification.create({
      userId: demoUser._id,
      title: 'Welcome to StockTrade Platform!',
      message: 'Your simulator account has been funded with $50,000 in virtual cash. Happy Trading!',
    });

    console.log('[Seed]: Database seeding successfully finished!');
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    throw error;
  }
};

if (require.main === module) {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  (async () => {
    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/stock_trading_db';
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      console.log('[Seed]: Connected to local MongoDB');
    } catch (err) {
      console.warn('[Seed Notice]: Local MongoDB not reachable. Creating in-memory MongoDB for seeding...');
      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
    }
    await seedDB();
    process.exit(0);
  })();
}

module.exports = { seedDB };

