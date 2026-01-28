import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';
import { toast } from 'react-hot-toast';
import {
    FileText,
    Search,
    Filter,
    User,
    Clock,
    Database,
    Shield
} from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ count: 0, next: null, previous: null });
    const [filters, setFilters] = useState({
        page: 1,
        page_size: 20,
        action: '',
        entity_type: '',
        search: '',
        ordering: '-created_at'
    });

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAuditLogs(filters);
            setLogs(data.results || []);
            setStats({
                count: data.count,
                next: data.next,
                previous: data.previous
            });
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchLogs();
        }, 500);
        return () => clearTimeout(debounce);
    }, [filters.page, filters.action, filters.entity_type, filters.search]);

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Audit Logs</h1>
                <p className="text-gray-500">Track system activities and security events.</p>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search actor email or metadata..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.search}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <select
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.entity_type}
                        onChange={(e) => handleFilterChange('entity_type', e.target.value)}
                    >
                        <option value="">All Entities</option>
                        <option value="USER">User</option>
                        <option value="PROJECT">Project</option>
                        <option value="ACCESS_REQUEST">Access Request</option>
                        <option value="PAYMENT">Payment</option>
                        <option value="SYSTEM">System</option>
                    </select>

                    <select
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.action}
                        onChange={(e) => handleFilterChange('action', e.target.value)}
                    >
                        <option value="">All Actions</option>
                        <option value="CREATE">Create</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                        <option value="APPROVE">Approve</option>
                        <option value="REJECT">Reject</option>
                        <option value="LOGIN">Login</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No logs found.</td></tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">{log.actor_email || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Database className="h-3 w-3 text-gray-400" />
                                                {log.entity_type} {log.entity_id && <span className="text-xs text-gray-400">({log.entity_id.slice(0, 8)}...)</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-500 max-w-xs overflow-hidden text-ellipsis font-mono bg-gray-50 p-1 rounded">
                                                {JSON.stringify(log.metadata || {})}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <button
                        disabled={!stats.previous}
                        onClick={() => handlePageChange(filters.page - 1)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${!stats.previous ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">Page {filters.page}</span>
                    <button
                        disabled={!stats.next}
                        onClick={() => handlePageChange(filters.page + 1)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${!stats.next ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
