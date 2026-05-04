import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * Layout Container
 * Encapsulates the application shell maintaining an active Sidebar
 * and a scrollable central content region.
 */
const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-background transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
