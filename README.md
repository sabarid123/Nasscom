# Production-Ready Full-Stack MERN Stock Trading Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://nasscom-7t0v.onrender.com)

A complete, production-grade Stock Trading Platform built with Node.js v22, Express.js, MongoDB, Socket.IO, React 19, Vite, Bootstrap 5, and Chart.js.

🌐 **Live Render Deployment URL**: [https://nasscom-7t0v.onrender.com](https://nasscom-7t0v.onrender.com)

Designed after Zerodha, Groww, Robinhood, TradingView, and Upstox.

---

## 🌟 Key Features

### 🔐 Authentication & Role-Based Access (RBAC)
- **User Roles**: `USER` and `ADMIN`
- **JWT Security**: Access tokens with sliding Refresh tokens
- **Bcrypt Encryption**: Hashed passwords with salt rounds
- **Account Actions**: Login, Register, Profile Update, Change Password, Add Virtual Cash

### 📈 Stock Market & Trading Engine
- **Live Stock Prices**: WebSocket real-time price updates via Socket.IO
- **Resilient API Abstraction Layer**: Pluggable support for Finnhub, AlphaVantage, or Polygon APIs with automatic simulated live tick fallback so the server never crashes
- **Atomic Trading Transactions**: Transaction rollback on error, wallet balance checks, and holding position adjustments (weighted buy average price calculation)

### 📊 Portfolio & Analytics
- **Portfolio Summary**: Total Net Worth, Total Invested, Current Valuation, Overall P&L ($ and %), Today's Gain/Loss
- **Interactive Visualizations**: Asset allocation Doughnut chart and historical stock trend Line chart powered by Chart.js
- **Watchlist**: Real-time price tracking with quick bookmark removal and trade execution

### 🛡️ Admin Dashboard & Governance
- **Platform Analytics**: Total users, active users, total listed stocks, overall trading volume, and system cash reserves
- **User Management**: Suspend users, update user roles, and permanently delete accounts
- **Stock Listing Management**: Complete CRUD operations for stock symbols, sectors, prices, and market caps
- **CSV Export**: Export system-wide transaction reports to CSV

---

## 📁 Folder Structure

```
project
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # StockCard, StockChart, PortfolioChart, Modal, Skeleton, Toast, Navbar, Footer
│   │   ├── context/          # AuthContext, SocketContext, ThemeContext, NotificationContext
│   │   ├── hooks/            # useAuth, useSocket, useTheme
│   │   ├── layouts/          # MainLayout, AdminLayout, AuthLayout
│   │   ├── pages/            # Home, Login, Register, Dashboard, StockDetails, Portfolio, Watchlist, Transactions, Profile, Admin pages
│   │   ├── services/         # API services (Axios interceptors)
│   │   ├── styles/           # Global design tokens and Glassmorphism CSS
│   │   ├── utils/            # Formatters and validators
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/               # DB connection, Socket.IO setup, Swagger docs
│   ├── controllers/          # Auth, User, Stock, Trade, Portfolio, Watchlist, Notification, Admin controllers
│   ├── database/             # Database seed script (seed.js)
│   ├── middlewares/          # Auth JWT, Role RBAC, Rate Limiter, Error Handler, Validation
│   ├── models/               # User, Stock, Transaction, Portfolio, Watchlist, Notification models
│   ├── repository/           # Repository pattern data access layer
│   ├── routes/               # Express API routes
│   ├── services/             # Trade execution, Stock API abstraction, Auth, Portfolio calculation services
│   ├── tests/                # Jest integration test suites
│   ├── utils/                # ApiError, ApiResponse, Logger, CSV Exporter
│   ├── validations/          # express-validator rules
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── .github/workflows/        # CI/CD GitHub Actions pipeline
├── docker-compose.yml
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

---

## 🛠️ Environment Variables

Create `.env` file in the `/server` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/stock_trading_db
JWT_SECRET=supersecretjwtkey_production_ready_2026
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=supersecretjwtrefreshkey_production_ready_2026
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# External Stock API Keys (Optional - Automatic fallback if left empty)
FINNHUB_API_KEY=
ALPHA_VANTAGE_API_KEY=
POLYGON_API_KEY=
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- MongoDB (Running locally on `mongodb://localhost:27017` or via Docker)

### 1. Database Setup & Seeding
```bash
cd server
npm install
npm run seed
```
> **Seed Account Credentials**:
> - **Demo Admin**: `admin@stocktrade.com` / `AdminPassword123!`
> - **Demo User**: `user@stocktrade.com` / `UserPassword123!`

### 2. Running Backend Server
```bash
cd server
npm run dev
```
- Server: `http://localhost:5000`
- Swagger API Docs: `http://localhost:5000/api-docs`

### 3. Running Frontend Client
```bash
cd client
npm install
npm run dev
```
- Client App: `http://localhost:5173`

---

## 🐳 Docker Deployment

To launch the full stack with MongoDB containerized:

```bash
docker-compose up --build
```

---

## 🧪 Testing

Run backend Jest test suites:
```bash
cd server
npm test
```

---

## 🖼️ Screenshots Placeholder

- **Market Dashboard**: Real-time stock quotes grid with live price flashers.
- **Stock Chart**: Interactive historical price graph with technical stats.
- **Portfolio Analytics**: Holdings table with asset allocation doughnut chart.
- **Admin Control Panel**: Analytics dashboard and stock/user management.
