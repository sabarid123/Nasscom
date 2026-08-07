const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const connectDB = require('./config/db');
const swaggerSpec = require('./config/swagger');
const { initSocket } = require('./config/socket');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const { apiLimiter } = require('./middlewares/rateLimiter');
const stockService = require('./services/stockService');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Global Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://nasscom-7t0v.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Rate Limiting
app.use('/api', apiLimiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base Health Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'MERN Stock Trading Platform API is operational' });
});

// Register API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/stocks', stockRoutes);
app.use('/api/v1/trade', tradeRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

const path = require('path');
const fs = require('fs');

// Serve static frontend assets from build directory if available
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Real-time stock tick simulator interval (runs every 3 seconds)
if (process.env.NODE_ENV !== 'test') {
  setInterval(async () => {
    try {
      await stockService.updateLivePrices();
    } catch (error) {
      // Background tick update error ignored silently to keep server running
    }
  }, 3000);
}

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[Server Running]: http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[Swagger Docs]: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
