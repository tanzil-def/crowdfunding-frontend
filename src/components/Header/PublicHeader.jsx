import React from 'react';
import { useSelector } from 'react-redux';

const PublicHeader = () => {
  const isUserLoggedIn = useSelector((state) => state.user?.isUserLoggedIn ?? false);
  const user = useSelector((state) => state.user?.user);

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CrowdFund Castle
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {isUserLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {user?.name || 'User'}
                </span>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <a href="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900">
                  Login
                </a>
                <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
