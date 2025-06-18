import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import jobInfoService from '../../services/jobInfoService';
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

      // Save job information to Firebase using the service
      const result = await jobInfoService.createJobInfo(jobData);
      
      // Store job ID in session storage for use in ProfileForm
      sessionStorage.setItem('jobInfoId', result.id);
      sessionStorage.setItem('jobData', JSON.stringify(jobData));
      
      // Navigate to profile form
      navigate('/profile-form');
    } catch (error) {
      setError(error.message || 'Failed to save job information');
      console.error('Error saving job data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '800px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Job Details</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Software Engineer"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="company">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                required
                placeholder="e.g., Tech Corp Inc."
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
                placeholder="Paste the full job description here"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="requirements">
              <Form.Label>Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                required
                placeholder="List the job requirements"
              />
              <Form.Text className="text-muted">
                Separate each requirement with a new line
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="responsibilities">
              <Form.Label>Key Responsibilities</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="responsibilities"
                value={jobData.responsibilities}
                onChange={handleChange}
                required
                placeholder="List the key responsibilities"
              />
              <Form.Text className="text-muted">
                Separate each responsibility with a new line
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="keySkills">
              <Form.Label>Required Skills</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="keySkills"
                value={jobData.keySkills}
                onChange={handleChange}
                required
                placeholder="List the required skills"
              />
              <Form.Text className="text-muted">
                Separate skills with commas (e.g., Python, React, AWS)
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-between">
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
        </Card.Body>
      </Card>
    </div>
  );
}

export default JobForm; 