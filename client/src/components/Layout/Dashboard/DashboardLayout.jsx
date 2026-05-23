import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <div className="pl-64">
        {/* Topbar could go here if needed */}
        <div className="p-8">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
