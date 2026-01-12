import React from 'react';

const MyProjects = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          My Projects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            <h2 className="text-2xl font-semibold">Luxury Villa Project</h2>
            <p className="mt-4">Status: Approved</p>
            <p>Funds: $80,000 / $200,000</p>
          </div>
          {/* Add more mock projects */}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
