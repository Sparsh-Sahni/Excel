import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  Filter, 
  Plus,
  Eye,
  Share2,
  MoreVertical,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  User
} from 'lucide-react';

const ReportsCenter = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const reports = [
    {
      id: 1,
      title: 'Monthly Sales Report',
      description: 'Comprehensive analysis of monthly sales performance',
      type: 'sales',
      period: 'monthly',
      createdAt: '2024-01-20',
      createdBy: 'John Doe',
      status: 'completed',
      downloads: 45,
      views: 128,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 2,
      title: 'Customer Analytics Dashboard',
      description: 'User behavior and engagement metrics',
      type: 'analytics',
      period: 'weekly',
      createdAt: '2024-01-19',
      createdBy: 'Jane Smith',
      status: 'processing',
      downloads: 23,
      views: 89,
      icon: BarChart3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 3,
      title: 'Revenue Distribution',
      description: 'Breakdown of revenue by product categories',
      type: 'financial',
      period: 'quarterly',
      createdAt: '2024-01-18',
      createdBy: 'Mike Johnson',
      status: 'completed',
      downloads: 67,
      views: 234,
      icon: PieChart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 4,
      title: 'Performance Metrics',
      description: 'KPI tracking and performance indicators',
      type: 'performance',
      period: 'daily',
      createdAt: '2024-01-17',
      createdBy: 'Sarah Wilson',
      status: 'completed',
      downloads: 34,
      views: 156,
      icon: Activity,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  const filteredReports = reports.filter(report => {
    const periodMatch = selectedPeriod === 'all' || report.period === selectedPeriod;
    const typeMatch = selectedType === 'all' || report.type === selectedType;
    return periodMatch && typeMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10';
      case 'processing': return 'text-yellow-500 bg-yellow-500/10';
      case 'failed': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Reports Center</h2>
          <p className="text-gray-400">Generate and manage your analytics reports</p>
        </div>
        
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Report</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-white"
            >
              <option value="all">All Periods</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-white"
            >
              <option value="all">All Types</option>
              <option value="sales">Sales</option>
              <option value="analytics">Analytics</option>
              <option value="financial">Financial</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-all cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${report.bgColor}`}>
                <report.icon className={`w-6 h-6 ${report.color}`} />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <button className="p-1 hover:bg-gray-700 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{report.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{report.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{report.downloads}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{report.createdBy}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Eye className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
            <FileSpreadsheet className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Downloads</p>
              <p className="text-2xl font-bold">
                {reports.reduce((sum, r) => sum + r.downloads, 0)}
              </p>
            </div>
            <Download className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Views</p>
              <p className="text-2xl font-bold">
                {reports.reduce((sum, r) => sum + r.views, 0)}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Processing</p>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.status === 'processing').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h3 className="text-lg font-semibold mb-4">Create New Report</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Report Title</label>
                  <input
                    type="text"
                    placeholder="Enter report title"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Report Type</label>
                  <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-white">
                    <option value="sales">Sales Report</option>
                    <option value="analytics">Analytics Report</option>
                    <option value="financial">Financial Report</option>
                    <option value="performance">Performance Report</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Period</label>
                  <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-white">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsCenter;