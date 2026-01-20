import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-28 z-20"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-200 tracking-widest uppercase">
            SEC Regulated • $1.2B Assets Under Management
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-6xl mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase">
            Crowdfunding <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-500">
              Trading Platform
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
        >
          High-yield real estate investments for everyone. Build your <span className="text-white font-semibold underline decoration-emerald-500">wealth</span> with fractional ownership in prime luxury properties.
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <button className="group relative px-10 py-5 bg-emerald-600 rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative text-white font-black text-lg tracking-wide uppercase">Start Portfolio</span>
          </button>

          <button className="px-10 py-5 bg-white/5 border border-white/20 hover:border-white/40 text-white font-black text-lg rounded-2xl backdrop-blur-md transition-all">
            Browse Market
          </button>
        </motion.div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl">
          {[
            { label: 'Total Invested', value: '$240.8M', color: 'text-emerald-400' },
            { label: 'Active Projects', value: '42 Assets', color: 'text-white' },
            { label: 'Quarterly Yield', value: '14.2%', color: 'text-emerald-400' },
            { label: 'Member Count', value: '88K+', color: 'text-white' },
          ].map((stat, i) => (
            <div key={i} className="py-6 px-4 rounded-[2rem] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
              <p className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 right-10 hidden lg:flex items-center gap-4 bg-slate-900/90 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl"
      >
        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <span className="text-emerald-500 font-bold">↑</span>
        </div>
        <div>
          <p className="text-xs text-slate-400">Recent Investment</p>
          <p className="text-sm font-bold text-white">Alex M. just invested $5,000</p>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;