const Stock = require('../models/Stock');
const mongoose = require('mongoose');

const stocksData = [
  { _id: '65c123456789abcdef100001', symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd.', sector: 'Energy & Conglomerate', currentPrice: 2950.50, openPrice: 2920.00, high: 2975.00, low: 2910.00, volume: 8450000, marketCap: '₹19.95 Lakh Cr', historicalData: [{ price: 2920, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100002', symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd.', sector: 'Technology', currentPrice: 4180.25, openPrice: 4140.00, high: 4210.00, low: 4135.00, volume: 3200000, marketCap: '₹15.12 Lakh Cr', historicalData: [{ price: 4140, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100003', symbol: 'INFY', companyName: 'Infosys Limited', sector: 'Technology', currentPrice: 1820.40, openPrice: 1795.00, high: 1835.00, low: 1790.00, volume: 6100000, marketCap: '₹7.56 Lakh Cr', historicalData: [{ price: 1795, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100004', symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd.', sector: 'Financial Services', currentPrice: 1650.80, openPrice: 1635.00, high: 1665.00, low: 1630.00, volume: 12400000, marketCap: '₹12.58 Lakh Cr', historicalData: [{ price: 1635, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100005', symbol: 'ICICIBANK', companyName: 'ICICI Bank Ltd.', sector: 'Financial Services', currentPrice: 1210.60, openPrice: 1195.00, high: 1222.00, low: 1190.00, volume: 9800000, marketCap: '₹8.48 Lakh Cr', historicalData: [{ price: 1195, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100006', symbol: 'SBIN', companyName: 'State Bank of India', sector: 'Financial Services', currentPrice: 845.30, openPrice: 835.00, high: 852.00, low: 830.00, volume: 14500000, marketCap: '₹7.54 Lakh Cr', historicalData: [{ price: 835, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100007', symbol: 'BHARTIARTL', companyName: 'Bharti Airtel Ltd.', sector: 'Telecommunication', currentPrice: 1480.90, openPrice: 1460.00, high: 1495.00, low: 1455.00, volume: 5200000, marketCap: '₹8.41 Lakh Cr', historicalData: [{ price: 1460, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100008', symbol: 'TATASTEEL', companyName: 'Tata Steel Ltd.', sector: 'Metals & Mining', currentPrice: 165.40, openPrice: 162.00, high: 167.50, low: 161.20, volume: 22400000, marketCap: '₹2.06 Lakh Cr', historicalData: [{ price: 162, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100009', symbol: 'ZOMATO', companyName: 'Eternal (Zomato) Ltd.', sector: 'Consumer Goods & FMCG', currentPrice: 245.80, openPrice: 238.00, high: 250.00, low: 236.50, volume: 35000000, marketCap: '₹2.17 Lakh Cr', historicalData: [{ price: 238, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100010', symbol: 'LT', companyName: 'Larsen & Toubro Ltd.', sector: 'Infrastructure & Capital Goods', currentPrice: 3750.00, openPrice: 3710.00, high: 3780.00, low: 3700.00, volume: 1800000, marketCap: '₹5.15 Lakh Cr', historicalData: [{ price: 3710, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100011', symbol: 'ITC', companyName: 'ITC Limited', sector: 'Consumer Goods & FMCG', currentPrice: 495.20, openPrice: 490.00, high: 499.00, low: 488.50, volume: 11200000, marketCap: '₹6.18 Lakh Cr', historicalData: [{ price: 490, timestamp: new Date() }] },
  { _id: '65c123456789abcdef100012', symbol: 'WIPRO', companyName: 'Wipro Limited', sector: 'Technology', currentPrice: 530.60, openPrice: 522.00, high: 535.00, low: 520.00, volume: 4800000, marketCap: '₹2.77 Lakh Cr', historicalData: [{ price: 522, timestamp: new Date() }] },
];

const memoryStocks = stocksData.map((s) => ({ ...s, save: async function () { return this; } }));

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

  async findById(id, session = null) {
    if (mongoose.connection.readyState === 1) {
      try {
        const query = Stock.findById(id);
        if (session) query.session(session);
        const s = await query;
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
