import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

function TemplateSelection() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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

  const handleContinue = () => {
    if (selectedTemplate) {
      // Store selected template in session storage for the resume creation flow
      sessionStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
      navigate('/job-form');
    }
  };

  if (loading) {
    return <div className="text-center">Loading templates...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Select a Template</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {templates.map((template) => (
          <Col key={template.id}>
            <Card
              className={`h-100 ${
                selectedTemplate?.id === template.id ? 'border-primary' : ''
              }`}
              onClick={() => handleTemplateSelect(template)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Img
                variant="top"
                src={template.previewUrl}
                alt={template.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{template.name}</Card.Title>
                <Card.Text>{template.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    ATS Score: {template.atsScore}/10
                  </small>
                  <Button
                    variant={
                      selectedTemplate?.id === template.id
                        ? 'primary'
                        : 'outline-primary'
                    }
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {selectedTemplate?.id === template.id
                      ? 'Selected'
                      : 'Select'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-end mt-4">
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedTemplate}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default TemplateSelection; 