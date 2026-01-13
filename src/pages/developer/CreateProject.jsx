import React, { useEffect, useState } from 'react';
import { Plus, FileText, DollarSign, Layers, Info, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    total_project_value: '',
    total_shares: '',
    is_3d_restricted: false,
  });

  const [sharePrice, setSharePrice] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Auto-calculate share price
  useEffect(() => {
    const value = parseFloat(formData.total_project_value);
    const shares = parseInt(formData.total_shares);
    setSharePrice(value > 0 && shares > 0 ? (value / shares).toFixed(2) : 0);
  }, [formData.total_project_value, formData.total_shares]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'IMAGE' : 'MODEL_3D',
      is_restricted: false
    }));
    setMediaFiles(prev => [...prev, ...newFiles]);
  };

  const removeMedia = (id) => setMediaFiles(prev => prev.filter(f => f.id !== id));

  const toggleRestriction = (id) =>
    setMediaFiles(prev => prev.map(f => f.id === id ? { ...f, is_restricted: !f.is_restricted } : f));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/projects/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Failed to create project');

      const projectId = result.data.id;

      // Upload media
      if (mediaFiles.length > 0) {
        for (const item of mediaFiles) {
          const form = new FormData();
          form.append('file', item.file);
          form.append('type', item.type);
          form.append('is_restricted', item.is_restricted);

          await fetch(`/api/projects/${projectId}/media/upload/`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: form
          });
        }
      }

      setMessage({ type: 'success', text: 'Project created successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-blue-600 text-white rounded-xl">
          <Plus size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-1">List your real estate project for crowdfunding</p>
        </div>
      </div>

      {message.text && (
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 shadow-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Left & Middle: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Info */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <FileText className="text-blue-600" /> Project Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  name="title"
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Skyline Luxury Residences"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Describe your project..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Layers className="text-purple-600" /> Media & Visuals
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 transition cursor-pointer relative">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*,.glb,.gltf,.obj"
              />
              <Upload className="mx-auto text-gray-400 mb-3" size={40} />
              <p className="font-medium text-gray-700">Upload Images or 3D Models</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG, GLB, GLTF, OBJ</p>
            </div>

            {/* Media Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {mediaFiles.map(file => (
                <div key={file.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                  {file.type === 'IMAGE' ? (
                    <img src={file.preview} alt="preview" className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                      3D Model
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => toggleRestriction(file.id)}
                      className={`p-2 rounded-full ${file.is_restricted ? 'bg-orange-500' : 'bg-gray-700/70'} text-white text-xs`}
                      title={file.is_restricted ? 'Restricted' : 'Public'}
                    >
                      <Info size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMedia(file.id)}
                      className="p-2 bg-red-500 rounded-full text-white text-xs"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                    {file.file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial & Restrictions */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <DollarSign className="text-green-600" /> Financial Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Value ($)</label>
                <input
                  type="number"
                  name="total_project_value"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="0.00"
                  value={formData.total_project_value}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Shares</label>
                <input
                  type="number"
                  name="total_shares"
                  required
                  min="1"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="1000"
                  value={formData.total_shares}
                  onChange={handleInputChange}
                />
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-700 font-medium">Share Price:</span>
                  <span className="text-xl font-bold text-green-800">${sharePrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Info className="text-orange-600" /> Access Control
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="is_3d_restricted"
                  className="sr-only"
                  checked={formData.is_3d_restricted}
                  onChange={handleInputChange}
                />
                <div className={`w-12 h-6 rounded-full transition ${formData.is_3d_restricted ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.is_3d_restricted ? 'translate-x-6' : ''}`} />
                </div>
              </div>
              <span className="text-gray-700 font-medium">Restrict 3D Model Access</span>
            </label>
            <p className="text-sm text-gray-500 mt-2">Only approved investors can view 3D visuals.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;