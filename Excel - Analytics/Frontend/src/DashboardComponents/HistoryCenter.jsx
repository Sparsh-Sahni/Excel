import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  FileSpreadsheet, 
  BarChart3, 
  Calendar, 
  Download, 
  Eye, 
  Trash2, 
  RefreshCw,
  Filter,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';

const HistoryCenter = ({ history, userStats, onFileReload, onFileDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        case 'size':
          return b.dataPoints - a.dataPoints;
        default:
          return 0;
      }
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return RefreshCw;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'processing': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleReloadFile = (item) => {
    console.log('HistoryCenter: Reloading file:', item);
    if (item.data) {
      console.log('HistoryCenter: File data exists, calling onFileReload');
      onFileReload(item.data);
    } else {
      console.error('HistoryCenter: No data found for file:', item.fileName);
    }
  };

  const handleDeleteFile = (item) => {
    setFileToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      onFileDelete(fileToDelete.id);
      setShowDeleteModal(false);
      setFileToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
            <History className="w-8 h-8 text-blue-500" />
            <span>Upload History</span>
          </h2>
          <p className="text-gray-400">Track your file uploads and analytics history</p>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Files Uploaded</p>
              <p className="text-2xl font-bold">{userStats.filesUploaded}</p>
            </div>
            <FileSpreadsheet className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Charts Created</p>
              <p className="text-2xl font-bold">{userStats.chartsCreated}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">AI Insights</p>
              <p className="text-2xl font-bold">{userStats.aiInsightsGenerated}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Last Activity</p>
              <p className="text-sm font-bold">{formatDate(userStats.lastActivity)}</p>
            </div>
            <Activity className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-white"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-white"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <motion.div
          className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold mb-2">No Files Found</h3>
          <p className="text-gray-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'No files match your search criteria' 
              : 'Upload your first Excel file to see it here'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            return (
              <motion.div
                key={item.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-750 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <FileSpreadsheet className="w-6 h-6 text-blue-500" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{item.fileName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.uploadDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{item.dataPoints} data points</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(item.status)}`} />
                          <span className={getStatusColor(item.status)}>{item.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => handleReloadFile(item)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Reload this file"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleDeleteFile(item)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && fileToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-red-400">Delete File</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <strong>{fileToDelete.fileName}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Activity Timeline */}
      {history.length > 0 && (
        <motion.div
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>Recent Activity</span>
          </h3>
          
          <div className="space-y-3">
            {history.slice(0, 5).map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">
                  Uploaded <strong>{item.fileName}</strong> with {item.dataPoints} data points
                </span>
                <span className="text-gray-500">{formatDate(item.uploadDate)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HistoryCenter;