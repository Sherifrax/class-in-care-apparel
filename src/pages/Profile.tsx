import React from 'react';
import { Profile as ProfileComponent } from '@/components/auth/Profile';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const Profile: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <ProfileComponent />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

