import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AIChat from './AIChat';
import KeywordSuggestions from './KeywordSuggestions';
import VersionHistory from './VersionHistory';
import { FaSave, FaEdit } from 'react-icons/fa';
import './ResumeEditor.css';

function ResumeEditor() {
  const [resume, setResume] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [versions, setVersions] = useState([]);
  const { resumeId } = useParams();
  const { currentUser } = useAuth();

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
        setVersions(resumeData.versions || []);
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
        versions: [...versions, version],
        updatedAt: new Date().toISOString()
      });

      setVersions(prev => [...prev, version]);
    } catch (error) {
      setError('Failed to save resume');
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  // Handle content update from AI suggestions
  const handleAIUpdate = (updatedContent) => {
    setContent(updatedContent);
    handleSave();
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Container fluid className="py-4">
      {error && (
        <Alert variant="danger" className="mb-4 shadow-sm">
          <Alert.Heading>Error</Alert.Heading>
          <p className="mb-0">{error}</p>
        </Alert>
      )}
      
      <Row className="g-4">
        {/* Left Pane - Rich Text Editor */}
        <Col md={7}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <FaEdit className="me-2" />
                  Resume Editor
                </h4>
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  disabled={saving}
                  className="d-flex align-items-center"
                >
                  <FaSave className="me-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="editor-container border-0" style={{ height: 'calc(100vh - 280px)' }}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  style={{ height: 'calc(100% - 42px)' }}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Pane - AI Chat and Tools */}
        <Col md={5}>
          <div className="d-flex flex-column gap-4">
            {/* Keyword Suggestions */}
            <div className="keyword-suggestions-wrapper">
              <KeywordSuggestions 
                jobDescription={resume.jobDescription} 
                section="all"
              />
            </div>

            {/* AI Chat Interface */}
            <div className="ai-chat-wrapper">
              <AIChat 
                resumeId={resumeId}
                onUpdateSection={handleAIUpdate}
              />
            </div>

            {/* Version History */}
            <div className="version-history-wrapper">
              <VersionHistory 
                versions={versions}
                onRestore={setContent}
                currentVersion={versions.length - 1}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ResumeEditor; 