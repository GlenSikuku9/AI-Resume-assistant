import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import jobDescriptionService from '../../services/jobInfoService';
import ResumeStepper from '../../components/resume/ResumeStepper';
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

      // Save job description to Firebase using the service
      const result = await jobDescriptionService.createJobDescription(jobData);
      
      // Store job ID in session storage for use in ProfileForm
      sessionStorage.setItem('jobInfoId', result.id);
      sessionStorage.setItem('jobData', JSON.stringify(jobData));
      
      // Navigate to profile form
      navigate('/profile-form');
    } catch (error) {
      setError(error.message || 'Failed to save job description');
      console.error('Error saving job data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-form-container">
      <ResumeStepper currentStep={2} />
      <Container>
        <div className="job-form-header">
          <h2>Job Description</h2>
          <p>Enter the details of the job you are targeting. This helps us tailor your resume for the role.</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Card className="job-form-section">
            <h3>Basic Information</h3>
            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>
          </Card>

          <Card className="job-form-section">
            <h3>Job Description</h3>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Full Description</Form.Label>
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
          </Card>

          <Card className="job-form-section">
            <h3>Requirements & Responsibilities</h3>
            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>
          </Card>

          <Card className="job-form-section">
            <h3>Required Skills</h3>
            <Form.Group className="mb-3" controlId="keySkills">
              <Form.Label>Skills & Qualifications</Form.Label>
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
          </Card>

          <div className="job-form-actions">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default JobForm; 