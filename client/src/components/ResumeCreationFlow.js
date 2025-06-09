import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper
} from '@mui/material';
import axios from 'axios';

// Import step components
import JobDescriptionForm from './JobDescriptionForm';
import UserInfoForm from './UserInfoForm';
import ResumePreview from './ResumePreview';

const steps = ['Select Template', 'Add Job Description', 'Add Your Information', 'Review & Edit'];

const ResumeCreationFlow = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1); // Start at 1 since template is already selected
  const [template, setTemplate] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const response = await axios.get(`/api/templates/${templateId}`);
      setTemplate(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load template');
      setLoading(false);
    }
  };

  const handleJobDescriptionSubmit = async (data) => {
    setJobDescription(data);
    setActiveStep(2);
  };

  const handleUserInfoSubmit = async (data) => {
    setUserInfo(data);
    try {
      // Create initial resume with AI-generated content
      const response = await axios.post('/api/templates/create-resume', {
        templateId,
        jobDescriptionId: jobDescription.id,
        userInfoId: data.id
      });
      setResume(response.data);
      setActiveStep(3);
    } catch (err) {
      setError('Failed to create resume');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <JobDescriptionForm
            onSubmit={handleJobDescriptionSubmit}
            onBack={() => navigate('/templates')}
          />
        );
      case 2:
        return (
          <UserInfoForm
            onSubmit={handleUserInfoSubmit}
            onBack={handleBack}
            template={template}
          />
        );
      case 3:
        return (
          <ResumePreview
            resume={resume}
            template={template}
            jobDescription={jobDescription}
            onBack={handleBack}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Box sx={{ mt: 4 }}>
        {getStepContent(activeStep)}
      </Box>
    </Container>
  );
};

export default ResumeCreationFlow; 