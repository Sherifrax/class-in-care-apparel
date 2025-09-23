import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Auth } from '@/components/auth/Auth';

export const AdminLogin: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/5 via-destructive/10 to-destructive/15 px-4">
        <Card className="w-full max-w-md glass border-destructive/20 shadow-luxury backdrop-blur-xl bg-gradient-to-b from-destructive/5 to-destructive/10 animate-scale-in">
          <CardHeader className="space-y-3 text-center px-4 sm:px-6 py-4 sm:py-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-destructive to-destructive/80 p-3 sm:p-4 shadow-glow">
              <div className="w-full h-full rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-white to-white/80"></div>
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-4 sm:p-6">
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              You don't have admin privileges to access this area.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue/5 via-medical-teal/5 to-luxury-navy/10 px-4">
      <Card className="w-full max-w-md glass border-white/20 shadow-luxury backdrop-blur-xl bg-gradient-to-b from-white/90 to-white/80 animate-scale-in">
        <CardHeader className="space-y-3 text-center px-4 sm:px-6 py-4 sm:py-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-medical-blue to-medical-teal p-3 sm:p-4 shadow-glow">
            <div className="w-full h-full rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-white to-white/80"></div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">Admin Portal</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground mb-6 text-sm sm:text-base">
            Please sign in with your admin account to access the dashboard
          </p>
          <Auth isOpen={true} onClose={() => {}} />
        </CardContent>
      </Card>
    </div>
  );
};