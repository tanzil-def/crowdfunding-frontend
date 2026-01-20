import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import developerService from "../../api/developerService";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Box,
  Trash2,
  Eye,
  X,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ProjectMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    type: "IMAGE",
    file: null,
    is_restricted: false,
  });

  useEffect(() => {
    fetchMedia();
  }, [id]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await developerService.getProjectMedia(id);
      setMedia(data.results || []);
    } catch (err) {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Determine type based on file
      const fileType = file.type.startsWith("image/") ? "IMAGE" : "MODEL_3D";
      setUploadForm({ ...uploadForm, file, type: fileType });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadForm.file) {
      toast.error("Please select a file");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("type", uploadForm.type);
      formData.append("file", uploadForm.file);
      formData.append("is_restricted", uploadForm.is_restricted);

      await developerService.uploadProjectMedia(id, formData);

      toast.success("Media uploaded successfully!");
      setUploadForm({ type: "IMAGE", file: null, is_restricted: false });

      // Reset file input
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";

      // Refresh media list
      fetchMedia();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const getMediaIcon = (type) => {
    return type === "IMAGE" ? ImageIcon : Box;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/developer/projects")}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Projects
          </button>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Project Media
          </h1>
          <p className="text-gray-400 text-lg">
            Upload and manage images and 3D models for your project
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-400" />
            Upload New Media
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2">File Type</label>
              <select
                value={uploadForm.type}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, type: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="IMAGE">Image</option>
                <option value="MODEL_3D">3D Model</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Select File</label>
              <input
                id="file-input"
                type="file"
                accept={
                  uploadForm.type === "IMAGE"
                    ? "image/*"
                    : ".glb,.gltf,.obj,.fbx"
                }
                onChange={handleFileSelect}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-bold hover:file:bg-blue-500"
              />
              {uploadForm.file && (
                <p className="text-sm text-blue-400 mt-2">
                  Selected: {uploadForm.file.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_restricted"
                checked={uploadForm.is_restricted}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, is_restricted: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-slate-700"
              />
              <label htmlFor="is_restricted" className="text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mark as restricted (requires access approval)
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || !uploadForm.file}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Media
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Media Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Uploaded Media</h2>

          {media.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
              <ImageIcon className="w-20 h-20 text-blue-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No Media Yet</h3>
              <p className="text-gray-400">Upload images or 3D models to showcase your project</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item, index) => {
                const MediaIcon = getMediaIcon(item.type);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group"
                  >
                    {/* Preview */}
                    <div className="relative aspect-video bg-slate-700/30">
                      {item.type === "IMAGE" ? (
                        <img
                          src={item.file_url}
                          alt="Project media"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Box className="w-16 h-16 text-blue-400" />
                        </div>
                      )}

                      {/* Restricted Badge */}
                      {item.is_restricted && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Restricted
                        </div>
                      )}

                      {/* View Button */}
                      {item.type === "IMAGE" && (
                        <button
                          onClick={() => setSelectedImage(item)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Eye className="w-8 h-8 text-white" />
                        </button>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MediaIcon className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-semibold text-sm">
                            {item.type === "IMAGE" ? "Image" : "3D Model"}
                          </span>
                        </div>
                        {item.is_restricted ? (
                          <Lock className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <p className="text-gray-400 text-xs">
                        Uploaded: {new Date(item.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold mb-2">Media Guidelines</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Images: PNG, JPG, WEBP (max 5MB)</li>
                <li>• 3D Models: GLB, GLTF, OBJ, FBX (max 50MB)</li>
                <li>• Restricted media requires investor access approval</li>
                <li>• Upload high-quality images to attract investors</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage.file_url}
              alt="Project media"
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectMedia;