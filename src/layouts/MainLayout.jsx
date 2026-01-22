import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Home,
    LayoutDashboard,
    Briefcase,
    TrendingUp,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Search,
    Shield,
    FileText,
    BarChart3,
    Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '../components/Header/NotificationBell';
import Footer from '../components/Footer/Footer';
import { logout } from '../store/slices/userSlice';
import authService from '../api/authService';

const MainLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        dispatch(logout());
        navigate('/login');
    };

    // Role-based navigation items
    const getNavigationItems = () => {
        const baseItems = [
            { name: 'Home', path: '/', icon: Home, roles: ['ADMIN', 'DEVELOPER', 'INVESTOR'] },
        ];

        const roleSpecificItems = {
            ADMIN: [
                { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
                { name: 'Projects', path: '/admin/projects', icon: Briefcase },
                { name: 'Users', path: '/admin/users', icon: Users },
                { name: 'Access Requests', path: '/admin/access-requests', icon: Shield },
                { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
            ],
            DEVELOPER: [
                { name: 'Dashboard', path: '/developer', icon: LayoutDashboard },
                { name: 'My Projects', path: '/developer/projects', icon: Briefcase },
                { name: 'Create Project', path: '/developer/projects/create', icon: FileText },
                { name: 'Analytics', path: '/developer/analytics', icon: TrendingUp },
            ],
            INVESTOR: [
                { name: 'Dashboard', path: '/investor', icon: LayoutDashboard },
                { name: 'Browse Projects', path: '/investor/projects', icon: Search },
                { name: 'My Portfolio', path: '/investor/portfolio', icon: Wallet },
                { name: 'Compare Projects', path: '/investor/compare', icon: BarChart3 },
                { name: 'My Investments', path: '/investor/investments', icon: TrendingUp },
            ],
        };

        return [...baseItems, ...(roleSpecificItems[user?.role] || [])];
    };

    const navigationItems = getNavigationItems();

    const isActiveRoute = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Navbar */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    CrowdFund
                                </h1>
                                <p className="text-[10px] text-slate-400 -mt-1">Trading Platform</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActiveRoute(item.path)
                                            ? 'bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-emerald-400'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notification Bell */}
                            <NotificationBell />

                            {/* User Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all group"
                                >
                                    <div className="hidden sm:block text-right">
                                        <p className="text-sm font-semibold text-white">
                                            {user?.first_name} {user?.last_name}
                                        </p>
                                        <p className="text-xs text-emerald-400 capitalize">{user?.role?.toLowerCase()}</p>
                                    </div>
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                                        >
                                            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-b border-slate-700">
                                                <p className="text-sm font-semibold text-white">{user?.email}</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    to={`/${user?.role?.toLowerCase()}/settings`}
                                                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all text-slate-300 hover:text-white"
                                                    onClick={() => setIsProfileDropdownOpen(false)}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Settings</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-all text-slate-300 hover:text-red-400"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-all"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6 text-slate-300" />
                                ) : (
                                    <Menu className="w-6 h-6 text-slate-300" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActiveRoute(item.path)
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'text-slate-300 hover:bg-slate-800/50 hover:text-emerald-400'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MainLayout;
