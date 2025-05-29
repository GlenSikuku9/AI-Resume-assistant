const mongoose = require('mongoose');

const professionalSocialSchema = new mongoose.Schema({
  platform: String,
  username: String
});

const educationSchema = new mongoose.Schema({
  institution: { 
    type: String, 
    required: true 
  },
  degree: String,
  startDate: Date,
  endDate: Date,
  gpa: String,
  achievements: [String]
});

const experienceSchema = new mongoose.Schema({
  company: { 
    type: String, 
    required: true 
  },
  position: String,
  location: String,
  startDate: Date,
  endDate: Date,
  current: { 
    type: Boolean, 
    default: false 
  },
  description: [String] // Bullet points
});

const languageSchema = new mongoose.Schema({
  name: String,
  proficiency: { 
    type: String, 
    enum: ['basic', 'business-proficient', 'fluent']
  }
});

const certificateSchema = new mongoose.Schema({
  name: String,
  completionDate: Date,
  skillsLearned: [String]
});

const volunteeringSchema = new mongoose.Schema({
  name: String,
  period: String,
  description: String
});

const referenceSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  institution: String,
  relationship: String
});

const userInfoSchema = new mongoose.Schema({
  // 1. Personal Info
  personalInfo: {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    phone: String,
    professionalSocials: [professionalSocialSchema]
  },

  // 2. Education
  education: [educationSchema],

  // 3. Experience
  experience: [experienceSchema],

  // 4. Skills
  skills: {
    technical: [String],
    soft: [String],
    languages: [languageSchema],
    certificates: [certificateSchema]
  },

  // 5. Additional Information
  additionalInfo: {
    volunteering: [volunteeringSchema],
    hobbies: [String],
    references: [referenceSchema]
  }
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

module.exports = UserInfo; 