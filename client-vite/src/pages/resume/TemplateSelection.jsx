import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Container,Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { FaEye } from 'react-icons/fa'; // eye icon for preview
import './TemplateSelection.css';
import resumeEditorService from '../../services/resumeEditorService';

function TemplateSelection() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');


  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const db = getFirestore();
        const templatesRef = collection(db, 'templates');
        const querySnapshot = await getDocs(templatesRef);
        
        const templatesList = [];
        querySnapshot.forEach((doc) => {
          templatesList.push({ id: doc.id, ...doc.data() });
        });
        setTemplates(templatesList);
      } catch (error) {
        setError('Failed to fetch templates');
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleContinue = async () => {
    if (selectedTemplate) {
      try {
        await resumeEditorService.incrementTemplateUsage(selectedTemplate.id);
      } catch (e) {
        console.warn('Failed to increment template usage:', e);
      }
      sessionStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
      navigate('/job-form');
    }
  };
  const handleViewImage = (imageUrl) => {
  setModalImage(imageUrl);
  setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  if (loading) {
    return (
      <div className="template-selection-container d-flex justify-content-center align-items-center">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="template-selection-container">
      <Container>
        <div className="template-selection-header">
          <h2>Choose Your Resume Template</h2>
          <p>Select a professional template that best represents your career goals and industry</p>
        </div>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Row xs={1} md={2} lg={3} className="g-4">
          {templates.map((template) => (
            <Col key={template.id}>
              <Card
                className={`template-card ${
                  selectedTemplate?.id === template.id ? 'selected' : ''
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <Card.Img
                  variant="top"
                  src={template.previewImage}
                  alt={template.name}
                />
                <Card.Body>
                  <Card.Title>{template.name}</Card.Title>
                  <Card.Text>{template.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant={
                        selectedTemplate?.id === template.id
                          ? 'primary'
                          : 'outline-primary'
                      }
                      className="select-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateSelect(template);
                      }}
                    >
                      {selectedTemplate?.id === template.id
                        ? 'Selected'
                        : 'Select'}
                    </Button>
                    <FaEye
                        size={20}
                        className="ms-3 text-primary cursor-pointer"
                        title="View full image"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewImage(template.previewImage);
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="continue-button-container">
          <Button
            variant="primary"
            size="lg"
            className="continue-button"
            disabled={!selectedTemplate}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </Container>
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Template Preview</Modal.Title>
  </Modal.Header>
  <Modal.Body className="text-center">
    <img src={modalImage} alt="Full Preview" className="img-fluid rounded" />
  </Modal.Body>
</Modal>

    </div>
  );
}

export default TemplateSelection; 