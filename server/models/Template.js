const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  resumeFormat: {
    type: String,
    enum: ['skills-focused', 'balanced-combination', 'timeline-driven'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  previewImage: {
    type: String, // URL to the template preview image
    required: true
  },
  sections: [{
    type: String,
    enum: [
      'contact',
      'summary',
      'skills',
      'experience',
      'education',
      'certifications',
      'accomplishments',
      'volunteering',
      'references',
      'hobbies'
    ]
  }],
  defaultOrder: [{
    type: String,
    enum: [
      'contact',
      'summary',
      'skills',
      'experience',
      'education',
      'certifications',
      'accomplishments',
      'volunteering',
      'references',
      'hobbies'
    ]
  }],
  userCustomizable: {
    type: Boolean,
    default: true
  },
  recommendedFor: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
templateSchema.index({ id: 1 });
templateSchema.index({ resumeFormat: 1 });
templateSchema.index({ isActive: 1 });

// Static method to get all active templates
templateSchema.statics.getActiveTemplates = function () {
  return this.find({ isActive: true })
    .select('id name resumeFormat description previewImage recommendedFor defaultOrder')
    .lean();
};

// Static method to get template by ID
templateSchema.statics.getTemplateById = function (templateId) {
  return this.findOne({ id: templateId, isActive: true }).lean();
};

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;