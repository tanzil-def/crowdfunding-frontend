import React from "react";

const PendingProjects = () => {
  // স্যাম্পল ডাটা (পরবর্তীতে API থেকে আসবে)
  const pendingProjects = [
    { id: 1, title: "Skyline Luxury Residences", developer: "John Dev", value: "$2.5M", date: "Jan 12, 2026" },
    { id: 2, title: "Green Valley Eco Park", developer: "Sarah Smith", value: "$1.2M", date: "Jan 10, 2026" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Pending Approvals
          </h1>
          <p className="text-slate-400 mt-1">Review and manage project submissions.</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full border border-emerald-500/20 text-sm font-medium">
          {pendingProjects.length} Projects Waiting
        </div>
      </div>

      {/* Admin Review Table */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Project Title</th>
              <th className="px-6 py-4 font-semibold">Developer</th>
              <th className="px-6 py-4 font-semibold">Total Value</th>
              <th className="px-6 py-4 font-semibold">Submitted</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pendingProjects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-800/40 transition-colors group">
                <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                <td className="px-6 py-4 text-slate-400">{project.developer}</td>
                <td className="px-6 py-4 text-emerald-400 font-mono">{project.value}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{project.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// এই লাইনটিই আপনার এররটি ফিক্স করবে
export default PendingProjects;