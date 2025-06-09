import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './JobForm.css';

function JobForm() {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    responsibilities: '',
    keySkills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Check if template was selected
    const selectedTemplate = sessionStorage.getItem('selectedTemplate');
    if (!selectedTemplate) {
      navigate('/templates');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);

      // Store job data in session storage
      sessionStorage.setItem('jobData', JSON.stringify(jobData));
      
      // Navigate to profile form
      navigate('/profile-form');
    } catch (error) {
      setError('Failed to save job information');
      console.error('Error saving job data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-form-container">
      <Container>
        <div className="job-form-header">
          <h2>Job Description</h2>
          <p>Enter the details of the job you're applying for to help us tailor your resume</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Card className="job-form-card">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                placeholder="e.g., Tech Company Inc."
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Paste the job description here..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Key Requirements</Form.Label>
              <Form.Control
                as="textarea"
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                placeholder="List the key requirements..."
              />
              <Form.Text className="text-muted">
                Separate requirements with commas or new lines
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Responsibilities</Form.Label>
              <Form.Control
                as="textarea"
                name="responsibilities"
                value={jobData.responsibilities}
                onChange={handleChange}
                placeholder="List the main responsibilities..."
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Key Skills</Form.Label>
              <Form.Control
                as="textarea"
                name="keySkills"
                value={jobData.keySkills}
                onChange={handleChange}
                placeholder="List the required skills..."
              />
              <Form.Text className="text-muted">
                Separate skills with commas or new lines
              </Form.Text>
            </Form.Group>

            <div className="job-form-actions">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/templates')}
              >
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default JobForm; 