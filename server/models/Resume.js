const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
      // Personal Information
      personalInfo: {
        name: String,
        email: String,
        phone: String,
        professionalSummary: String,
        location: String,
        links: [{
          platform: String,
          url: String
        }]
      },
      // Education
      education: [{
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        achievements: [String],
        gpa: String
      }],
      // Work Experience
      experience: [{
        company: String,
        position: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: [String]  // Bullet points
      }],
      // Skills
      skills: {
        technical: [String],
        soft: [String],
        tools: [String],
        certifications: [{
          name: String,
          issuer: String,
          date: Date
        }]
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-increment version number
resumeSchema.pre('save', function(next) {
  if (this.isNew) {
    this.versions = [{
      versionNumber: 1,
      content: {},  // Empty content to be filled
      createdAt: new Date(),
      description: 'Initial version'
    }];
  }
  next();
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume; 