import React, { useState, useEffect } from 'react';
import { Card, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';

const KeywordSuggestions = ({ jobDescription, section }) => {
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      if (!jobDescription || !section) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.post('/api/ai/keywords', {
          jobDescription,
          section
        });
        
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
      <div className="text-center p-3">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-danger">
        <Card.Body className="text-danger">
          {error}
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h6 className="mb-0">Suggested Keywords for {section}</h6>
      </Card.Header>
      <Card.Body>
        {keywords.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge 
                key={index} 
                bg="primary" 
                className="p-2"
                style={{ cursor: 'pointer' }}
                title="Click to copy"
                onClick={() => navigator.clipboard.writeText(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted mb-0">
            No keywords available. Try updating your job description.
          </p>
        )}
      </Card.Body>
    </Card>
  );
};

export default KeywordSuggestions; 