const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

const connectDB = require('../config/db');

describe('Authentication API Endpoints', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/v1/auth/register should create a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test Trader',
      email: 'testtrader@example.com',
      password: 'Password123!',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('testtrader@example.com');
    expect(res.body.data.accessToken).toBeDefined();
  });

  test('POST /api/v1/auth/login should authenticate valid user', async () => {
    await User.create({
      name: 'Login User',
      email: 'login@example.com',
      password: 'Password123!',
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'login@example.com',
      password: 'Password123!',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });
});
