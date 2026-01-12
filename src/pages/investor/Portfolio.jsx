import React from 'react';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          Investor Portfolio
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Total Invested</h2>
            <p className="text-5xl font-bold text-blue-600">$45,000</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <p className="text-5xl font-bold text-green-600">6</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Expected ROI</h2>
            <p className="text-5xl font-bold text-purple-600">+32%</p>
          </div>
        </div>
        <p className="text-center text-xl text-gray-600 dark:text-gray-400">
          Your detailed investment history will appear here...
        </p>
      </div>
    </div>
  );
};

export default Portfolio;
