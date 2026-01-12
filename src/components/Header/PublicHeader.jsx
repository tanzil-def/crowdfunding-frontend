import React from "react";
import { Link } from "react-router-dom";

const PublicHeader = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CrowdFund Castle
          </h1>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;