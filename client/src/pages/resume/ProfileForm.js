import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './ProfileForm.css';

function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    summary: ''
  });

  const [education, setEducation] = useState([{
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
    achievements: ''
  }]);

  const [experience, setExperience] = useState([{
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  }]);

  const [skills, setSkills] = useState({
    technical: '',
    soft: '',
    languages: '',
    certifications: ''
  });

  useEffect(() => {
    // Check if previous steps are completed
    const templateData = sessionStorage.getItem('selectedTemplate');
    const jobData = sessionStorage.getItem('jobData');
    
    if (!templateData || !jobData) {
      navigate('/templates');
    }
  }, [navigate]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [name]: value };
      }
      return edu;
    });
    setEducation(updatedEducation);
  };

  const handleExperienceChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedExperience = experience.map((exp, i) => {
      if (i === index) {
        const newValue = type === 'checkbox' ? checked : value;
        return { ...exp, [name]: newValue };
      }
      return exp;
    });
    setExperience(updatedExperience);
  };

  const handleSkillsChange = (e) => {
    const { name, value } = e.target;
    setSkills(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addEducation = () => {
    setEducation(prev => [...prev, {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: ''
    }]);
  };

  const removeEducation = (index) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperience(prev => [...prev, {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
  };

  const removeExperience = (index) => {
    setExperience(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);

      const templateData = JSON.parse(sessionStorage.getItem('selectedTemplate'));
      const jobData = JSON.parse(sessionStorage.getItem('jobData'));

      const db = getFirestore();
      const resumeRef = await addDoc(collection(db, 'resumes'), {
        userId: currentUser.uid,
        templateId: templateData.id,
        jobDescription: jobData,
        personalInfo,
        education,
        experience,
        skills,
        content: '',
        versions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Clear session storage
      sessionStorage.removeItem('selectedTemplate');
      sessionStorage.removeItem('jobData');

      // Navigate to editor
      navigate(`/editor/${resumeRef.id}`);
    } catch (error) {
      setError('Failed to create resume');
      console.error('Error creating resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-form-container">
      <Container>
        <div className="profile-form-header">
          <h2>Your Profile</h2>
          <p>Fill in your professional details to create a compelling resume</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <Card className="profile-form-section">
            <h3>Personal Information</h3>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={personalInfo.location}
                    onChange={handlePersonalInfoChange}
                    required
                    placeholder="City, State"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn Profile</Form.Label>
                  <Form.Control
                    type="url"
                    name="linkedin"
                    value={personalInfo.linkedin}
                    onChange={handlePersonalInfoChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Portfolio Website</Form.Label>
                  <Form.Control
                    type="url"
                    name="portfolio"
                    value={personalInfo.portfolio}
                    onChange={handlePersonalInfoChange}
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Professional Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="summary"
                value={personalInfo.summary}
                onChange={handlePersonalInfoChange}
                required
                placeholder="Brief overview of your professional background and career objectives..."
              />
            </Form.Group>
          </Card>

          {/* Experience Section */}
          <Card className="profile-form-section">
            <h3>Work Experience</h3>
            {experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Experience #{index + 1}</h5>
                  {experience.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        type="text"
                        name="company"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Position</Form.Label>
                      <Form.Control
                        type="text"
                        name="position"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="month"
                        name="startDate"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="month"
                        name="endDate"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, e)}
                        disabled={exp.current}
                        required={!exp.current}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Current Position"
                        name="current"
                        checked={exp.current}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="mt-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                    placeholder="Describe your responsibilities and achievements..."
                  />
                  <Form.Text className="text-muted">
                    Use bullet points and action verbs to describe your achievements
                  </Form.Text>
                </Form.Group>
              </div>
            ))}
            <Button
              variant="primary"
              className="add-item-button"
              onClick={addExperience}
            >
              <FaPlus /> Add Experience
            </Button>
          </Card>

          {/* Education Section */}
          <Card className="profile-form-section">
            <h3>Education</h3>
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Education #{index + 1}</h5>
                  {education.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>School</Form.Label>
                      <Form.Control
                        type="text"
                        name="school"
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Degree</Form.Label>
                      <Form.Control
                        type="text"
                        name="degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Field of Study</Form.Label>
                      <Form.Control
                        type="text"
                        name="field"
                        value={edu.field}
                        onChange={(e) => handleEducationChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="month"
                        name="startDate"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="month"
                        name="endDate"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, e)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>GPA (Optional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="gpa"
                        value={edu.gpa}
                        onChange={(e) => handleEducationChange(index, e)}
                        placeholder="e.g., 3.8/4.0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Achievements/Activities</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="achievements"
                        value={edu.achievements}
                        onChange={(e) => handleEducationChange(index, e)}
                        placeholder="Honors, awards, relevant coursework..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
            <Button
              variant="primary"
              className="add-item-button"
              onClick={addEducation}
            >
              <FaPlus /> Add Education
            </Button>
          </Card>

          {/* Skills Section */}
          <Card className="profile-form-section">
            <h3>Skills</h3>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Technical Skills</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="technical"
                    value={skills.technical}
                    onChange={handleSkillsChange}
                    required
                    placeholder="Programming languages, tools, frameworks..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Soft Skills</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="soft"
                    value={skills.soft}
                    onChange={handleSkillsChange}
                    required
                    placeholder="Leadership, communication, problem-solving..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Languages</Form.Label>
                  <Form.Control
                    type="text"
                    name="languages"
                    value={skills.languages}
                    onChange={handleSkillsChange}
                    placeholder="English (Native), Spanish (Fluent)..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Certifications</Form.Label>
                  <Form.Control
                    type="text"
                    name="certifications"
                    value={skills.certifications}
                    onChange={handleSkillsChange}
                    placeholder="AWS Certified, PMP, etc..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <div className="profile-form-actions">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/job-form')}
            >
              Back
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Create Resume'}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default ProfileForm; 