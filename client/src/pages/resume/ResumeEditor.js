import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Alert, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import html2pdf from 'html2pdf.js';
import { FaDownload, FaSave, FaEdit, FaRobot } from 'react-icons/fa';
import './ResumeEditor.css';
import ResumeStepper from '../../components/ResumeStepper';

// Add Quill align style if not already present
const Align = Quill.import('formats/align');
Quill.register(Align, true);

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    [
      { 'bold': true, title: 'Bold' },
      { 'italic': true, title: 'Italic' },
      { 'underline': true, title: 'Underline' },
      { 'strike': true, title: 'Strikethrough' }
    ],
    [
      { 'align': '', title: 'Left Align' },
      { 'align': 'center', title: 'Center Align' },
      { 'align': 'right', title: 'Right Align' }
    ],
    [{ 'list': 'ordered', title: 'Numbered List' }, { 'list': 'bullet', title: 'Bullet List' }],
    [{ 'link': true, title: 'Insert Link' }, { 'image': true, title: 'Insert Image' }],
    [{ 'clean': true, title: 'Remove Formatting' }]
  ]
};

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
        console.log('Fetched resume data:', resumeData);
        if (resumeData.userId !== currentUser.uid) {
          throw new Error('Unauthorized access');
        }

        setResume(resumeData);
        // Fetch template structure by templateId
        if (resumeData.templateId) {
          const templateDoc = await getDoc(doc(db, 'templates', resumeData.templateId));
          const templateData = templateDoc.exists() ? templateDoc.data() : null;
          console.log('Fetched template data:', templateData);
          // If content is empty, generate it from job/profile/template
          if (!resumeData.content || resumeData.content.trim() === '') {
            const generatedContent = formatResumeContent(resumeData, templateData);
            setContent(generatedContent);
          } else {
            setContent(resumeData.content);
          }
        } else {
          // fallback if no templateId
          if (!resumeData.content || resumeData.content.trim() === '') {
            setContent(formatResumeContent(resumeData, null));
          } else {
            setContent(resumeData.content);
          }
        }
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

  // Helper to format resume content based on template structure
  function formatResumeContent(resumeData, templateData) {
    const { jobDescription, personalInfo, education, experience, skills } = resumeData;
    let sections = [
      { name: 'contact', render: () => `<h1>${personalInfo?.fullName || ''}</h1><p><strong>Email:</strong> ${personalInfo?.email || ''} | <strong>Phone:</strong> ${personalInfo?.phone || ''} | <strong>Location:</strong> ${personalInfo?.location || ''}</p>` },
      { name: 'summary', render: () => `<h2>Professional Summary</h2><p>${personalInfo?.summary || ''}</p>` },
      { name: 'skills', render: () => `<h2>Skills</h2><ul><li><strong>Technical:</strong> ${skills?.technical || ''}</li><li><strong>Soft:</strong> ${skills?.soft || ''}</li><li><strong>Languages:</strong> ${skills?.languages || ''}</li><li><strong>Certifications:</strong> ${skills?.certifications || ''}</li></ul>` },
      { name: 'experience', render: () => `<h2>Experience</h2><ul>${(experience || []).map(exp => `<li><strong>${exp.position}</strong> at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})<br/>${exp.description || ''}</li>`).join('')}</ul>` },
      { name: 'education', render: () => `<h2>Education</h2><ul>${(education || []).map(edu => `<li><strong>${edu.degree}</strong> in ${edu.field} from ${edu.school} (${edu.startDate} - ${edu.endDate})</li>`).join('')}</ul>` },
      { name: 'job', render: () => `<h2>Job Target</h2><p><strong>${jobDescription?.title || ''}</strong> at <strong>${jobDescription?.company || ''}</strong></p>` }
    ];
    // Use template's defaultOrder if available
    let order = templateData?.defaultOrder || ['contact','summary','job','experience','education','skills'];
    // Render sections in order
    return order.map(sectionName => {
      const section = sections.find(s => s.name === sectionName);
      return section ? section.render() : '';
    }).join('');
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Container fluid className="editor-no-bg px-0">
      <div className="d-flex justify-content-end p-3">
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
      <ResumeStepper currentStep={4} />
      <Row className="g-4 justify-content-center align-items-stretch editor-row-flex">
        {/* Editor Panel */}
        <Col md={7} className="d-flex">
          <Card className="editor-modern-card flex-grow-1">
            <div className="editor-modern-header d-flex align-items-center mb-3">
              <FaEdit className="me-2 text-primary" size={22} />
              <h4 className="mb-0">Resume Editor</h4>
            </div>
            <div className="editor-modern-quill">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                style={{ height: 'calc(60vh - 60px)' }}
                modules={quillModules}
              />
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/profile-form')}
              >
                Back
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleSave}
                disabled={saving}
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
          </Card>
        </Col>
        {/* AI Assistant Panel */}
        <Col md={5} className="d-flex">
          <Card className="ai-modern-card flex-grow-1">
            <div className="ai-modern-header d-flex align-items-center mb-3">
              <FaRobot className="me-2 text-primary" size={22} />
              <h4 className="mb-0">AI Assistant</h4>
            </div>
            <div className="ai-modern-body d-flex flex-column flex-grow-1">
              <div className="ai-modern-chat-messages flex-grow-1 mb-3">
                {aiMessage && (
                  <div className="ai-chat-bubble ai-chat-bubble-ai mb-2">
                    <span className="fw-bold">AI:</span> {aiMessage}
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
                    className="ai-modern-input"
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" variant="primary" disabled={!userMessage.trim()}>
                    Send
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
      {error && <Alert variant="danger" className="mt-3 text-center w-75 mx-auto">{error}</Alert>}
    </Container>
  );
}

export default ResumeEditor; 