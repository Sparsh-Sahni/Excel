
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  preferences: {
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    },
    defaultChartType: {
      type: String,
      enum: ['2d', '3d'],
      default: '2d'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  analytics: {
    filesUploaded: {
      type: Number,
      default: 0
    },
    chartsCreated: {
      type: Number,
      default: 0
    },
    lastLoginDate: {
      type: Date,
      default: Date.now
    },
    totalDownloads: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
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

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update analytics
userSchema.methods.updateAnalytics = function(field, increment = 1) {
  this.analytics[field] = (this.analytics[field] || 0) + increment;
  this.updatedAt = new Date();
  return this.save();
};

// Virtual for user's full analytics
userSchema.virtual('fullAnalytics').get(function() {
  return {
    ...this.analytics,
    memberSince: this.createdAt,
    lastUpdated: this.updatedAt
  };
});

module.exports = mongoose.model('User', userSchema);
