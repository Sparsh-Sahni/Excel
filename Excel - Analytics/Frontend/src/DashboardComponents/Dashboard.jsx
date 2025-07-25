import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  BarChart3,
  User,
  Settings,
  Download,
  FileSpreadsheet,
  Shield,
  Activity,
  TrendingUp,
  Menu,
  X,
  Brain,
  Zap,
  Target,
  Key,
  LogOut // Added for the logout button
} from 'lucide-react';
import FileUpload from './FileUpload';
import ChartDisplay from './ChartDisplay';
import UserProfile from './UserProfile';
import AdminPanel from './AdminPanel';
import AIInsights from './AIInsights';
import AdminKeyModal from './AdminKeyModal';
import HistoryCenter from './HistoryCenter';
// --- NECESSARY UPDATE: Import stores to manage live data ---
import { useApiStore } from '../store/apiStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Dashboard = () => {
  // --- Your original UI state is preserved ---
  const [activeTab, setActiveTab] = useState('upload');
  const [currentChart, setCurrentChart] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAdminKeyModal, setShowAdminKeyModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const navigate = useNavigate();

  // This local state is kept to drive the UI as per your original design.
  const [userStats, setUserStats] = useState({
    filesUploaded: 0,
    chartsCreated: 0,
    totalDownloads: 0,
    aiInsightsGenerated: 0,
    lastActivity: new Date().toISOString()
  });

  // --- NECESSARY UPDATE: Replace hardcoded data with live data from stores ---
  const { user, logout } = useAuthStore(); // This now gets the REAL logged-in user
  const { files, saveChart, fetchFileHistory, deleteFile, updateUserProfile } = useApiStore();

  // --- NECESSARY UPDATE: Fetch real data when the component loads ---
  useEffect(() => {
    if (user) {
      fetchFileHistory();
    }
  }, [fetchFileHistory, user]);

  // This effect syncs the local UI stats with the real data from the backend
  useEffect(() => {
    setUserStats(prev => ({ ...prev, filesUploaded: files.length, chartsCreated: files.length }));
  }, [files]);

  // --- NECESSARY UPDATE: Connect event handlers to the backend ---
  const handleDataUpload = async (data) => {
    const newChartData = { ...data, chartType: '2d', chartStyle: 'bar', createdAt: new Date().toISOString() };
    setCurrentChart(newChartData);
    setActiveTab('charts');
    
    // This part of your original UI logic is preserved
    setUserStats(prev => ({
        ...prev,
        filesUploaded: prev.filesUploaded + 1,
        chartsCreated: prev.chartsCreated + 1,
        lastActivity: new Date().toISOString()
    }));

    // This part connects to the backend
    await saveChart(newChartData);
  };

  const handleFileReload = (fileData) => {
    setCurrentChart({
        ...fileData.data, // Use the nested data object from history
        chartType: '2d',
        chartStyle: fileData.type || 'bar',
    });
    setActiveTab('charts');
  };

  const handleFileDelete = async (fileId) => {
    await deleteFile(fileId);
    if (currentChart && currentChart.id === fileId) {
        setCurrentChart(null);
        setActiveTab('upload');
    }
  };

  const handleProfileUpdate = async (updatedData) => {
      if (user?._id) {
          await updateUserProfile(user._id, updatedData);
      }
  };

  // --- Your original UI logic is preserved ---
  const handleChartTypeChange = (chartType, chartStyle) => {
    if (currentChart) { // Changed from currentFile to currentChart for consistency
      const updatedChart = {
        ...currentChart,
        chartType,
        chartStyle: chartStyle || 'bar',
        updatedAt: new Date().toISOString()
      };
      setCurrentChart(updatedChart);
      setUserStats(prev => ({
        ...prev,
        chartsCreated: prev.chartsCreated + 1,
        lastActivity: new Date().toISOString()
      }));
    }
  };

  // --- Your original Admin Key logic is preserved ---
  const handleAdminAccess = () => {
    if(user?.role !== 'admin') {
      toast.error("You do not have permission to access the admin panel.");
      return;
    }
    if (isAdminAuthenticated) {
      setActiveTab('admin');
    } else {
      setShowAdminKeyModal(true);
    }
  };

  const handleAdminKeySuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminKeyModal(false);
    setActiveTab('admin');
  };

  // --- NECESSARY UPDATE: Add Logout Handler ---
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/");
  };

  // --- RENDER LOGIC (Updated to pass live data) ---
  const sidebarItems = [
    { id: 'upload', label: 'Upload Excel', icon: Upload },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'history', label: 'History', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'admin', label: 'Admin Panel', icon: Shield, requiresAdmin: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <FileUpload onDataUpload={handleDataUpload} />;
      case 'charts':
        return <ChartDisplay data={currentChart} chart={currentChart} onChartTypeChange={handleChartTypeChange} />;
      case 'ai-insights':
        return <AIInsights fileData={currentChart} chartData={currentChart} onInsightGenerated={() => setUserStats(prev => ({ ...prev, aiInsightsGenerated: prev.aiInsightsGenerated + 1 }))} />;
      case 'history':
        const formattedHistory = files.map(chart => ({
            id: chart._id,
            fileName: chart.title,
            uploadDate: chart.createdAt,
            dataPoints: chart.data?.labels?.length || 0,
            status: 'completed',
            data: chart
        }));
        return <HistoryCenter history={formattedHistory} userStats={userStats} onFileReload={handleFileReload} onFileDelete={handleFileDelete} />;
      case 'profile':
        return <UserProfile user={user} onUpdate={handleProfileUpdate} />;
      case 'admin':
        return isAdminAuthenticated ? <AdminPanel /> : null;
      default:
        return <FileUpload onDataUpload={handleDataUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      <motion.header
        className="bg-gray-900 border-gray-800 border-b px-6 py-4 transition-colors duration-300"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold">Excel Analytics Platform</h1>
                <p className="text-xs text-gray-400">
                  AI Insights: <span className="text-sm font-medium text-blue-500">{userStats.aiInsightsGenerated}</span>
                  {' • '}
                  Charts Created: <span className="text-sm font-medium text-green-500">{userStats.chartsCreated}</span>
                </p>
              </div>
            </div>
          </div>
           <motion.button
                onClick={handleLogout}
                className='flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
            </motion.button>
        </div>
      </motion.header>
      <div className="flex h-[calc(100vh-72px)]">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className="w-64 bg-gray-900 border-gray-800 border-r p-4 transition-colors duration-300"
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                    // This is your original security check. It will now work correctly with live user data.
                    if (item.requiresAdmin && user?.role !== 'admin') return null;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => item.requiresAdmin ? handleAdminAccess() : setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.id === 'ai-insights' && (
                          <Zap className="w-4 h-4 text-yellow-500 ml-auto" />
                        )}
                        {item.requiresAdmin && !isAdminAuthenticated && (
                          <Key className="w-4 h-4 text-red-500 ml-auto" />
                        )}
                      </motion.button>
                    );
                })}
              </nav>
              <motion.div
                className="mt-8 p-4 bg-gray-800 rounded-lg transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">
                      Files Processed
                    </span>
                    <span className="text-sm font-medium">{userStats.filesUploaded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">
                      AI Insights
                    </span>
                    <span className="text-sm font-medium text-blue-500">{userStats.aiInsightsGenerated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">
                      Active Users
                    </span>
                    <span className="text-sm font-medium text-green-500">12</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="mt-4 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20 border rounded-lg transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">AI Engine</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">
                    Online & Learning
                  </span>
                </div>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>
        <motion.main
          className={`flex-1 p-6 overflow-y-auto transition-colors duration-300 ${!sidebarOpen ? 'ml-0' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
      <AnimatePresence>
        {showAdminKeyModal && (
          <AdminKeyModal
            onClose={() => setShowAdminKeyModal(false)}
            onSuccess={handleAdminKeySuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
