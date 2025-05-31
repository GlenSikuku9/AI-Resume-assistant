import React, { useState, useEffect } from 'react';
import { Card, Badge, Spinner } from 'react-bootstrap';
import { FaLightbulb, FaTags } from 'react-icons/fa';
import axios from 'axios';

const KeywordSuggestions = ({ jobDescription, section }) => {
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      if (!jobDescription) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.post('/api/ai/keywords', {
          jobDescription,
          section
        });
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        
        setKeywords(response.data.keywords || []);
      } catch (err) {
        setError('Failed to fetch keyword suggestions');
        console.error('Error fetching keywords:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, [jobDescription, section]);

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" size="sm" />
          <span className="ms-2">Analyzing job description...</span>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm border-danger">
        <Card.Body className="text-danger d-flex align-items-center">
          <FaLightbulb className="me-2" />
          {error}
        </Card.Body>
      </Card>
    );
  }

  if (!keywords.length) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white py-3">
        <div className="d-flex align-items-center">
          <FaTags className="me-2 text-primary" size={20} />
          <h5 className="mb-0">Suggested Keywords</h5>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="d-flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge
              key={index}
              bg="light"
              text="dark"
              className="py-2 px-3 border"
              style={{ fontSize: '0.9em' }}
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default KeywordSuggestions; 