import express from 'express';
import { User } from '../models/user.model.js'; 
import Chart from '../models/Chart.js';

const router = express.Router();

// Create new chart
// The 'createdBy' field now comes from the authenticated user's token
router.post('/', async (req, res) => {
  try {
    const { title, type, data, configuration, sourceFile, metadata } = req.body;
    const createdBy = req.userId; // Use userId from verifyToken middleware

    const chart = new Chart({
      title,
      type,
      data,
      configuration,
      sourceFile,
      metadata,
      createdBy
    });

    await chart.save();

    if (createdBy) {
      const user = await User.findById(createdBy);
      if (user) {
        await user.updateAnalytics('chartsCreated');
      }
    }

    res.status(201).json(chart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all charts for the LOGGED-IN user
// **** THIS IS THE FIX ****
// The route is changed from '/user/:userId' to just '/user'
router.get('/user', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, sortBy = 'createdAt' } = req.query;
    
    // We now use req.userId from the token, which is a valid ObjectId
    const filter = { createdBy: req.userId }; 
    if (type) filter.type = type;

    const charts = await Chart.find(filter)
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email');

    const total = await Chart.countDocuments(filter);

    res.json({
      charts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific chart
router.get('/:chartId', async (req, res) => {
  try {
    const chart = await Chart.findById(req.params.chartId).populate('createdBy', 'name email');
    if (!chart) {
      return res.status(404).json({ error: 'Chart not found' });
    }
    if (chart.createdBy._id.toString() !== req.userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    await chart.incrementViews();
    res.json(chart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update chart
router.put('/:chartId', async (req, res) => {
    try {
        const chart = await Chart.findById(req.params.chartId);
        if (!chart) {
            return res.status(404).json({ error: 'Chart not found' });
        }
        if (chart.createdBy.toString() !== req.userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const updatedChart = await Chart.findByIdAndUpdate(req.params.chartId, req.body, { new: true });
        res.json(updatedChart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete chart
router.delete('/:chartId', async (req, res) => {
    try {
        const chart = await Chart.findById(req.params.chartId);
        if (!chart) {
            return res.status(404).json({ error: 'Chart not found' });
        }
        if (chart.createdBy.toString() !== req.userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await Chart.findByIdAndDelete(req.params.chartId);
        res.json({ success: true, message: 'Chart deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
