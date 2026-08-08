# GrowwTrade & Angel One Inspired Stock Trading Platform 🚀🇮🇳

A next-generation, real-time Indian stock market paper trading, F&O options chain, and investment platform inspired by **Angel One** and **Groww**. Built with React, Vite, Node.js, Express, Socket.io, and MongoDB.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nasscom-stocktrade.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)

---

## 🌐 Live Vercel Demo Link

🔗 **Vercel Web App**: [https://nasscom-stocktrade.vercel.app](https://nasscom-stocktrade.vercel.app)

---

## ✨ Highlights & Features

### 🇮🇳 1. Top Indian Market Indices Ticker
- **Live Market Index Bar**: Real-time tick stream for **NIFTY 50**, **BANK NIFTY**, **SENSEX**, and **FINNIFTY** with point change and percentage gainers/losers indicator.

### 🏢 2. 40+ Top Growing Indian Companies Across 8 Sectors
- Live market prices in **INR (₹)** for blue-chip companies including **RELIANCE**, **TCS**, **INFY**, **HDFCBANK**, **ICICIBANK**, **SBIN**, **BHARTIARTL**, **TATASTEEL**, **ZOMATO**, **LT**, **ITC**, **WIPRO**, **HAL**, **MARUTI**, **SUNPHARMA**, **APOLLOHOSP**, and more.
- Filter by sector (**Technology**, **Banking & Financial Services**, **Automotive & EV**, **Energy & Power**, **FMCG**, **Metals & Mining**, **Defense & Aerospace**).

### ⚡ 3. Instant Order Ticket Modal (`OrderModal`)
- **Delivery (CNC)** vs **Intraday (MIS)** order types.
- **Market Price** vs **Limit Price** execution options.
- Real-time margin requirement check & available cash balance calculation.

### ⚡ 4. F&O Option Chain (`/option-chain`)
- Interactive options chain matrix for **NIFTY 50**, **BANK NIFTY**, **RELIANCE**, **TCS**.
- Real-time **Call Options (CE)**, **Put Options (PE)**, **Strike Prices**, **In-The-Money (ITM) / At-The-Money (ATM)** tags, **Open Interest (OI Lakhs)**, and **Implied Volatility (IV %)**.

### 🚀 5. IPOs & Mutual Funds Hub (`/ipo-mf`)
- **Initial Public Offerings (IPOs)** listing (Hyundai Motor India, Swiggy, NTPC Green) with Grey Market Premium (GMP), Lot Size & 1-click Bidding.
- **Direct Mutual Funds** directory (Parag Parikh Flexi Cap, Nippon India Small Cap, HDFC Index Nifty 50) with 3Y Annualized Return %, Risk Badges & Instant Investment modal.

### 📊 6. Trading Terminal & Market Depth
- **Order Book Market Depth**: Top 5 Best Bids and Best Asks live view in stock detail view.
- **Interactive Charts**: Timeframe selector buttons (**1D, 1W, 1M, 1Y, ALL**) with HSL styled gradients.

### 💼 7. Live Portfolio Tracker & Wallet Balance
- Multi-asset holdings valuation with dynamic P&L updates on real-time Socket ticks.
- Default virtual trading wallet loaded with **₹5,00,000** for instant demo trading.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Bootstrap 5, Chart.js, React Router v6, Socket.io-client.
- **Backend**: Node.js, Express.js, Socket.io, Mongoose (MongoDB Atlas).
- **Authentication**: JWT (JSON Web Tokens) with Refresh Tokens & Cookie storage.
- **Deployment**: Vercel.

---

## 🚀 Quick Start & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/sabarid123/Nasscom.git
cd project
```

### 2. Install Dependencies & Run Backend Server
```bash
cd server
npm install
npm run seed     # Seeds 42 top growing Indian stocks & demo users
npm run dev      # Starts server on http://localhost:5000
```

### 3. Run Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev      # Starts client on http://localhost:5173
```

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Initial Balance |
| :--- | :--- | :--- | :--- |
| **Trader User** | `user@stocktrade.com` | `UserPassword123!` | **₹5,00,000** |
| **Admin User** | `admin@stocktrade.com` | `AdminPassword123!` | **₹1,00,000,000** |

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
