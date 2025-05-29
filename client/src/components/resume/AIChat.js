import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Card } from 'react-bootstrap';

const AIChat = ({ resumeId, onUpdateSection }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const response = await axios.post('/api/ai/edit-section', {
        resumeId,
        instruction: userMessage,
        section: 'current', // This should be dynamically set based on selected section
      });

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: response.data.content,
        suggestions: response.data.suggestions 
      }]);

      if (response.data.content) {
        onUpdateSection(response.data.content);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-panel">
      <div className="chat-messages" style={{ height: '400px', overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <Card 
            key={index} 
            className={`mb-2 ${message.type === 'user' ? 'ms-auto' : 'me-auto'}`}
            style={{ maxWidth: '80%' }}
          >
            <Card.Body className={message.type === 'error' ? 'text-danger' : ''}>
              {message.content}
              {message.suggestions && (
                <div className="mt-2">
                  <strong>Suggested Keywords:</strong>
                  <ul className="mb-0">
                    {message.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
        <div ref={chatEndRef} />
      </div>

      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for improvements or suggestions..."
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="primary" 
            className="ms-2"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Send'}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default AIChat; 