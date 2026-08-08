import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

import Dashboard from './pages/Dashboard';
import StockDetails from './pages/StockDetails';
import Watchlist from './pages/Watchlist';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import OptionChain from './pages/OptionChain';
import IpoMutualFunds from './pages/IpoMutualFunds';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStocks from './pages/AdminStocks';
import AdminTransactions from './pages/AdminTransactions';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Public Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>

                {/* Main App Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />

                  {/* Protected User Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/stocks/:id" element={<StockDetails />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/option-chain" element={<OptionChain />} />
                    <Route path="/ipo-mf" element={<IpoMutualFunds />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/stocks" element={<AdminStocks />} />
                    <Route path="/admin/transactions" element={<AdminTransactions />} />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
