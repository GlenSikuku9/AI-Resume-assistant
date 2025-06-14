import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import html2pdf from 'html2pdf.js';
import { FaDownload, FaSave } from 'react-icons/fa';

function ResumeEditor() {
  const [resume, setResume] = useState(null);
  const [content, setContent] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { resumeId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch resume data
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const db = getFirestore();
        const resumeDoc = await getDoc(doc(db, 'resumes', resumeId));
        
        if (!resumeDoc.exists()) {
          throw new Error('Resume not found');
        }

        const resumeData = resumeDoc.data();
        if (resumeData.userId !== currentUser.uid) {
          throw new Error('Unauthorized access');
        }

        setResume(resumeData);
        setContent(resumeData.content || '');
      } catch (error) {
        setError(error.message);
        console.error('Error fetching resume:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, currentUser]);

  // Save resume content
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const db = getFirestore();
      const resumeRef = doc(db, 'resumes', resumeId);
      
      const version = {
        content,
        timestamp: new Date().toISOString(),
        userId: currentUser.uid
      };

      await updateDoc(resumeRef, {
        content,
        versions: [...(resume.versions || []), version],
        updatedAt: new Date().toISOString()
      });

      setResume(prev => ({
        ...prev,
        content,
        versions: [...(prev.versions || []), version]
      }));
    } catch (error) {
      setError('Failed to save resume');
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  // Export as PDF
  const handleExport = () => {
    const element = document.createElement('div');
    element.innerHTML = content;
    
    const opt = {
      margin: 1,
      filename: `${resume.jobDescription?.title || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  // Handle AI chat
  const handleAiChat = async () => {
    try {
      setError('');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ai/edit-section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          section: 'full',
          content,
          instruction: userMessage
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      setAiMessage(data.text);
      setUserMessage('');
    } catch (error) {
      setError('Failed to get AI response');
      console.error('AI chat error:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Container fluid>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2>{resume.jobDescription?.title || 'Untitled Resume'}</h2>
        <div>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="me-2"
          >
            <FaSave className="me-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="success"
            onClick={handleExport}
          >
            <FaDownload className="me-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Row>
        {/* Resume Editor */}
        <Col md={8}>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            style={{ height: 'calc(100vh - 200px)' }}
          />
        </Col>

        {/* AI Chat Panel */}
        <Col md={4}>
          <div className="border rounded p-3" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <h4>AI Assistant</h4>
            <div 
              className="flex-grow-1 overflow-auto mb-3 p-2 border rounded"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              {aiMessage && (
                <div className="mb-2">
                  <strong>AI:</strong>
                  <p>{aiMessage}</p>
                </div>
              )}
            </div>
            
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleAiChat();
            }}>
              <Form.Group className="mb-2">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Ask the AI to help improve your resume..."
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={!userMessage.trim()}
              >
                Send
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ResumeEditor; 