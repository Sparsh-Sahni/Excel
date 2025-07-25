import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import FileUpload from '../models/FileUpload.js';
// CORRECTED: Importing the single, merged User model
import { User } from '../models/user.model.js'; 

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = process.env.UPLOAD_DIR || 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
    }
  }
});

// Upload and process Excel file
// NOTE: This route should be protected by authentication middleware that adds `req.userId`
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // REMOVED: Hardcoded fallback user ID. Assumes req.userId is provided by auth middleware.
    if (!req.body.userId) {
        return res.status(401).json({ error: 'Unauthorized. User ID is required.' });
    }

    // Create file upload record
    const fileUpload = new FileUpload({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadPath: req.file.path,
      uploadedBy: req.body.userId,
      processingStatus: 'processing'
    });

    await fileUpload.save();

    // Process the Excel file
    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheetNames = workbook.SheetNames;
      const extractedData = {
        sheets: [],
        summary: {
          totalSheets: sheetNames.length,
          totalRows: 0,
          totalColumns: 0,
          dataTypes: []
        }
      };

      // Process each sheet
      for (const sheetName of sheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const sheetData = {
            name: sheetName,
            data: jsonData,
            rowCount: jsonData.length,
            columnCount: jsonData[0] ? jsonData[0].length : 0
          };
          
          extractedData.sheets.push(sheetData);
          extractedData.summary.totalRows += sheetData.rowCount;
          extractedData.summary.totalColumns = Math.max(
            extractedData.summary.totalColumns, 
            sheetData.columnCount
          );
        }
      }

      // Mark as processed
      await fileUpload.markAsProcessed(extractedData);

      // Update user analytics
      const user = await User.findById(req.body.userId);
      if (user) {
        await user.updateAnalytics('filesUploaded');
      }

      // Convert to chart-friendly format
      const chartData = convertToChartFormat(extractedData);

      res.json({
        success: true,
        fileId: fileUpload._id,
        data: chartData,
        metadata: {
          filename: req.file.originalname,
          sheets: extractedData.sheets.length,
          totalRows: extractedData.summary.totalRows
        }
      });

    } catch (processingError) {
      await fileUpload.markAsFailed(processingError.message);
      throw processingError;
    }

  } catch (error) {
    console.error('File upload error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'File processing failed',
      message: error.message 
    });
  }
});

// Get file upload history
router.get('/history/:userId', async (req, res) => {
  try {
    const files = await FileUpload.find({ uploadedBy: req.params.userId })
      .sort({ createdAt: -1 })
      .select('-extractedData')
      .populate('charts', 'title type createdAt');

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific file data
router.get('/:fileId', async (req, res) => {
  try {
    const file = await FileUpload.findById(req.params.fileId)
      .populate('uploadedBy', 'name email')
      .populate('charts');

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/:fileId', async (req, res) => {
  try {
    const file = await FileUpload.findById(req.params.fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete physical file
    if (fs.existsSync(file.uploadPath)) {
      fs.unlinkSync(file.uploadPath);
    }

    // Delete from database
    await FileUpload.findByIdAndDelete(req.params.fileId);

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to convert Excel data to chart format
function convertToChartFormat(extractedData) {
  if (!extractedData.sheets || extractedData.sheets.length === 0) {
    return null;
  }

  const sheet = extractedData.sheets[0];
  const data = sheet.data;
  
  if (data.length < 2) {
    return null;
  }

  // Assume first row is headers, subsequent rows are data
  const headers = data[0];
  const rows = data.slice(1);

  // Create chart data format
  const labels = rows.map(row => row[0] || '');
  const values = rows.map(row => {
    const value = row[1];
    return typeof value === 'number' ? value : parseFloat(value) || 0;
  });

  return {
    labels: labels,
    datasets: [{
      label: headers[1] || 'Data',
      data: values,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 2
    }]
  };
}

// CORRECTED: Using ES Module export
export default router;
