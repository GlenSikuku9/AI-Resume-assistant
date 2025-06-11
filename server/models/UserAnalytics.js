const mongoose = require('mongoose');

const userAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Updated reference
    required: true,
    unique: true
  },
  resumesCreated: {
    type: Number,
    default: 0
  },
  totalApiCalls: {
    type: Number,
    default: 0
  },
  pdfDownloads: {
    type: Number,
    default: 0
  },
  tokensUsed: {
    type: Number,
    default: 0
  },
  templateUsageCount: {
    type: Map,
    of: Number,
    default: {}
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
userAnalyticsSchema.index({ userId: 1 });
userAnalyticsSchema.index({ lastActiveAt: 1 });

const UserAnalytics = mongoose.model('UserAnalytics', userAnalyticsSchema);

module.exports = UserAnalytics;
