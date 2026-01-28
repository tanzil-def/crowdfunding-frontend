import React, { useState, useEffect } from 'react';
import adminService from '../../api/adminService';
import { toast } from 'react-hot-toast';
import {
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Shield,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, next: null, previous: null });
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    search: '',
  });

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
      setStats({
        count: data.count,
        next: data.next,
        previous: data.previous
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers();
    }, 500); // Debounce search
    return () => clearTimeout(debounce);
  }, [filters.page, filters.search]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      role: user.role,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(selectedUser.id, editForm);
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await adminService.deactivateUser(id);
      toast.success('User deactivated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Deactivation failed:', error);
      toast.error('Failed to deactivate user');
    }
  };

  const handleVerifyEmail = async (id) => {
    if (!window.confirm('Manually verify this user\'s email?')) return;
    try {
      await adminService.manuallyVerifyEmail(id);
      toast.success('Email verified successfully');
      fetchUsers();
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Failed to verify email');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500">Manage platform users, roles, and access.</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users by email or name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="text-sm text-gray-500">
          Total Users: <span className="font-semibold">{stats.count}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No users found matches your search.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.full_name || 'No Name'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'DEVELOPER' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-green-100 text-green-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                          <CheckCircle className="h-4 w-4" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                          <XCircle className="h-4 w-4" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_email_verified ? (
                        <Shield className="h-5 w-5 text-green-500" />
                      ) : (
                        <button
                          onClick={() => handleVerifyEmail(user.id)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                          title="Click to manually verify"
                        >
                          Verify Now
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.is_active && (
                          <button
                            onClick={() => handleDeactivate(user.id)}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Deactivate User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            disabled={!stats.previous}
            onClick={() => handlePageChange(filters.page - 1)}
            className={`px-4 py-2 border rounded-md text-sm font-medium 
                            ${!stats.previous ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {filters.page}
          </span>
          <button
            disabled={!stats.next}
            onClick={() => handlePageChange(filters.page + 1)}
            className={`px-4 py-2 border rounded-md text-sm font-medium 
                            ${!stats.next ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsEditModalOpen(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleEditSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit User</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      >
                        <option value="INVESTOR">Investor</option>
                        <option value="DEVELOPER">Developer</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={editForm.is_active}
                        onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                      />
                      <label className="ml-2 block text-sm text-gray-900">Is Active</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={editForm.is_email_verified}
                        onChange={(e) => setEditForm({ ...editForm, is_email_verified: e.target.checked })}
                      />
                      <label className="ml-2 block text-sm text-gray-900">Email Verified</label>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;