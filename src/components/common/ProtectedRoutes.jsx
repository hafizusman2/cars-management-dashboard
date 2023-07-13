import React, { memo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ authenticated }) => {
  return authenticated ? <Outlet /> : <Navigate to="/" />;
};

export default memo(ProtectedRoutes);
