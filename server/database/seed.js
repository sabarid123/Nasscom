const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Watchlist = require('../models/Watchlist');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

const buildHist = (basePrice) => [
  { price: Number((basePrice * 0.97).toFixed(2)), timestamp: new Date(Date.now() - 86400000 * 5) },
  { price: Number((basePrice * 0.985).toFixed(2)), timestamp: new Date(Date.now() - 86400000 * 4) },
  { price: Number((basePrice * 0.99).toFixed(2)), timestamp: new Date(Date.now() - 86400000 * 3) },
  { price: Number((basePrice * 1.01).toFixed(2)), timestamp: new Date(Date.now() - 86400000 * 2) },
  { price: basePrice, timestamp: new Date() },
];

const stocksData = [
  // 1. Energy & Conglomerates
  { symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd.', sector: 'Energy & Conglomerate', currentPrice: 2950.50, openPrice: 2920.00, high: 2975.00, low: 2910.00, volume: 8450000, marketCap: '₹19.95 Lakh Cr', historicalData: buildHist(2950.50) },
  { symbol: 'NTPC', companyName: 'NTPC Limited', sector: 'Energy & Power', currentPrice: 412.30, openPrice: 405.00, high: 418.00, low: 402.00, volume: 14200000, marketCap: '₹4.00 Lakh Cr', historicalData: buildHist(412.30) },
  { symbol: 'POWERGRID', companyName: 'Power Grid Corporation of India', sector: 'Energy & Power', currentPrice: 342.10, openPrice: 338.00, high: 346.00, low: 335.00, volume: 11500000, marketCap: '₹3.18 Lakh Cr', historicalData: buildHist(342.10) },
  { symbol: 'ONGC', companyName: 'Oil & Natural Gas Corporation', sector: 'Energy & Power', currentPrice: 315.60, openPrice: 310.00, high: 320.00, low: 308.00, volume: 18400000, marketCap: '₹3.97 Lakh Cr', historicalData: buildHist(315.60) },
  { symbol: 'ADANIENT', companyName: 'Adani Enterprises Ltd.', sector: 'Energy & Conglomerate', currentPrice: 3180.00, openPrice: 3120.00, high: 3220.00, low: 3100.00, volume: 4500000, marketCap: '₹3.62 Lakh Cr', historicalData: buildHist(3180.00) },
  { symbol: 'ADANIPORTS', companyName: 'Adani Ports & SEZ Ltd.', sector: 'Infrastructure & Capital Goods', currentPrice: 1490.20, openPrice: 1470.00, high: 1510.00, low: 1465.00, volume: 6200000, marketCap: '₹3.22 Lakh Cr', historicalData: buildHist(1490.20) },

  // 2. Technology & IT
  { symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd.', sector: 'Technology', currentPrice: 4180.25, openPrice: 4140.00, high: 4210.00, low: 4135.00, volume: 3200000, marketCap: '₹15.12 Lakh Cr', historicalData: buildHist(4180.25) },
  { symbol: 'INFY', companyName: 'Infosys Limited', sector: 'Technology', currentPrice: 1820.40, openPrice: 1795.00, high: 1835.00, low: 1790.00, volume: 6100000, marketCap: '₹7.56 Lakh Cr', historicalData: buildHist(1820.40) },
  { symbol: 'WIPRO', companyName: 'Wipro Limited', sector: 'Technology', currentPrice: 530.60, openPrice: 522.00, high: 535.00, low: 520.00, volume: 4800000, marketCap: '₹2.77 Lakh Cr', historicalData: buildHist(530.60) },
  { symbol: 'HCLTECH', companyName: 'HCL Technologies Ltd.', sector: 'Technology', currentPrice: 1680.50, openPrice: 1650.00, high: 1700.00, low: 1645.00, volume: 3900000, marketCap: '₹4.56 Lakh Cr', historicalData: buildHist(1680.50) },
  { symbol: 'TECHM', companyName: 'Tech Mahindra Ltd.', sector: 'Technology', currentPrice: 1520.10, openPrice: 1495.00, high: 1540.00, low: 1490.00, volume: 2800000, marketCap: '₹1.48 Lakh Cr', historicalData: buildHist(1520.10) },
  { symbol: 'LTIM', companyName: 'LTIMindtree Limited', sector: 'Technology', currentPrice: 5640.80, openPrice: 5580.00, high: 5700.00, low: 5550.00, volume: 1200000, marketCap: '₹1.67 Lakh Cr', historicalData: buildHist(5640.80) },

  // 3. Banking & Financial Services
  { symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd.', sector: 'Financial Services', currentPrice: 1650.80, openPrice: 1635.00, high: 1665.00, low: 1630.00, volume: 12400000, marketCap: '₹12.58 Lakh Cr', historicalData: buildHist(1650.80) },
  { symbol: 'ICICIBANK', companyName: 'ICICI Bank Ltd.', sector: 'Financial Services', currentPrice: 1210.60, openPrice: 1195.00, high: 1222.00, low: 1190.00, volume: 9800000, marketCap: '₹8.48 Lakh Cr', historicalData: buildHist(1210.60) },
  { symbol: 'SBIN', companyName: 'State Bank of India', sector: 'Financial Services', currentPrice: 845.30, openPrice: 835.00, high: 852.00, low: 830.00, volume: 14500000, marketCap: '₹7.54 Lakh Cr', historicalData: buildHist(845.30) },
  { symbol: 'KOTAKBANK', companyName: 'Kotak Mahindra Bank Ltd.', sector: 'Financial Services', currentPrice: 1790.20, openPrice: 1770.00, high: 1805.00, low: 1765.00, volume: 3400000, marketCap: '₹3.56 Lakh Cr', historicalData: buildHist(1790.20) },
  { symbol: 'AXISBANK', companyName: 'Axis Bank Ltd.', sector: 'Financial Services', currentPrice: 1180.40, openPrice: 1165.00, high: 1195.00, low: 1160.00, volume: 7200000, marketCap: '₹3.64 Lakh Cr', historicalData: buildHist(1180.40) },
  { symbol: 'BAJFINANCE', companyName: 'Bajaj Finance Ltd.', sector: 'Financial Services', currentPrice: 6920.00, openPrice: 6850.00, high: 7000.00, low: 6820.00, volume: 1900000, marketCap: '₹4.28 Lakh Cr', historicalData: buildHist(6920.00) },
  { symbol: 'JIOFIN', companyName: 'Jio Financial Services Ltd.', sector: 'Financial Services', currentPrice: 345.50, openPrice: 340.00, high: 352.00, low: 338.00, volume: 18900000, marketCap: '₹2.19 Lakh Cr', historicalData: buildHist(345.50) },

  // 4. Automotive & EV
  { symbol: 'TATAMOTORS', companyName: 'Tata Motors Ltd.', sector: 'Automotive', currentPrice: 1020.50, openPrice: 1000.00, high: 1035.00, low: 995.00, volume: 11200000, marketCap: '₹3.75 Lakh Cr', historicalData: buildHist(1020.50) },
  { symbol: 'MARUTI', companyName: 'Maruti Suzuki India Ltd.', sector: 'Automotive', currentPrice: 12400.00, openPrice: 12250.00, high: 12550.00, low: 12200.00, volume: 650000, marketCap: '₹3.90 Lakh Cr', historicalData: buildHist(12400.00) },
  { symbol: 'M_M', companyName: 'Mahindra & Mahindra Ltd.', sector: 'Automotive', currentPrice: 2890.30, openPrice: 2840.00, high: 2920.00, low: 2830.00, volume: 3800000, marketCap: '₹3.59 Lakh Cr', historicalData: buildHist(2890.30) },
  { symbol: 'HEROMOTOCO', companyName: 'Hero MotoCorp Ltd.', sector: 'Automotive', currentPrice: 5350.00, openPrice: 5280.00, high: 5410.00, low: 5260.00, volume: 850000, marketCap: '₹1.07 Lakh Cr', historicalData: buildHist(5350.00) },
  { symbol: 'BAJAJ_AUTO', companyName: 'Bajaj Auto Ltd.', sector: 'Automotive', currentPrice: 9850.00, openPrice: 9700.00, high: 9960.00, low: 9680.00, volume: 720000, marketCap: '₹2.76 Lakh Cr', historicalData: buildHist(9850.00) },

  // 5. Consumer Goods & Retail (FMCG)
  { symbol: 'ITC', companyName: 'ITC Limited', sector: 'Consumer Goods & FMCG', currentPrice: 495.20, openPrice: 490.00, high: 499.00, low: 488.50, volume: 11200000, marketCap: '₹6.18 Lakh Cr', historicalData: buildHist(495.20) },
  { symbol: 'HINDUNILVR', companyName: 'Hindustan Unilever Ltd.', sector: 'Consumer Goods & FMCG', currentPrice: 2710.00, openPrice: 2680.00, high: 2735.00, low: 2670.00, volume: 2200000, marketCap: '₹6.36 Lakh Cr', historicalData: buildHist(2710.00) },
  { symbol: 'NESTLEIND', companyName: 'Nestle India Ltd.', sector: 'Consumer Goods & FMCG', currentPrice: 2480.00, openPrice: 2450.00, high: 2510.00, low: 2440.00, volume: 950000, marketCap: '₹2.39 Lakh Cr', historicalData: buildHist(2480.00) },
  { symbol: 'TITAN', companyName: 'Titan Company Ltd.', sector: 'Consumer Goods & FMCG', currentPrice: 3460.50, openPrice: 3410.00, high: 3490.00, low: 3400.00, volume: 1600000, marketCap: '₹3.07 Lakh Cr', historicalData: buildHist(3460.50) },
  { symbol: 'ZOMATO', companyName: 'Eternal (Zomato) Ltd.', sector: 'Consumer Goods & FMCG', currentPrice: 245.80, openPrice: 238.00, high: 250.00, low: 236.50, volume: 35000000, marketCap: '₹2.17 Lakh Cr', historicalData: buildHist(245.80) },
  { symbol: 'TRENT', companyName: 'Trent Limited (Tata Retail)', sector: 'Consumer Goods & FMCG', currentPrice: 6850.00, openPrice: 6720.00, high: 6920.00, low: 6700.00, volume: 1400000, marketCap: '₹2.43 Lakh Cr', historicalData: buildHist(6850.00) },

  // 6. Healthcare & Pharmaceuticals
  { symbol: 'SUNPHARMA', companyName: 'Sun Pharmaceutical Industries', sector: 'Healthcare & Pharma', currentPrice: 1720.00, openPrice: 1695.00, high: 1740.00, low: 1690.00, volume: 3100000, marketCap: '₹4.12 Lakh Cr', historicalData: buildHist(1720.00) },
  { symbol: 'CIPLA', companyName: 'Cipla Limited', sector: 'Healthcare & Pharma', currentPrice: 1580.40, openPrice: 1560.00, high: 1600.00, low: 1550.00, volume: 2200000, marketCap: '₹1.27 Lakh Cr', historicalData: buildHist(1580.40) },
  { symbol: 'DRREDDY', companyName: "Dr. Reddy's Laboratories", sector: 'Healthcare & Pharma', currentPrice: 6890.00, openPrice: 6800.00, high: 6950.00, low: 6780.00, volume: 820000, marketCap: '₹1.15 Lakh Cr', historicalData: buildHist(6890.00) },
  { symbol: 'APOLLOHOSP', companyName: 'Apollo Hospitals Enterprise', sector: 'Healthcare & Pharma', currentPrice: 6540.00, openPrice: 6450.00, high: 6620.00, low: 6420.00, volume: 640000, marketCap: '₹94,000 Cr', historicalData: buildHist(6540.00) },

  // 7. Metals, Mining & Materials
  { symbol: 'TATASTEEL', companyName: 'Tata Steel Ltd.', sector: 'Metals & Mining', currentPrice: 165.40, openPrice: 162.00, high: 167.50, low: 161.20, volume: 22400000, marketCap: '₹2.06 Lakh Cr', historicalData: buildHist(165.40) },
  { symbol: 'JSWSTEEL', companyName: 'JSW Steel Ltd.', sector: 'Metals & Mining', currentPrice: 925.00, openPrice: 910.00, high: 938.00, low: 905.00, volume: 4200000, marketCap: '₹2.26 Lakh Cr', historicalData: buildHist(925.00) },
  { symbol: 'HINDALCO', companyName: 'Hindalco Industries Ltd.', sector: 'Metals & Mining', currentPrice: 685.20, openPrice: 672.00, high: 695.00, low: 670.00, volume: 6800000, marketCap: '₹1.54 Lakh Cr', historicalData: buildHist(685.20) },
  { symbol: 'ULTRACEMCO', companyName: 'UltraTech Cement Ltd.', sector: 'Metals & Mining', currentPrice: 11250.00, openPrice: 11100.00, high: 11400.00, low: 11050.00, volume: 450000, marketCap: '₹3.24 Lakh Cr', historicalData: buildHist(11250.00) },

  // 8. Defense, Telecommunication & Capital Goods
  { symbol: 'BHARTIARTL', companyName: 'Bharti Airtel Ltd.', sector: 'Telecommunication', currentPrice: 1480.90, openPrice: 1460.00, high: 1495.00, low: 1455.00, volume: 5200000, marketCap: '₹8.41 Lakh Cr', historicalData: buildHist(1480.90) },
  { symbol: 'HAL', companyName: 'Hindustan Aeronautics Ltd.', sector: 'Defense & Aerospace', currentPrice: 4820.00, openPrice: 4750.00, high: 4900.00, low: 4720.00, volume: 2900000, marketCap: '₹3.22 Lakh Cr', historicalData: buildHist(4820.00) },
  { symbol: 'LT', companyName: 'Larsen & Toubro Ltd.', sector: 'Infrastructure & Capital Goods', currentPrice: 3750.00, openPrice: 3710.00, high: 3780.00, low: 3700.00, volume: 1800000, marketCap: '₹5.15 Lakh Cr', historicalData: buildHist(3750.00) },
  { symbol: 'BEL', companyName: 'Bharat Electronics Ltd.', sector: 'Defense & Aerospace', currentPrice: 305.40, openPrice: 298.00, high: 312.00, low: 296.00, volume: 16500000, marketCap: '₹2.23 Lakh Cr', historicalData: buildHist(305.40) },
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
      name: 'Angel Admin',
      email: 'admin@stocktrade.com',
      password: 'AdminPassword123!',
      phone: '+919876543210',
      role: 'ADMIN',
      walletBalance: 10000000, // 1 Crore
      isEmailVerified: true,
    });
    console.log('[Seed]: Created Admin User -> admin@stocktrade.com / AdminPassword123!');

    // Create Demo Normal User
    const demoUser = await User.create({
      name: 'Trader Pro',
      email: 'user@stocktrade.com',
      password: 'UserPassword123!',
      phone: '+919876543211',
      role: 'USER',
      walletBalance: 500000, // 5 Lakhs
      isEmailVerified: true,
    });
    console.log('[Seed]: Created Demo User -> user@stocktrade.com / UserPassword123! (₹5,00,000 Wallet)');

    // Insert Stocks
    const insertedStocks = await Stock.insertMany(stocksData);
    console.log(`[Seed]: Inserted ${insertedStocks.length} top Indian growing stocks across 8 sectors`);

    // Create Watchlist for Demo User
    await Watchlist.create({
      userId: demoUser._id,
      stockIds: [insertedStocks[0]._id, insertedStocks[1]._id, insertedStocks[6]._id, insertedStocks[12]._id],
    });

    // Create Initial Portfolio for Demo User (20 shares of RELIANCE, 10 shares of TCS)
    const rel = insertedStocks.find((s) => s.symbol === 'RELIANCE');
    const tcs = insertedStocks.find((s) => s.symbol === 'TCS');

    await Portfolio.create({
      userId: demoUser._id,
      holdings: [
        { stockId: rel._id, quantity: 20, averagePrice: 2900.0 },
        { stockId: tcs._id, quantity: 10, averagePrice: 4120.0 },
      ],
    });

    // Insert Demo Transactions
    await Transaction.create([
      {
        userId: demoUser._id,
        stockId: rel._id,
        type: 'BUY',
        quantity: 20,
        price: 2900.0,
        totalAmount: 58000.0,
        status: 'COMPLETED',
      },
      {
        userId: demoUser._id,
        stockId: tcs._id,
        type: 'BUY',
        quantity: 10,
        price: 4120.0,
        totalAmount: 41200.0,
        status: 'COMPLETED',
      },
    ]);

    // Insert Initial Notification
    await Notification.create({
      userId: demoUser._id,
      title: 'Welcome to Angel Trade & Groww Platform!',
      message: 'Your trading wallet has been funded with ₹5,00,000 in virtual capital. Start trading top 40+ Indian growing companies!',
    });

    console.log('[Seed]: Database seeding successfully finished!');
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    throw error;
  }
};

if (require.main === module) {
  (async () => {
    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/stock_trading_db';
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('[Seed]: Connected to MongoDB');
    } catch (err) {
      console.error(`[Seed Error]: ${err.message}`);
    }
    await seedDB();
    process.exit(0);
  })();
}

module.exports = { seedDB, stocksData };
