import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Globe
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed!');
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#020617] relative overflow-hidden border-t border-slate-800/50">
      {/* 3D Background Glows - Reduced Intensity */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

      {/* Main Container - Reduced Padding for Slim Look */}
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">

          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 p-2 rounded-xl shadow-lg transform group-hover:rotate-6 transition-all duration-300">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Crowd<span className="text-emerald-400">Fund</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-snug max-w-xs">
              Decentralized crowdfunding ecosystem. Scaling visionaries into reality.
            </p>
            <div className="flex items-center gap-2">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Compact */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-semibold text-sm">Solutions</h4>
            <ul className="space-y-2">
              {['Equity Funding', 'Web3 Ventures', 'Impact Investing'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-all">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details - Compact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-semibold text-sm">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={16} className="text-emerald-500" />
                <span className="text-xs">One World Trade Center, NY</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail size={16} className="text-emerald-500" />
                <span className="text-xs">partners@crowdfund.io</span>
              </div>
            </div>
          </div>

          {/* Newsletter Section - Glassy & Compact */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h4 className="text-white font-semibold text-sm mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-3 py-2 bg-[#020617] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                />
                <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 group">
                  {subscribed ? 'DONE' : <>JOIN NOW <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Thinner Divider */}
        <div className="w-full h-[1px] bg-slate-800/50 mt-10" />

        {/* Slim Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-widest">
            <Globe size={12} />
            <span>Global Investment Platform</span>
          </div>

          <p className="text-slate-500 text-xs">
            © {currentYear} CrowdFund.
          </p>

          <div className="flex items-center gap-6">
            <Link to="#" className="text-slate-500 hover:text-white text-xs transition-colors">Privacy</Link>
            <Link to="#" className="text-slate-500 hover:text-white text-xs transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;