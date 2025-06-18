# Job Description and Job Seeker Information System

This system allows job seekers to store and manage job descriptions and their personal information in Firebase Firestore, linked to their user accounts.

## Firebase Collections

### JobDescription Collection
Stores job description information entered by users.

**Document Structure:**
```javascript
{
  title: "Senior Software Engineer",
  company: "Tech Corp Inc.",
  description: "Job description text...",
  requirements: ["Requirement 1", "Requirement 2", ...],
  responsibilities: ["Responsibility 1", "Responsibility 2", ...],
  keySkills: ["JavaScript", "React", "Node.js", ...],
  userId: "firebase-user-uid",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### JobSeekerInfo Collection
Stores job seeker profile information.

**Document Structure:**
```javascript
{
  personalInfo: {
    fullName: "John Smith",
    email: "john@example.com",
    phone: "+1-555-123-4567",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/johnsmith",
    portfolio: "https://johnsmith.dev",
    summary: "Professional summary..."
  },
  education: [
    {
      school: "Stanford University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2016-09",
      endDate: "2020-06",
      gpa: "3.8/4.0",
      achievements: "Dean's List, Honor Society"
    }
  ],
  experience: [
    {
      company: "TechCorp Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2020-07",
      endDate: "",
      current: true,
      description: "Led development of microservices..."
    }
  ],
  skills: {
    technical: "JavaScript, React, Node.js, AWS",
    soft: "Leadership, Communication, Problem Solving",
    languages: "English (Native), Spanish (Conversational)",
    certifications: "AWS Certified Developer"
  },
  userId: "firebase-user-uid",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## API Endpoints

### Job Description Endpoints
- `POST /api/job-description` - Create new job description
- `GET /api/job-description` - Get all job descriptions for user
- `GET /api/job-description/:id` - Get specific job description
- `PUT /api/job-description/:id` - Update job description
- `DELETE /api/job-description/:id` - Delete job description

### Job Seeker Information Endpoints
- `POST /api/job-seeker-info` - Create new job seeker information
- `GET /api/job-seeker-info` - Get all job seeker information for user
- `GET /api/job-seeker-info/:id` - Get specific job seeker information
- `PUT /api/job-seeker-info/:id` - Update job seeker information
- `DELETE /api/job-seeker-info/:id` - Delete job seeker information

## Authentication

All endpoints require Firebase authentication. Include the Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

## Seeding Data

### Seed Job Descriptions
```bash
cd server
node scripts/seedJobInfoToFirebase.js
```

### Seed Job Seeker Information
```bash
cd server
node scripts/seedProfileInfoToFirebase.js
```

## Client-Side Usage

### Job Description Service
```javascript
import jobDescriptionService from '../services/jobInfoService';

// Create job description
const result = await jobDescriptionService.createJobDescription(jobData);

// Get all job descriptions
const jobDescriptions = await jobDescriptionService.getJobDescriptionList();

// Get specific job description
const jobDescription = await jobDescriptionService.getJobDescriptionById(id);

// Update job description
await jobDescriptionService.updateJobDescription(id, updatedData);

// Delete job description
await jobDescriptionService.deleteJobDescription(id);
```

### Job Seeker Information Service
```javascript
import jobSeekerInfoService from '../services/profileInfoService';

// Create job seeker information
const result = await jobSeekerInfoService.createJobSeekerInfo(profileData);

// Get all job seeker information
const profiles = await jobSeekerInfoService.getJobSeekerInfoList();

// Get specific job seeker information
const profile = await jobSeekerInfoService.getJobSeekerInfoById(id);

// Update job seeker information
await jobSeekerInfoService.updateJobSeekerInfo(id, updatedData);

// Delete job seeker information
await jobSeekerInfoService.deleteJobSeekerInfo(id);
```

## Components

### JobForm
- Form for entering job description information
- Saves data to Firebase via API
- Navigates to ProfileForm after successful save

### ProfileForm
- Form for entering job seeker profile information
- Includes personal info, education, experience, and skills
- Creates resume document in Firestore

### JobInfoList
- Displays all saved job descriptions
- Allows viewing, editing, and deleting job descriptions
- Modal interface for detailed view/edit

### ProfileInfoList
- Displays all saved job seeker profiles
- Allows viewing, editing, and deleting profiles
- Modal interface for detailed view/edit

## Data Flow

1. User enters job description in JobForm
2. Job description is saved to JobDescription collection
3. User enters profile information in ProfileForm
4. Profile information is saved to JobSeekerInfo collection
5. Resume document is created linking both pieces of information
6. User can view/edit their saved data through list components

## Security

- All data is linked to authenticated users via Firebase UID
- Users can only access their own data
- Firebase security rules should be configured to enforce user-based access
- API endpoints verify Firebase tokens before processing requests

## Error Handling

- Client services include comprehensive error handling
- Server routes return appropriate HTTP status codes
- User-friendly error messages are displayed in the UI
- Console logging for debugging purposes

## Future Enhancements

- Bulk import/export functionality
- Data validation and sanitization
- Search and filtering capabilities
- Data analytics and insights
- Integration with job boards and ATS systems 