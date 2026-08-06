const Stock = require('../models/Stock');
const mongoose = require('mongoose');

const memoryStocks = [
  {
    _id: '65c123456789abcdef100001',
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
      { price: 180.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 182.3, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 181.5, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 184.2, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 185.5, timestamp: new Date() },
    ],
    save: async function () {
      return this;
    },
  },
  {
    _id: '65c123456789abcdef100002',
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
      { price: 402.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 406.8, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 410.0, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 412.5, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 415.2, timestamp: new Date() },
    ],
    save: async function () {
      return this;
    },
  },
  {
    _id: '65c123456789abcdef100003',
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
      { price: 168.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 169.5, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 170.1, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 171.8, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 172.8, timestamp: new Date() },
    ],
    save: async function () {
      return this;
    },
  },
  {
    _id: '65c123456789abcdef100004',
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
      { price: 175.2, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 178.0, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 179.8, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 181.1, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 182.4, timestamp: new Date() },
    ],
    save: async function () {
      return this;
    },
  },
  {
    _id: '65c123456789abcdef100005',
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
      { price: 115.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 118.2, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 122.0, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 124.1, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 125.6, timestamp: new Date() },
    ],
    save: async function () {
      return this;
    },
  },
  {
    _id: '65c123456789abcdef100006',
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
      { price: 230.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 225.4, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 221.0, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 218.6, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 215.3, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
  {
    _id: '65c123456789abcdef100007',
    symbol: 'META',
    companyName: 'Meta Platforms Inc.',
    sector: 'Technology',
    currentPrice: 485.6,
    openPrice: 480.2,
    high: 490.0,
    low: 478.5,
    volume: 18500000,
    marketCap: '$1.23 Trillion',
    historicalData: [
      { price: 470.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 475.2, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 478.0, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 482.4, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 485.6, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
  {
    _id: '65c123456789abcdef100008',
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
      { price: 620.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 628.5, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 632.0, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 638.4, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 642.1, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
  {
    _id: '65c123456789abcdef100009',
    symbol: 'AMD',
    companyName: 'Advanced Micro Devices Inc.',
    sector: 'Technology',
    currentPrice: 154.2,
    openPrice: 151.0,
    high: 156.8,
    low: 150.2,
    volume: 42000000,
    marketCap: '$249.1 Billion',
    historicalData: [
      { price: 145.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 148.2, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 150.0, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 152.4, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 154.2, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
  {
    _id: '65c123456789abcdef100010',
    symbol: 'DIS',
    companyName: 'The Walt Disney Company',
    sector: 'Entertainment',
    currentPrice: 104.5,
    openPrice: 102.8,
    high: 106.0,
    low: 102.0,
    volume: 14200000,
    marketCap: '$190.8 Billion',
    historicalData: [
      { price: 100.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 101.5, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 102.8, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 103.9, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 104.5, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
  {
    _id: '65c123456789abcdef100011',
    symbol: 'INTC',
    companyName: 'Intel Corporation',
    sector: 'Technology',
    currentPrice: 31.8,
    openPrice: 30.5,
    high: 32.4,
    low: 30.2,
    volume: 58000000,
    marketCap: '$135.4 Billion',
    historicalData: [
      { price: 29.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 29.8, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 30.4, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 31.0, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 31.8, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
  {
    _id: '65c123456789abcdef100012',
    symbol: 'COIN',
    companyName: 'Coinbase Global Inc.',
    sector: 'Financial Services',
    currentPrice: 228.4,
    openPrice: 220.0,
    high: 235.0,
    low: 218.0,
    volume: 16500000,
    marketCap: '$55.8 Billion',
    historicalData: [
      { price: 205.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 212.0, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 218.5, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 224.0, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 228.4, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
  {
    _id: '65c123456789abcdef100013',
    symbol: 'UBER',
    companyName: 'Uber Technologies Inc.',
    sector: 'Technology',
    currentPrice: 72.9,
    openPrice: 71.0,
    high: 74.2,
    low: 70.5,
    volume: 22000000,
    marketCap: '$151.2 Billion',
    historicalData: [
      { price: 68.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 69.5, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 70.8, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 71.9, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 72.9, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
  {
    _id: '65c123456789abcdef100014',
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
      { price: 198.5, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 200.2, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 202.0, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 203.8, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 204.7, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
  {
    _id: '65c123456789abcdef100015',
    symbol: 'BA',
    companyName: 'The Boeing Company',
    sector: 'Industrials',
    currentPrice: 178.5,
    openPrice: 175.0,
    high: 181.2,
    low: 174.5,
    volume: 9800000,
    marketCap: '$109.4 Billion',
    historicalData: [
      { price: 170.0, timestamp: new Date(Date.now() - 86400000 * 4) },
      { price: 172.5, timestamp: new Date(Date.now() - 86400000 * 3) },
      { price: 174.0, timestamp: new Date(Date.now() - 86400000 * 2) },
      { price: 176.8, timestamp: new Date(Date.now() - 86400000 * 1) },
      { price: 178.5, timestamp: new Date() },
    ],
    save: async function () { return this; },
  },
];

class StockRepository {
  async create(stockData) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Stock.create(stockData);
      } catch (err) {}
    }
    const newStock = {
      _id: '65c123456789abcdef1000' + (memoryStocks.length + 1),
      ...stockData,
      save: async function () {
        return this;
      },
    };
    memoryStocks.push(newStock);
    return newStock;
  }

  async findBySymbol(symbol) {
    if (mongoose.connection.readyState === 1) {
      try {
        const s = await Stock.findOne({ symbol: symbol.toUpperCase() });
        if (s) return s;
      } catch (err) {}
    }
    return memoryStocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase()) || null;
  }

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      try {
        const s = await Stock.findById(id);
        if (s) return s;
      } catch (err) {}
    }
    return memoryStocks.find((s) => s._id.toString() === id.toString()) || null;
  }

  async updateById(id, updateData) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Stock.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      } catch (err) {}
    }
    const s = memoryStocks.find((item) => item._id.toString() === id.toString());
    if (s) {
      Object.assign(s, updateData);
    }
    return s;
  }

  async deleteById(id) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await Stock.deleteById(id);
      } catch (err) {}
    }
    const idx = memoryStocks.findIndex((s) => s._id.toString() === id.toString());
    if (idx !== -1) memoryStocks.splice(idx, 1);
    return true;
  }

  async findAll({ search, sector, minPrice, maxPrice, sortBy, sortOrder, page = 1, limit = 10 }) {
    if (mongoose.connection.readyState === 1) {
      try {
        const filter = {};
        if (search) {
          filter.$or = [
            { symbol: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
          ];
        }
        if (sector) filter.sector = sector;
        if (minPrice !== undefined || maxPrice !== undefined) {
          filter.currentPrice = {};
          if (minPrice !== undefined) filter.currentPrice.$gte = Number(minPrice);
          if (maxPrice !== undefined) filter.currentPrice.$lte = Number(maxPrice);
        }
        const sort = {};
        if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        else sort.symbol = 1;

        const skip = (page - 1) * limit;
        const stocks = await Stock.find(filter).sort(sort).skip(skip).limit(limit);
        const total = await Stock.countDocuments(filter);
        if (stocks.length > 0) return { stocks, total, page, pages: Math.ceil(total / limit) };
      } catch (err) {}
    }

    let filtered = [...memoryStocks];
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.symbol.toLowerCase().includes(search.toLowerCase()) ||
          s.companyName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sector) {
      filtered = filtered.filter((s) => s.sector === sector);
    }

    return { stocks: filtered, total: filtered.length, page: 1, pages: 1 };
  }

  async getAllSymbols() {
    if (mongoose.connection.readyState === 1) {
      try {
        const stocks = await Stock.find({}, 'symbol companyName sector currentPrice openPrice high low volume');
        if (stocks.length > 0) return stocks;
      } catch (err) {}
    }
    return memoryStocks;
  }

  async updatePrice(stockId, newPrice, newHigh, newLow, session = null) {
    if (mongoose.connection.readyState === 1) {
      try {
        const options = session ? { session, new: true } : { new: true };
        return await Stock.findByIdAndUpdate(
          stockId,
          {
            $set: { currentPrice: newPrice, high: newHigh, low: newLow },
            $push: { historicalData: { price: newPrice, timestamp: new Date() } },
          },
          options
        );
      } catch (err) {}
    }
    const s = memoryStocks.find((item) => item._id.toString() === stockId.toString());
    if (s) {
      s.currentPrice = newPrice;
      s.high = newHigh;
      s.low = newLow;
      s.historicalData.push({ price: newPrice, timestamp: new Date() });
    }
    return s;
  }
}

module.exports = new StockRepository();
