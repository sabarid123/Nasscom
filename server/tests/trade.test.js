const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Stock = require('../models/Stock');

const connectDB = require('../config/db');

describe('Trade & Stock Execution API', () => {
  let token;
  let userId;
  let stockId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Stock.deleteMany({});

    const user = await User.create({
      name: 'Trader Bob',
      email: 'bob@example.com',
      password: 'Password123!',
      walletBalance: 10000,
    });
    userId = user._id;

    const stock = await Stock.create({
      symbol: 'TEST',
      companyName: 'Test Inc',
      sector: 'Technology',
      currentPrice: 100.0,
      openPrice: 100.0,
      high: 105.0,
      low: 95.0,
    });
    stockId = stock._id;

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'bob@example.com',
      password: 'Password123!',
    });
    token = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/v1/trade/buy should execute stock purchase when funds are available', async () => {
    const res = await request(app)
      .post('/api/v1/trade/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({
        stockId: stockId.toString(),
        quantity: 5,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.walletBalance).toBe(9500); // 10000 - (5 * 100)
  });

  test('POST /api/v1/trade/buy should reject purchase when insufficient wallet balance', async () => {
    const res = await request(app)
      .post('/api/v1/trade/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({
        stockId: stockId.toString(),
        quantity: 500, // Requires 50,000, user has 10,000
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
