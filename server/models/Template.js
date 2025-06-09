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
  type: {
    type: String,
    enum: ['functional', 'hybrid', 'chronological'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  previewImage: {
    type: String,  // URL to the template preview image
    required: true
  },
  defaultSections: [{
    type: String,
    enum: [
      'contact',
      'careerSummary',
      'skillsAndStrengths',
      'professionalAccomplishments',
      'workHistory',
      'education',
      'profileSummary',
      'skillsAndAccomplishments',
      'workExperience',
      'headline',
      'topSkills'
    ]
  }],
  editableSections: [{
    type: String,
    enum: [
      'contact',
      'careerSummary',
      'skillsAndStrengths',
      'professionalAccomplishments',
      'workHistory',
      'education',
      'certifications',
      'volunteering',
      'portfolio',
      'profileSummary',
      'skillsAndAccomplishments',
      'workExperience',
      'references',
      'hobbies',
      'headline',
      'topSkills'
    ]
  }],
  layoutOptions: {
    theme: [{
      type: String,
      enum: ['light', 'dark']
    }],
    fontFamily: [{
      type: String
    }],
    accentColors: [{
      type: String
    }],
    columnLayout: {
      leftColumn: [{
        type: String
      }],
      rightColumn: [{
        type: String
      }]
    }
  },
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

// Create indexes for faster queries
templateSchema.index({ id: 1 });
templateSchema.index({ type: 1 });
templateSchema.index({ isActive: 1 });

// Static method to get all active templates
templateSchema.statics.getActiveTemplates = function() {
  return this.find({ isActive: true })
    .select('id name type description previewImage recommendedFor')
    .lean();
};

// Static method to get template by ID
templateSchema.statics.getTemplateById = function(templateId) {
  return this.findOne({ id: templateId, isActive: true }).lean();
};

const Template = mongoose.model('Template', templateSchema);

module.exports = Template; 