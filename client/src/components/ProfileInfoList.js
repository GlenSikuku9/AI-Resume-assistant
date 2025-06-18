import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus, FaGraduationCap, FaBriefcase, FaUser } from 'react-icons/fa';
import profileInfoService from '../services/profileInfoService';
import './ProfileInfoList.css';

function ProfileInfoList() {
  const [profileInfoList, setProfileInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit'
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
    fetchProfileInfoList();
  }, []);

  const fetchProfileInfoList = async () => {
    try {
      setLoading(true);
      const data = await profileInfoService.getProfileInfoList();
      setProfileInfoList(data);
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
    if (window.confirm('Are you sure you want to delete this profile information?')) {
      try {
        await profileInfoService.deleteProfileInfo(profileId);
        await fetchProfileInfoList();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleFormChange = (section, field, value, index = null) => {
    if (index !== null) {
      // Handle array fields (education, experience)
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else if (section === 'personalInfo' || section === 'skills') {
      // Handle object fields
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    }
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
      await profileInfoService.updateProfileInfo(selectedProfile.id, formData);
      setShowModal(false);
      await fetchProfileInfoList();
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
        <h2>My Profile Information</h2>
        <Badge bg="primary">{profileInfoList.length} profile{profileInfoList.length !== 1 ? 's' : ''}</Badge>
      </div>

      {profileInfoList.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h5>No profile information saved yet</h5>
            <p className="text-muted">Start by creating a new resume to save profile information.</p>
          </Card.Body>
        </Card>
      ) : (
        <div className="row">
          {profileInfoList.map((profile) => (
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

      {/* Modal for viewing/editing profile information */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'view' ? 'Profile Information Details' : 'Edit Profile Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === 'view' && selectedProfile ? (
            <div>
              <h5>{selectedProfile.personalInfo.fullName}</h5>
              <p className="text-muted">{selectedProfile.personalInfo.email}</p>
              
              {selectedProfile.personalInfo.summary && (
                <div className="mb-3">
                  <h6><FaUser /> Summary</h6>
                  <p>{selectedProfile.personalInfo.summary}</p>
                </div>
              )}

              {selectedProfile.experience && selectedProfile.experience.length > 0 && (
                <div className="mb-3">
                  <h6><FaBriefcase /> Experience</h6>
                  {selectedProfile.experience.map((exp, index) => (
                    <div key={index} className="mb-2">
                      <strong>{exp.position}</strong> at {exp.company}
                      <br />
                      <small className="text-muted">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {selectedProfile.education && selectedProfile.education.length > 0 && (
                <div className="mb-3">
                  <h6><FaGraduationCap /> Education</h6>
                  {selectedProfile.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <strong>{edu.degree}</strong> in {edu.field}
                      <br />
                      <small className="text-muted">{edu.school}</small>
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
                </div>
              )}
            </div>
          ) : (
            <Form>
              <h6>Personal Information</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.personalInfo.fullName}
                      onChange={(e) => handleFormChange('personalInfo', 'fullName', e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => handleFormChange('personalInfo', 'email', e.target.value)}
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
                      value={formData.personalInfo.phone}
                      onChange={(e) => handleFormChange('personalInfo', 'phone', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.personalInfo.location}
                      onChange={(e) => handleFormChange('personalInfo', 'location', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.personalInfo.summary}
                  onChange={(e) => handleFormChange('personalInfo', 'summary', e.target.value)}
                />
              </Form.Group>

              <h6>Experience</h6>
              {formData.experience.map((exp, index) => (
                <div key={index} className="border p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6>Experience #{index + 1}</h6>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleFormChange('experience', 'company', e.target.value, index)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Position</Form.Label>
                        <Form.Control
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleFormChange('experience', 'position', e.target.value, index)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={exp.description}
                      onChange={(e) => handleFormChange('experience', 'description', e.target.value, index)}
                    />
                  </Form.Group>
                </div>
              ))}
              <Button variant="outline-primary" size="sm" onClick={addExperience} className="mb-3">
                <FaPlus /> Add Experience
              </Button>

              <h6>Education</h6>
              {formData.education.map((edu, index) => (
                <div key={index} className="border p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6>Education #{index + 1}</h6>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>School</Form.Label>
                        <Form.Control
                          type="text"
                          value={edu.school}
                          onChange={(e) => handleFormChange('education', 'school', e.target.value, index)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Degree</Form.Label>
                        <Form.Control
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleFormChange('education', 'degree', e.target.value, index)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              ))}
              <Button variant="outline-primary" size="sm" onClick={addEducation} className="mb-3">
                <FaPlus /> Add Education
              </Button>

              <h6>Skills</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Technical Skills</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.skills.technical}
                      onChange={(e) => handleFormChange('skills', 'technical', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Soft Skills</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.skills.soft}
                      onChange={(e) => handleFormChange('skills', 'soft', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
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