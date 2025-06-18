import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeFirebase } from './config/firebase.js';
import errorHandler from './middleware/errorHandler.js';

// Initialize Firebase Admin
initializeFirebase();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';
import jobInfoRoutes from './routes/jobInfo.js';
import profileInfoRoutes from './routes/profileInfo.js';

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/job-info', jobInfoRoutes);
app.use('/api/profile-info', profileInfoRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 