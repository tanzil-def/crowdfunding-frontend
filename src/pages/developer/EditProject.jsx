import React, { useState } from "react";

const EditProject = () => {
  // আপনার স্টেট এবং লজিক এখানে থাকবে
  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-8">
        Edit Project Details
      </h1>
      
      {/* কার্ড ডিজাইন যা AI ডিজাইনের মতো লুক দিবে */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <form className="space-y-6">
          <div>
            <label className="block text-slate-400 text-sm mb-2">Project Title</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>
          {/* বাকি ইনপুটগুলো এখানে */}
          <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all">
            Update Project
          </button>
        </form>
      </div>
    </div>
  );
};

// এই লাইনটিই মিসিং থাকার কারণে এরর আসছে
export default EditProject;