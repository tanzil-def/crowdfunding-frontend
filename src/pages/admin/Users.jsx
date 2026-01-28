import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  X,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, next: null, previous: null });
  const [filters, setFilters] = useState({ page: 1, page_size: 10, search: '' });

  // Modals State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Custom Confirm Modal State (Centered Look)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: '', // 'DEACTIVATE' or 'VERIFY'
    userId: null,
    message: ''
  });

  const [editForm, setEditForm] = useState({
    role: '',
    is_active: true,
    is_email_verified: false
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(filters);
      setUsers(data.results || []);
      setStats({ count: data.count, next: data.next, previous: data.previous });
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(debounce);
  }, [filters.page, filters.search]);

  // --- Handlers ---
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({ role: user.role, is_active: user.is_active, is_email_verified: user.is_email_verified });
    setIsEditModalOpen(true);
  };

  const openConfirm = (type, userId, message) => {
    setConfirmModal({ isOpen: true, type, userId, message });
  };

  const closeConfirm = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const processConfirm = async () => {
    const { type, userId } = confirmModal;
    try {
      if (type === 'DEACTIVATE') {
        await adminService.deactivateUser(userId);
        toast.success('User deactivated');
      } else if (type === 'VERIFY') {
        await adminService.manuallyVerifyEmail(userId);
        toast.success('Email verified');
      }
      fetchUsers();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      closeConfirm();
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(selectedUser.id, editForm);
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-slate-200">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
          User <span className="text-emerald-500">Control</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Management Protocol v4.0</p>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/50 border border-white/5 p-4 rounded-[1.5rem] mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-xl">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl focus:outline-none focus:border-emerald-500/50 transition-all text-sm italic"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-[10px] font-black uppercase tracking-widest">
          Total Records: {stats.count}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Access Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4 text-right">Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Syncing Protocol...</span>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black italic shadow-lg shadow-emerald-500/20">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-black text-white italic">{user.full_name || 'UNDEFINED'}</div>
                          <div className="text-[10px] text-slate-500 font-mono tracking-tighter">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[9px] font-black tracking-widest uppercase italic">
                      <span className={user.role === 'ADMIN' ? 'text-purple-400' : user.role === 'DEVELOPER' ? 'text-blue-400' : 'text-emerald-400'}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${user.is_active ? 'text-emerald-500' : 'text-red-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        {user.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {user.is_email_verified ? (
                        <Shield className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <button
                          onClick={() => openConfirm('VERIFY', user.id, `Manually verify: ${user.email}?`)}
                          className="text-[9px] font-black uppercase text-blue-400 border border-blue-500/30 px-2 py-1 rounded hover:bg-blue-500/10 transition-all"
                        >
                          Verify Now
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClick(user)} className="p-2 bg-slate-800 rounded-lg hover:text-emerald-500 transition-all"><Edit size={16} /></button>
                        {user.is_active && (
                          <button onClick={() => openConfirm('DEACTIVATE', user.id, `Deactivate account: ${user.email}?`)} className="p-2 bg-slate-800 rounded-lg hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
          <button disabled={!stats.previous} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:text-emerald-500 transition-all"><ChevronLeft size={16} /> Prev</button>
          <div className="text-[10px] font-black bg-slate-800 px-4 py-1 rounded-full text-slate-400 italic">Sector: {filters.page}</div>
          <button disabled={!stats.next} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:text-emerald-500 transition-all">Next <ChevronRight size={16} /></button>
        </div>
      </div>

      {/* --- CENTERED CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/60">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mb-2">Are you sure?</h3>
              <p className="text-slate-400 text-sm mb-8 italic">{confirmModal.message}</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={closeConfirm}
                  className="py-3 rounded-xl bg-slate-800 text-[11px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all text-white"
                >
                  No
                </button>
                <button
                  onClick={processConfirm}
                  className="py-3 rounded-xl bg-emerald-500 text-slate-950 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/60">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h2 className="text-lg font-black italic text-white uppercase tracking-widest flex items-center gap-2">
                  <UserCheck className="text-emerald-500" size={20} /> Update_Node
                </h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">System Role</label>
                  <select
                    className="w-full bg-slate-950 border border-white/5 rounded-xl p-3 text-sm focus:border-emerald-500/50 outline-none text-white italic"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    <option value="INVESTOR">INVESTOR</option>
                    <option value="DEVELOPER">DEVELOPER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Active_Status</span>
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" checked={editForm.is_active} onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Verify_Node</span>
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" checked={editForm.is_email_verified} onChange={(e) => setEditForm({ ...editForm, is_email_verified: e.target.checked })} />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-emerald-500 text-slate-950 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all">
                  Commit_Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;