import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, X, Shield, AlertTriangle } from 'lucide-react';

const AdminKeyModal = ({ onClose, onSuccess }) => {
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // The secret admin key (in a real app, this would be stored securely)
  const ADMIN_KEY = 'EXCEL_ADMIN_2024';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    // Simulate verification delay
    setTimeout(() => {
      if (adminKey === ADMIN_KEY) {
        onSuccess();
      } else {
        setError('Invalid admin key. Access denied.');
      }
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gray-800 p-6 rounded-lg max-w-md w-full border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Admin Access Required</h3>
              <p className="text-sm text-gray-400">Enter the admin key to continue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Admin Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-500/20 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isVerifying || !adminKey}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isVerifying ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isVerifying ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Access Admin Panel'
              )}
            </motion.button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-yellow-400 text-sm font-medium">Security Notice</p>
              <p className="text-yellow-300 text-xs mt-1">
                Admin access grants full control over user management and system settings. 
                Only authorized personnel should have access to this key.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminKeyModal;