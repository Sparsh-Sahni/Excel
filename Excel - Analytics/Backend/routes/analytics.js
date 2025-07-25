import express from 'express';
// CORRECTED: Importing the single, merged User model
import { User } from '../models/user.model.js'; 
import Chart from '../models/Chart.js';
import FileUpload from '../models/FileUpload.js';

const router = express.Router();

// Get platform analytics overview
router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const totalCharts = await Chart.countDocuments();
    const totalFiles = await FileUpload.countDocuments();

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentCharts = await Chart.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email')
      .select('title type createdAt createdBy');

    const recentFiles = await FileUpload.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploadedBy', 'name email')
      .select('originalName size createdAt uploadedBy');

    // Calculate growth metrics
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    const newChartsThisMonth = await Chart.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    const newFilesThisMonth = await FileUpload.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        adminUsers,
        totalCharts,
        totalFiles
      },
      growth: {
        newUsersThisMonth,
        newChartsThisMonth,
        newFilesThisMonth
      },
      recentActivity: {
        users: recentUsers,
        charts: recentCharts,
        files: recentFiles
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user activity analytics
router.get('/user-activity', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateFrom = new Date();
    if (period === '7d') {
      dateFrom.setDate(dateFrom.getDate() - 7);
    } else if (period === '30d') {
      dateFrom.setDate(dateFrom.getDate() - 30);
    } else if (period === '90d') {
      dateFrom.setDate(dateFrom.getDate() - 90);
    }

    // User registrations over time
    const userRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: dateFrom } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);

    // Chart creations over time
    const chartCreations = await Chart.aggregate([
        { $match: { createdAt: { $gte: dateFrom } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id': 1 } }
    ]);

    // File uploads over time
    const fileUploads = await FileUpload.aggregate([
        { $match: { createdAt: { $gte: dateFrom } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id': 1 } }
    ]);

    res.json({
      userRegistrations,
      chartCreations,
      fileUploads
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chart analytics
router.get('/charts', async (req, res) => {
  try {
    // Chart type distribution
    const chartTypes = await Chart.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Most popular charts
    const popularCharts = await Chart.find()
      .sort({ 'analytics.views': -1 })
      .limit(10)
      .populate('createdBy', 'name email')
      .select('title type analytics.views analytics.downloads createdBy');

    // Chart creation trends
    const chartTrends = await Chart.aggregate([
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      chartTypes,
      popularCharts,
      chartTrends
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system health metrics
router.get('/health', async (req, res) => {
  try {
    // Note: User.db.db.stats() can be unreliable. A simple connection check is often better.
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    const health = {
      database: {
        status: dbStatus,
      },
      processing: {
        pendingFiles: await FileUpload.countDocuments({ processingStatus: 'pending' }),
        processingFiles: await FileUpload.countDocuments({ processingStatus: 'processing' }),
        failedFiles: await FileUpload.countDocuments({ processingStatus: 'failed' })
      },
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal
      },
      uptime: process.uptime()
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CORRECTED: Using ES Module export
export default router;
