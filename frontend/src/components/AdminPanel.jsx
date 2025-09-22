import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  User, 
  Save, 
  X, 
  Users,
  Settings,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { candidatesAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState(null);

  const [newCandidate, setNewCandidate] = useState({
    name: ''
  });

  // Fetch candidates on component mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    const response = await candidatesAPI.getAll();
    if (response.success) {
      setCandidates(response.data);
      setError('');
    } else {
      const errorMessage = typeof response.error === 'string' 
        ? response.error 
        : response.error?.message || 'Failed to load candidates';
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name.trim()) {
      setError('Candidate name is required');
      return;
    }

    setLoading(true);
    const response = await candidatesAPI.add(newCandidate);
    if (response.success) {
      setSuccess('Candidate added successfully!');
      setNewCandidate({ name: '' });
      setShowAddForm(false);
      await fetchCandidates();
    } else {
      const errorMessage = typeof response.error === 'string' 
        ? response.error 
        : response.error?.message || 'Failed to add candidate';
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    if (!editingCandidate.name.trim()) {
      setError('Candidate name is required');
      return;
    }

    setLoading(true);
    const response = await candidatesAPI.update(editingCandidate.id, {
      name: editingCandidate.name
    });
    if (response.success) {
      setSuccess('Candidate updated successfully!');
      setEditingCandidate(null);
      await fetchCandidates();
    } else {
      const errorMessage = typeof response.error === 'string' 
        ? response.error 
        : response.error?.message || 'Failed to update candidate';
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    setDeleting(candidateId);
    const response = await candidatesAPI.delete(candidateId);
    if (response.success) {
      setSuccess('Candidate deleted successfully!');
      await fetchCandidates();
    } else {
      const errorMessage = typeof response.error === 'string' 
        ? response.error 
        : response.error?.message || 'Failed to delete candidate';
      setError(errorMessage);
    }
    setDeleting(null);
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (!user?.role === 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-black mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-black mr-3" />
            <h1 className="text-4xl font-bold text-black">Admin Panel</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage candidates and voting system
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-800">{candidates.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Admin User</p>
                <p className="text-lg font-bold text-gray-800">{user?.username}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between"
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {error}
              </div>
              <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                {success}
              </div>
              <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Candidate Button */}
        <div className="mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Candidate</span>
          </motion.button>
        </div>

        {/* Add Candidate Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Candidate</h3>
              <form onSubmit={handleAddCandidate} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ name: e.target.value })}
                    className="input-field"
                    placeholder="Enter candidate name"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Add</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCandidate({ name: '' });
                    }}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Candidates List */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Manage Candidates</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading candidates...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">No Candidates</h4>
              <p className="text-gray-600">Add your first candidate to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6"
                >
                  {editingCandidate?.id === candidate.id ? (
                    // Edit Form
                    <form onSubmit={handleUpdateCandidate} className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editingCandidate.name}
                          onChange={(e) => setEditingCandidate({
                            ...editingCandidate,
                            name: e.target.value
                          })}
                          className="input-field"
                          placeholder="Candidate name"
                          required
                        />
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={loading}
                          className="btn-primary flex items-center space-x-1 text-sm px-3 py-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setEditingCandidate(null)}
                          className="btn-secondary flex items-center space-x-1 text-sm px-3 py-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </motion.button>
                      </div>
                    </form>
                  ) : (
                    // Display Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{candidate.name}</h4>
                          <p className="text-sm text-gray-600">{candidate.votes} votes</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setEditingCandidate(candidate)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteCandidate(candidate.id)}
                          disabled={deleting === candidate.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === candidate.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;