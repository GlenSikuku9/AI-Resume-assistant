const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  versions: [{
    versionNumber: {
      type: Number,
      required: true
    },
    content: {
      // Dynamic sections based on template
      sections: {
        type: Map,
        of: mongoose.Mixed
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Auto-versioning and template validation
resumeSchema.pre('save', async function(next) {
  if (this.isNew) {
    const template = await mongoose.model('Template').findById(this.template);
    if (!template) throw new Error('Invalid template reference');
    
    this.versions = [{
      versionNumber: 1,
      content: { sections: new Map() },
      description: 'Initial version'
    }];
  }
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);