import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, Landmark, Info } from 'lucide-react';

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-b border-slate-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Castle<span className="text-blue-600 font-black">Fund</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/explore" label="Explore Properties" icon={<Landmark size={16}/>} />
            <NavLink to="/how-it-works" label="How it Works" icon={<Info size={16}/>} />
            <NavLink to="/about" label="About Us" />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/auth/login" 
              className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/auth/signup" 
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-950 border-b border-slate-200 dark:border-gray-800 p-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            <MobileNavLink to="/explore" label="Explore Properties" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/how-it-works" label="How it Works" onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/about" label="About Us" onClick={() => setIsMenuOpen(false)} />
          </div>
          <div className="pt-6 border-t border-slate-100 dark:border-gray-800 flex flex-col gap-3">
            <Link 
              to="/auth/login" 
              className="w-full py-4 text-center font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-gray-900 rounded-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Log In
            </Link>
            <Link 
              to="/auth/signup" 
              className="w-full py-4 bg-blue-600 text-white text-center rounded-2xl font-bold shadow-lg shadow-blue-500/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Join CastleFund
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

/* Helper Components for clean code */

const NavLink = ({ to, label, icon }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all group"
  >
    {icon && <span className="text-slate-400 group-hover:text-blue-600 transition-colors">{icon}</span>}
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="text-lg font-bold text-slate-800 dark:text-white hover:text-blue-600 transition-colors"
  >
    {label}
  </Link>
);

export default PublicHeader;