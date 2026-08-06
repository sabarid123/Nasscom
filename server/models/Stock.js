const mongoose = require('mongoose');

const historicalPointSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    sector: {
      type: String,
      required: [true, 'Sector is required'],
      trim: true,
      index: true,
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
      min: 0,
      index: true,
    },
    openPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    high: {
      type: Number,
      required: true,
      min: 0,
    },
    low: {
      type: Number,
      required: true,
      min: 0,
    },
    volume: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: String,
      default: '0',
    },
    historicalData: [historicalPointSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Stock', stockSchema);
