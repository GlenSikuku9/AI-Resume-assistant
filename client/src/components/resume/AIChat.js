import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Card, Alert, InputGroup } from 'react-bootstrap';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

const AIChat = ({ resumeId, onUpdateSection }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/ai/edit-section', {
        resumeId,
        instruction: userMessage,
        section: 'current' // This will be determined by the AI based on the instruction
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: response.data.message,
        suggestions: response.data.suggestions,
        changes: response.data.changes
      }]);

      if (response.data.updatedContent) {
        onUpdateSection(response.data.updatedContent);
      }
    } catch (error) {
      setError(error.message || 'Failed to process your request');
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: error.message || 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white py-3">
        <div className="d-flex align-items-center">
          <FaRobot className="me-2 text-primary" size={20} />
          <h5 className="mb-0">AI Assistant</h5>
        </div>
      </Card.Header>
      
      <Card.Body className="p-3">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        <div className="chat-messages bg-light rounded p-3 mb-3" style={{ height: '400px', overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <Card 
              key={index} 
              className={`mb-3 border-0 shadow-sm ${
                message.type === 'user' 
                  ? 'ms-auto bg-primary text-white' 
                  : 'me-auto bg-white'
              }`}
              style={{ maxWidth: '80%' }}
            >
              <Card.Body className="p-3">
                <div className="d-flex align-items-center mb-2">
                  {message.type === 'user' ? (
                    <FaUser className="me-2" size={14} />
                  ) : (
                    <FaRobot className="me-2" size={14} />
                  )}
                  <small className="fw-bold">
                    {message.type === 'user' ? 'You' : 'AI Assistant'}
                  </small>
                </div>

                <div className="message-content">
                  {message.content}
                </div>
                
                {message.suggestions && (
                  <div className="mt-3 suggestions bg-light rounded p-2">
                    <strong className="d-block mb-2">Suggested Keywords:</strong>
                    <div className="d-flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <span 
                          key={idx}
                          className="badge bg-white text-dark border"
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {message.changes && (
                  <div className="mt-3 changes bg-light rounded p-2">
                    <strong className="d-block mb-2">Changes Made:</strong>
                    <small className="text-muted">
                      {message.changes}
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
          <div ref={chatEndRef} />
        </div>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for specific improvements (e.g., 'Strengthen my Python experience')"
              disabled={isLoading}
              className="border-end-0"
            />
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading || !input.trim()}
              className="d-flex align-items-center"
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <FaPaperPlane />
              )}
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AIChat; 