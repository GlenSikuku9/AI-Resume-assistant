const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'contact',
      'summary',
      'skills',
      'experience',
      'education',
      'certifications',
      'projects',
      'volunteering',
      'references'
    ]
  },
  required: {
    type: Boolean,
    default: false
  },
  maxItems: Number
});

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['skills-focused', 'balanced-combination', 'timeline-driven'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  previewImage: String,
  sections: [sectionSchema],
  defaultOrder: {
    type: [String],
    validate: {
      validator: function(order) {
        return this.sections.every(s => order.includes(s.name));
      },
      message: 'Default order must include all sections'
    }
  },
  styling: {
    fontFamily: String,
    primaryColor: String,
    spacing: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Query helpers
templateSchema.query.active = function() {
  return this.where({ isActive: true });
};

templateSchema.query.byCategory = function(category) {
  return this.where({ category });
};

module.exports = mongoose.model('Template', templateSchema);

