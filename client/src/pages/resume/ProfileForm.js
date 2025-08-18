import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import { FaPlus, FaTrash } from 'react-icons/fa';
import jobSeekerInfoService from '../../services/profileInfoService';
import ResumeStepper from '../../components/resume/ResumeStepper';
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
    grade: '',
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
      grade: '',
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

      if (!currentUser) {
        throw new Error('You must be logged in to create a resume');
      }

      const auth = getAuth();
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('You must be logged in to create a resume');
      }

      const jobData = JSON.parse(sessionStorage.getItem('jobData') || '{}');
      const selectedTemplate = JSON.parse(sessionStorage.getItem('selectedTemplate') || '{}');

      // Prepare the payload for the AI endpoint
      const payload = {
        userId: currentUser.uid,
        jobDescription: jobData,
        personalInfo: {
          ...personalInfo,
          education,
          experience,
          skills
        },
        templateId: selectedTemplate.id || null
      };

      // Call the AI backend to generate and save the resume
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate resume');
      }

      const result = await response.json();

      // Clear session storage
      sessionStorage.removeItem('jobData');
      sessionStorage.removeItem('jobInfoId');

      // Redirect to ResumeEditor with the new resume ID
      navigate(`/editor/${result.id}`);
    } catch (error) {
      setError(error.message || 'Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-form-container">
      <ResumeStepper currentStep={3} />
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
                  <Form.Label>LinkedIn Profile (Optional)</Form.Label>
                  <Form.Control
                    type="url"
                    name="linkedin"
                    value={personalInfo.linkedin}
                    onChange={handlePersonalInfoChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                  <Form.Text className="text-muted">
                    Add your LinkedIn profile to showcase your professional network
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Portfolio Website (Optional)</Form.Label>
                  <Form.Control
                    type="url"
                    name="portfolio"
                    value={personalInfo.portfolio}
                    onChange={handlePersonalInfoChange}
                    placeholder="https://..."
                  />
                  <Form.Text className="text-muted">
                    Add your portfolio, GitHub, or personal website
                  </Form.Text>
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
            <h3>Work Experience (Optional)</h3>
            <p className="text-muted mb-3">
              If you're a student or recent graduate, you can include internships, part-time jobs, or leave this section empty.
            </p>
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
                      <Form.Label>Company/Organization</Form.Label>
                      <Form.Control
                        type="text"
                        name="company"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, e)}
                        placeholder="Company name or organization"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Position/Role</Form.Label>
                      <Form.Control
                        type="text"
                        name="position"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, e)}
                        placeholder="Job title or role"
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
                        placeholder="City, State or Remote"
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
                      <Form.Label>School/University</Form.Label>
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
                      <Form.Label>Grade (Optional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="grade"
                        value={edu.grade}
                        onChange={(e) => handleEducationChange(index, e)}
                        placeholder="e.g., A, B, First Class"
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
                  <Form.Label>Languages (Optional)</Form.Label>
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
                  <Form.Label>Certifications (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="certifications"
                    value={skills.certifications}
                    onChange={handleSkillsChange}
                    placeholder="AWS Certified, PMP, etc..."
                  />
                  <Form.Text className="text-muted">
                    Include any relevant certifications or professional qualifications
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <div className="profile-form-actions">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Create Resume'}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default ProfileForm; 