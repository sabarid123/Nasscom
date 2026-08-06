import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Skeleton from './Skeleton';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container my-5 py-5 text-center">
        <Skeleton height="40px" width="300px" className="mx-auto mb-3" />
        <Skeleton height="200px" width="100%" />
      </div>
    );
  }

  return user && user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
