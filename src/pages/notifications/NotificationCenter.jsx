import React from "react";

const NotificationCenter = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Notification Center</h1>
      
      <div className="space-y-4">
        {/* একটি স্যাম্পল নোটিফিকেশন কার্ড (AI স্টাইল) */}
        <div className="bg-slate-900/50 border-l-4 border-emerald-500 p-4 rounded-r-xl backdrop-blur-sm">
          <p className="text-white font-medium">Project Approved!</p>
          <p className="text-slate-400 text-sm">Your project "Skyline" is now live.</p>
          <span className="text-xs text-slate-500">2 mins ago</span>
        </div>
      </div>
    </div>
  );
};

// এই লাইনটি অবশ্যই থাকতে হবে
export default NotificationCenter;