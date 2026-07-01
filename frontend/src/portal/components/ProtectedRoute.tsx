import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  user: any;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<Props> = ({ user, allowedRoles }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.city === null || user.city === undefined || user.city === '') {
    return <Navigate to="/onboarding" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/admin' : '/user'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
