const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  platform: String,
  url: String
});

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  gpa: String,
  achievements: [String]
});

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  location: String,
  startDate: Date,
  endDate: Date,
  current: Boolean,
  description: [String]
});

const languageSchema = new mongoose.Schema({
  name: String,
  proficiency: {
    type: String,
    enum: ['basic', 'intermediate', 'fluent', 'native']
  }
});

const certificationSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  date: Date,
  skills: [String]
});

const userInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // Allows multiple UserInfos per User
  },
  contact: {
    name: String,
    email: String,
    phone: String,
    location: String,
    links: [socialLinkSchema]
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: {
    technical: [String],
    soft: [String],
    languages: [languageSchema],
    certifications: [certificationSchema]
  },
  meta: {
    lastUpdated: Date
  }
}, { timestamps: true });

// Auto-update meta
userInfoSchema.pre('save', function(next) {
  this.meta.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('UserInfo', userInfoSchema);
