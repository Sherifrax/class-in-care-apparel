import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRedirectHandlerProps {
  children: React.ReactNode;
}

export const AdminRedirectHandler: React.FC<AdminRedirectHandlerProps> = ({ children }) => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdmin();

  // Don't redirect while loading
  if (loading) {
    return <>{children}</>;
  }

  // If user is authenticated and is an admin, redirect to admin dashboard
  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Otherwise, render the regular content
  return <>{children}</>;
};
