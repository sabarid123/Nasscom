import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastContainer from '../components/ToastContainer';

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 py-4">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
