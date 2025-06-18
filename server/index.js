import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeFirebase } from './config/firebase.js'; // Ensure .js extension
import { errorHandler } from './middleware/errorHandler.js';

// Import routes with .js extension and assuming they use default exports
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';

// Initialize Firebase Admin
initializeFirebase();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});