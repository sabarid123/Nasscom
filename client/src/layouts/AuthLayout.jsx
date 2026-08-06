import React from 'react';
import { Outlet } from 'react-router-dom';
import ToastContainer from '../components/ToastContainer';

const AuthLayout = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
      <div className="container">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
