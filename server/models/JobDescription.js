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
    type: [String]  
  },
  responsibilities: { 
    type: [String] 
  },
  keySkills: { 
    type: [String] 
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    unique: true // one-to-one relationship with a Resume
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const JobDescription = mongoose.model('JobDescription', jobDescriptionSchema);
module.exports = JobDescription;
