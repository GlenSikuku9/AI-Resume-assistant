# Job Information System

This document describes the job information system that allows job seekers to store and manage job descriptions in Firebase, linked to their user accounts.

## Overview

The job information system provides:
- Storage of job descriptions in Firebase Firestore
- User-specific job information management
- Integration with the resume creation process
- CRUD operations for job information

## Firebase Collection Structure

### Collection: `jobInfo`

Each document in the `jobInfo` collection contains:

```javascript
{
  id: "auto-generated-firebase-id",
  title: "Job Title",
  company: "Company Name", 
  description: "Full job description text",
  requirements: ["Requirement 1", "Requirement 2", ...],
  responsibilities: ["Responsibility 1", "Responsibility 2", ...],
  keySkills: ["Skill 1", "Skill 2", "Skill 3", ...],
  userId: "firebase-user-uid",
  createdAt: "Firebase Timestamp",
  updatedAt: "Firebase Timestamp"
}
```

## API Endpoints

### Base URL: `/api/job-info`

All endpoints require Firebase authentication via Bearer token.

#### POST `/api/job-info`
Create new job information
- **Body**: Job information object
- **Returns**: Created job information with ID

#### GET `/api/job-info`
Get all job information for the authenticated user
- **Returns**: Array of job information objects

#### GET `/api/job-info/:id`
Get specific job information by ID
- **Returns**: Job information object

#### PUT `/api/job-info/:id`
Update existing job information
- **Body**: Updated job information object
- **Returns**: Updated job information

#### DELETE `/api/job-info/:id`
Delete job information
- **Returns**: Success message

## Usage

### 1. Seeding Sample Data

To seed sample job information to Firebase:

```bash
cd server/scripts
node seedJobInfoToFirebase.js
```

This will create sample job entries for testing purposes.

### 2. Client-Side Integration

#### Creating Job Information

```javascript
import jobInfoService from '../services/jobInfoService';

const jobData = {
  title: "Senior Software Engineer",
  company: "Tech Corp Inc.",
  description: "We are looking for...",
  requirements: "Bachelor's degree\n5+ years experience",
  responsibilities: "Design solutions\nWrite code",
  keySkills: "JavaScript, Python, React"
};

try {
  const result = await jobInfoService.createJobInfo(jobData);
  console.log('Job created with ID:', result.id);
} catch (error) {
  console.error('Error creating job:', error);
}
```

#### Retrieving Job Information

```javascript
// Get all jobs for current user
const jobList = await jobInfoService.getJobInfoList();

// Get specific job by ID
const job = await jobInfoService.getJobInfoById(jobId);
```

#### Updating Job Information

```javascript
const updatedData = {
  title: "Updated Job Title",
  company: "Updated Company",
  // ... other fields
};

await jobInfoService.updateJobInfo(jobId, updatedData);
```

#### Deleting Job Information

```javascript
await jobInfoService.deleteJobInfo(jobId);
```

### 3. Integration with Resume Creation

The job information is automatically saved when users fill out the JobForm during resume creation. The job ID is stored in sessionStorage and can be referenced in the resume creation process.

## Components

### JobForm
- Collects job information from users
- Saves to Firebase via API
- Stores job ID in sessionStorage for resume creation

### JobInfoList
- Displays all job information for a user
- Provides view, edit, and delete functionality
- Modal-based editing interface

### JobInfoService
- Handles all API calls to the job information endpoints
- Manages authentication tokens
- Provides error handling

## Security

- All endpoints require Firebase authentication
- Users can only access their own job information
- Input validation on both client and server side
- Proper error handling and user feedback

## Data Validation

The system validates:
- Required fields (title, company)
- Data type conversion (strings to arrays for requirements, responsibilities, skills)
- User ownership verification
- Input sanitization

## Error Handling

Common error scenarios:
- Authentication failures
- Invalid job information data
- Network connectivity issues
- Permission denied (accessing other users' data)

All errors are properly caught and displayed to users with meaningful messages.

## Future Enhancements

Potential improvements:
- Job information templates
- Bulk import/export functionality
- Job information sharing between users
- Integration with job boards
- Advanced search and filtering
- Job application tracking 