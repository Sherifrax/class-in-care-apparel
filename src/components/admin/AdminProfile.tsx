import React from 'react';
import { AdminLayout } from './AdminLayout';
import { Profile as ProfileComponent } from '@/components/auth/Profile';

const AdminProfile: React.FC = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-6 py-8">
        <ProfileComponent />
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;