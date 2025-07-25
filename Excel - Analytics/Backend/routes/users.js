import express from 'express';
// CORRECTED: Importing the single, merged User model
import { User } from '../models/user.model.js'; 
import Chart from '../models/Chart.js';
import FileUpload from '../models/FileUpload.js';

const router = express.Router();

// Get all users (admin only)
// NOTE: This route should be protected by middleware that checks for admin role
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile (for the user themselves or an admin)
router.put('/:userId', async (req, res) => {
  try {
    const updates = req.body;

    // Prevent certain fields from being updated via this general endpoint
    delete updates.password;
    delete updates.role;
    delete updates.status;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user (admin only)
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Consider what to do with user's content. Re-assign or delete.
    // For now, deleting:
    await Chart.deleteMany({ createdBy: req.params.userId });
    await FileUpload.deleteMany({ uploadedBy: req.params.userId });
    
    // Delete user
    await User.findByIdAndDelete(req.params.userId);

    res.json({ success: true, message: 'User and all associated content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role (admin only)
router.patch('/:userId/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user status (admin only)
router.patch('/:userId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user-specific analytics
router.get('/:userId/analytics', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('analytics');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get additional aggregated analytics
    const charts = await Chart.find({ createdBy: req.params.userId });
    const files = await FileUpload.find({ uploadedBy: req.params.userId });

    const analytics = {
      ...user.toObject().analytics, // Get analytics sub-document
      charts: {
        total: charts.length,
        byType: charts.reduce((acc, chart) => {
          acc[chart.type] = (acc[chart.type] || 0) + 1;
          return acc;
        }, {}),
        totalViews: charts.reduce((sum, chart) => sum + (chart.analytics.views || 0), 0),
        totalDownloads: charts.reduce((sum, chart) => sum + (chart.analytics.downloads || 0), 0)
      },
      files: {
        total: files.length,
        totalSize: files.reduce((sum, file) => sum + file.size, 0),
        processed: files.filter(f => f.processingStatus === 'completed').length
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CORRECTED: Using ES Module export
export default router;
