import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus, FaGraduationCap, FaBriefcase, FaUser } from 'react-icons/fa';
import jobSeekerInfoService from '../services/profileInfoService';
import './ProfileInfoList.css';

function ProfileInfoList() {
  const [jobSeekerInfoList, setJobSeekerInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // view,edit
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: {
      technical: '',
      soft: '',
      languages: '',
      certifications: ''
    }
  });

  useEffect(() => {
    fetchJobSeekerInfoList();
  }, []);

  const fetchJobSeekerInfoList = async () => {
    try {
      setLoading(true);
      const data = await jobSeekerInfoService.getJobSeekerInfoList();
      setJobSeekerInfoList(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditProfile = (profile) => {
    setSelectedProfile(profile);
    setModalMode('edit');
    setFormData({
      personalInfo: { ...profile.personalInfo },
      education: [...profile.education],
      experience: [...profile.experience],
      skills: { ...profile.skills }
    });
    setShowModal(true);
  };

  const handleDeleteProfile = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this job seeker information?')) {
      try {
        await jobSeekerInfoService.deleteJobSeekerInfo(profileId);
        await fetchJobSeekerInfoList();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = formData.education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [name]: value };
      }
      return edu;
    });
    setFormData(prev => ({ ...prev, education: updatedEducation }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedExperience = formData.experience.map((exp, i) => {
      if (i === index) {
        const newValue = type === 'checkbox' ? checked : value;
        return { ...exp, [name]: newValue };
      }
      return exp;
    });
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
  };

  const handleSkillsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [name]: value
      }
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        achievements: ''
      }]
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      await jobSeekerInfoService.updateJobSeekerInfo(selectedProfile.id, formData);
      setShowModal(false);
      await fetchJobSeekerInfoList();
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="profile-info-list">
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Job Seeker Information</h2>
        <Badge bg="primary">{jobSeekerInfoList.length} profile{jobSeekerInfoList.length !== 1 ? 's' : ''}</Badge>
      </div>

      {jobSeekerInfoList.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h5>No job seeker information saved yet</h5>
            <p className="text-muted">Start by creating a new resume to save your profile information.</p>
          </Card.Body>
        </Card>
      ) : (
        <div className="row">
          {jobSeekerInfoList.map((profile) => (
            <div key={profile.id} className="col-md-6 col-lg-4 mb-3">
              <Card className="profile-info-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">{profile.personalInfo.fullName}</h6>
                    <div className="btn-group btn-group-sm">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewProfile(profile)}
                        title="View Details"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleEditProfile(profile)}
                        title="Edit"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteProfile(profile.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted mb-2">{profile.personalInfo.email}</p>
                  <p className="text-muted mb-2">{profile.personalInfo.location}</p>
                  <p className="card-text small text-truncate">
                    {profile.personalInfo.summary || 'No summary available'}
                  </p>
                  <div className="mt-auto">
                    <small className="text-muted">
                      Created: {formatDate(profile.createdAt)}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing/editing job seeker information */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'view' ? 'Job Seeker Information Details' : 'Edit Job Seeker Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === 'view' && selectedProfile ? (
            <div>
              <h5>{selectedProfile.personalInfo.fullName}</h5>
              <p className="text-muted">{selectedProfile.personalInfo.email}</p>
              
              {selectedProfile.personalInfo.summary && (
                <div className="mb-3">
                  <h6>Summary</h6>
                  <p>{selectedProfile.personalInfo.summary}</p>
                </div>
              )}

              {selectedProfile.education && selectedProfile.education.length > 0 && (
                <div className="mb-3">
                  <h6>Education</h6>
                  {selectedProfile.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <strong>{edu.school}</strong> - {edu.degree} in {edu.field}
                      <br />
                      <small className="text-muted">
                        {edu.startDate} - {edu.endDate || 'Present'}
                        {edu.grade && ` | Grade: ${edu.grade}`}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {selectedProfile.experience && selectedProfile.experience.length > 0 && (
                <div className="mb-3">
                  <h6>Experience</h6>
                  {selectedProfile.experience.map((exp, index) => (
                    <div key={index} className="mb-2">
                      <strong>{exp.position}</strong> at {exp.company}
                      <br />
                      <small className="text-muted">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </small>
                      {exp.description && (
                        <p className="small mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedProfile.skills && (
                <div className="mb-3">
                  <h6>Skills</h6>
                  {selectedProfile.skills.technical && (
                    <div>
                      <strong>Technical:</strong> {selectedProfile.skills.technical}
                    </div>
                  )}
                  {selectedProfile.skills.soft && (
                    <div>
                      <strong>Soft Skills:</strong> {selectedProfile.skills.soft}
                    </div>
                  )}
                  {selectedProfile.skills.languages && (
                    <div>
                      <strong>Languages:</strong> {selectedProfile.skills.languages}
                    </div>
                  )}
                  {selectedProfile.skills.certifications && (
                    <div>
                      <strong>Certifications:</strong> {selectedProfile.skills.certifications}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Form>
              <h6>Personal Information</h6>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.personalInfo.fullName}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.personalInfo.location}
                      onChange={handlePersonalInfoChange}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn</Form.Label>
                    <Form.Control
                      type="url"
                      name="linkedin"
                      value={formData.personalInfo.linkedin}
                      onChange={handlePersonalInfoChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Portfolio</Form.Label>
                    <Form.Control
                      type="url"
                      name="portfolio"
                      value={formData.personalInfo.portfolio}
                      onChange={handlePersonalInfoChange}
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Professional Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="summary"
                  value={formData.personalInfo.summary}
                  onChange={handlePersonalInfoChange}
                />
              </Form.Group>

              <h6>Skills</h6>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Technical Skills</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="technical"
                      value={formData.skills.technical}
                      onChange={handleSkillsChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Soft Skills</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="soft"
                      value={formData.skills.soft}
                      onChange={handleSkillsChange}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Languages</Form.Label>
                    <Form.Control
                      type="text"
                      name="languages"
                      value={formData.skills.languages}
                      onChange={handleSkillsChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Certifications</Form.Label>
                    <Form.Control
                      type="text"
                      name="certifications"
                      value={formData.skills.certifications}
                      onChange={handleSkillsChange}
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {modalMode === 'edit' && (
            <Button variant="primary" onClick={handleUpdateProfile}>
              Update
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfileInfoList; 