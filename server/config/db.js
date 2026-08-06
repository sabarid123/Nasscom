const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/stock_trading_db';
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`[MongoDB Connected]: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Notice]: Local MongoDB not reachable (${error.message}). Starting In-Memory MongoDB Server...`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[In-Memory MongoDB Connected]: ${memoryUri}`);

      // Seed in-memory database with initial data
      const { seedDB } = require('../database/seed');
      await seedDB();
      return conn;
    } catch (memErr) {
      console.error(`[In-Memory MongoDB Error]: ${memErr.message}`);
    }
  }
};

module.exports = connectDB;

