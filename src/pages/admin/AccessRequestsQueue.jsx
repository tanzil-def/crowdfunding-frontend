import React from "react";

const AccessRequestsQueue = () => {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 text-emerald-500">Access Requests Queue</h1>
      {/* আপনার বাকি কোড এখানে */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <p className="text-slate-400">No pending requests found.</p>
      </div>
    </div>
  );
};

// এই লাইনটি চেক করুন, এটিই মিসিং আছে
export default AccessRequestsQueue;