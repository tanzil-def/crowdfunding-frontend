import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: "Azure Beachfront Condo",
    location: "Maldives, Indian Ocean",
    roi: "14.5%",
    raised: "75%",
    amount: "$1.8M",
    min: "$1,000",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    type: "Residential"
  },
  {
    title: "Skyline Executive Hub",
    location: "London, UK",
    roi: "9.8%",
    raised: "40%",
    amount: "$4.2M",
    min: "$2,500",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    type: "Commercial"
  },
  {
    title: "Eco-Jungle Retreat",
    location: "Phuket, Thailand",
    roi: "18.2%",
    raised: "92%",
    amount: "$950K",
    min: "$500",
    img: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=800&q=80",
    type: "Hospitality"
  }
];

const FeaturedProjects = () => {
  return (
    <section className="py-24 px-6 bg-[#020617]"> {/* Deep Slate Black */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-emerald-500 font-bold tracking-[0.2em] uppercase text-sm">Investment Opportunities</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-2 leading-tight">
              Featured <span className="text-slate-500">Assets</span>
            </h2>
          </motion.div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="text-white border border-slate-700 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-medium"
          >
            View Marketplace
          </motion.button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-slate-900/40 rounded-[2rem] overflow-hidden border border-slate-800/50 hover:border-emerald-500/30 transition-all duration-500 shadow-2xl backdrop-blur-sm"
            >
              {/* Image & Badge */}
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-lg">
                    {project.roi} ROI
                  </span>
                  <span className="bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-medium border border-white/10">
                    {project.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-8 flex items-center gap-2">
                  <span className="text-emerald-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                    </svg>
                  </span> 
                  {project.location}
                </p>

                {/* Progress Visual */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Funding Progress</span>
                    <span className="text-emerald-400 font-mono font-bold text-lg">{project.raised}</span>
                  </div>
                  <div className="w-full h-[6px] bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: project.raised }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    ></motion.div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium pt-1">
                    <span>RAISED: {project.amount}</span>
                    <span>GOAL: $5.0M</span>
                  </div>
                </div>

                {/* Footer Info & Button */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-800/60">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Minimum</p>
                    <p className="text-xl font-bold text-white">{project.min}</p>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="bg-emerald-600 text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-emerald-500 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] transition-all"
                  >
                    Invest Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;