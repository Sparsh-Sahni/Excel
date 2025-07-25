import mongoose from "mongoose";

const chartSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    required: true,
    enum: ['bar', 'line', 'pie', '3d-bar', '3d-line', '3d-surface']
  },
  data: {
    labels: [{
      type: String,
      required: true
    }],
    datasets: [{
      label: String,
      data: [Number],
      backgroundColor: [String],
      borderColor: [String],
      borderWidth: Number,
      fill: Boolean
    }]
  },
  configuration: {
    responsive: {
      type: Boolean,
      default: true
    },
    maintainAspectRatio: {
      type: Boolean,
      default: false
    },
    animation: {
      duration: {
        type: Number,
        default: 1000
      },
      easing: {
        type: String,
        default: 'easeInOutQuart'
      }
    },
    plugins: {
      legend: {
        display: {
          type: Boolean,
          default: true
        },
        position: {
          type: String,
          default: 'top'
        }
      },
      tooltip: {
        enabled: {
          type: Boolean,
          default: true
        }
      }
    }
  },
  sourceFile: {
    filename: String,
    originalName: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    fileSize: Number,
    sheetName: String
  },
  metadata: {
    rows: Number,
    columns: Number,
    dataRange: String,
    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shared: {
    isPublic: {
      type: Boolean,
      default: false
    },
    sharedWith: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      permission: {
        type: String,
        enum: ['view', 'edit'],
        default: 'view'
      },
      sharedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    lastViewed: Date,
    lastDownloaded: Date
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
chartSchema.index({ createdBy: 1 });
chartSchema.index({ type: 1 });
chartSchema.index({ 'shared.isPublic': 1 });
chartSchema.index({ tags: 1 });
chartSchema.index({ createdAt: -1 });

// Method to increment views
chartSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  this.updatedAt = new Date();
  return this.save();
};

// Method to increment downloads
chartSchema.methods.incrementDownloads = function() {
  this.analytics.downloads += 1;
  this.analytics.lastDownloaded = new Date();
  this.updatedAt = new Date();
  return this.save();
};

// Static method to get popular charts
chartSchema.statics.getPopularCharts = function(limit = 10) {
  return this.find({ 'shared.isPublic': true })
    .sort({ 'analytics.views': -1 })
    .limit(limit)
    .populate('createdBy', 'name email');
};

const Chart = mongoose.model('Chart', chartSchema);
export default Chart;