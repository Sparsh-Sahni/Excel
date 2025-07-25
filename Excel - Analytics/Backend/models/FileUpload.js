import mongoose from "mongoose";

const fileUploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadPath: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  processed: {
    type: Boolean,
    default: false
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingError: {
    type: String,
    default: null
  },
  extractedData: {
    sheets: [{
      name: String,
      data: mongoose.Schema.Types.Mixed,
      rowCount: Number,
      columnCount: Number
    }],
    summary: {
      totalSheets: Number,
      totalRows: Number,
      totalColumns: Number,
      dataTypes: [String]
    }
  },
  metadata: {
    fileExtension: String,
    encoding: String,
    headers: [String],
    dateColumns: [String],
    numberColumns: [String],
    textColumns: [String]
  },
  charts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chart'
  }],
  analytics: {
    downloadCount: {
      type: Number,
      default: 0
    },
    chartGenerations: {
      type: Number,
      default: 0
    },
    lastAccessed: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
fileUploadSchema.index({ uploadedBy: 1 });
fileUploadSchema.index({ processed: 1 });
fileUploadSchema.index({ processingStatus: 1 });
fileUploadSchema.index({ createdAt: -1 });

// Method to mark as processed
fileUploadSchema.methods.markAsProcessed = function(extractedData) {
  this.processed = true;
  this.processingStatus = 'completed';
  this.extractedData = extractedData;
  this.updatedAt = new Date();
  return this.save();
};

// Method to mark as failed
fileUploadSchema.methods.markAsFailed = function(error) {
  this.processingStatus = 'failed';
  this.processingError = error;
  this.updatedAt = new Date();
  return this.save();
};

const FileUpload = mongoose.model('FileUpload', fileUploadSchema);
export default FileUpload;