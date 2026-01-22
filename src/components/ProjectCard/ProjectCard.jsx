import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Calendar,
    DollarSign,
    Users,
    Lock,
    Unlock,
    Eye,
    Heart
} from 'lucide-react';

/**
 * ProjectCard Component
 * Displays project information in a card format with progress bars,
 * share price, days left, and trust indicators
 */
const ProjectCard = ({ project, index = 0 }) => {
    const {
        id,
        title,
        description,
        category,
        total_project_value,
        share_price,
        shares_sold,
        total_shares,
        remaining_shares,
        funding_percentage,
        duration_days,
        is_3d_restricted,
        has_access,
        created_at,
    } = project;

    // Calculate days left (simplified - you may want to use actual end date)
    const daysLeft = duration_days - Math.floor((Date.now() - new Date(created_at)) / (1000 * 60 * 60 * 24));
    const isFullyFunded = remaining_shares === 0;
    const isAlmostFunded = funding_percentage >= 90;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
        >
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                {isFullyFunded ? (
                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-xs font-bold text-emerald-400">
                        Fully Funded
                    </span>
                ) : isAlmostFunded ? (
                    <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs font-bold text-yellow-400">
                        Almost There!
                    </span>
                ) : null}

                {is_3d_restricted && (
                    <div className="p-1.5 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700/50">
                        {has_access ? (
                            <Unlock className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <Lock className="w-4 h-4 text-yellow-400" />
                        )}
                    </div>
                )}
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-full text-xs font-semibold text-slate-300">
                    {category}
                </span>
            </div>

            {/* Project Image/Placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-emerald-400/20" />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Title & Description */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Funding Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Funding Progress</span>
                        <span className="font-bold text-emerald-400">{funding_percentage.toFixed(1)}%</span>
                    </div>
                    <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(funding_percentage, 100)}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{shares_sold.toLocaleString()} shares sold</span>
                        <span>{remaining_shares.toLocaleString()} remaining</span>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/50">
                    {/* Price per Share */}
                    <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <DollarSign className="w-3 h-3" />
                            <span>Price per Share</span>
                        </div>
                        <p className="text-lg font-bold text-white">
                            ${parseFloat(share_price).toFixed(2)}
                        </p>
                    </div>

                    {/* Days Left */}
                    <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>Days Left</span>
                        </div>
                        <p className={`text-lg font-bold ${daysLeft < 7 ? 'text-red-400' : daysLeft < 30 ? 'text-yellow-400' : 'text-white'
                            }`}>
                            {daysLeft > 0 ? daysLeft : 0}
                        </p>
                    </div>

                    {/* Total Value */}
                    <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <TrendingUp className="w-3 h-3" />
                            <span>Total Value</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-400">
                            ${parseFloat(total_project_value).toLocaleString()}
                        </p>
                    </div>

                    {/* Total Shares */}
                    <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Users className="w-3 h-3" />
                            <span>Total Shares</span>
                        </div>
                        <p className="text-sm font-bold text-white">
                            {total_shares.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 pt-4">
                    <Link
                        to={`/investor/projects/${id}`}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center space-x-2"
                    >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                    </Link>

                    <button className="p-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-emerald-500/50 rounded-lg transition-all group/btn">
                        <Heart className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-400 group-hover/btn:fill-emerald-400 transition-all" />
                    </button>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
};

export default ProjectCard;
