import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import jobInfoService from '../services/jobInfoService';
import './JobInfoList.css';

function JobInfoList() {
  const [jobInfoList, setJobInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit'
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    responsibilities: '',
    keySkills: ''
  });

  useEffect(() => {
    fetchJobInfoList();
  }, []);

  const fetchJobInfoList = async () => {
    try {
      setLoading(true);
      const data = await jobInfoService.getJobInfoList();
      setJobInfoList(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setModalMode('edit');
    setFormData({
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements,
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : job.responsibilities,
      keySkills: Array.isArray(job.keySkills) ? job.keySkills.join(', ') : job.keySkills
    });
    setShowModal(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job information?')) {
      try {
        await jobInfoService.deleteJobInfo(jobId);
        await fetchJobInfoList();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateJob = async () => {
    try {
      await jobInfoService.updateJobInfo(selectedJob.id, formData);
      setShowModal(false);
      await fetchJobInfoList();
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
    <div className="job-info-list">
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Job Information</h2>
        <Badge bg="primary">{jobInfoList.length} job{jobInfoList.length !== 1 ? 's' : ''}</Badge>
      </div>

      {jobInfoList.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h5>No job information saved yet</h5>
            <p className="text-muted">Start by creating a new resume to save job information.</p>
          </Card.Body>
        </Card>
      ) : (
        <div className="row">
          {jobInfoList.map((job) => (
            <div key={job.id} className="col-md-6 col-lg-4 mb-3">
              <Card className="job-info-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">{job.title}</h6>
                    <div className="btn-group btn-group-sm">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewJob(job)}
                        title="View Details"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleEditJob(job)}
                        title="Edit"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted mb-2">{job.company}</p>
                  <p className="card-text small text-truncate">
                    {job.description || 'No description available'}
                  </p>
                  <div className="mt-auto">
                    <small className="text-muted">
                      Created: {formatDate(job.createdAt)}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing/editing job information */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'view' ? 'Job Information Details' : 'Edit Job Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === 'view' && selectedJob ? (
            <div>
              <h5>{selectedJob.title}</h5>
              <p className="text-muted">{selectedJob.company}</p>
              
              {selectedJob.description && (
                <div className="mb-3">
                  <h6>Description</h6>
                  <p>{selectedJob.description}</p>
                </div>
              )}

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className="mb-3">
                  <h6>Requirements</h6>
                  <ul>
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="mb-3">
                  <h6>Responsibilities</h6>
                  <ul>
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.keySkills && selectedJob.keySkills.length > 0 && (
                <div className="mb-3">
                  <h6>Key Skills</h6>
                  <div>
                    {selectedJob.keySkills.map((skill, index) => (
                      <Badge key={index} bg="secondary" className="me-1 mb-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Requirements (one per line)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleFormChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Responsibilities (one per line)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleFormChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Key Skills (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="keySkills"
                  value={formData.keySkills}
                  onChange={handleFormChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {modalMode === 'edit' && (
            <Button variant="primary" onClick={handleUpdateJob}>
              Update
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default JobInfoList; 