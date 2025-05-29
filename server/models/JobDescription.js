const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  requirements: { 
    type: [String]  // Array of bullet points
  },
  responsibilities: { 
    type: [String] 
  },
  keySkills: { 
    type: [String]  // Keywords for ATS
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const JobDescription = mongoose.model('JobDescription', jobDescriptionSchema);

module.exports = JobDescription; 