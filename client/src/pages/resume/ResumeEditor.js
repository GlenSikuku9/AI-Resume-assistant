import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form, Alert, Card, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import html2pdf from 'html2pdf.js';
import { FaDownload, FaSave, FaEdit, FaRobot } from 'react-icons/fa';
import './ResumeEditor.css';
import ResumeStepper from '../../components/ResumeStepper';
import Modal from 'react-bootstrap/Modal';
import resumeEditorService from '../../services/resumeEditorService';
import "./ResumeEditor.css";
import AIChat from './AIChat';
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { resumeId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const quillRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [referencedHtml, setReferencedHtml] = useState('');
  const [showReferenceBtn, setShowReferenceBtn] = useState(false);
  const [referenceBtnPos, setReferenceBtnPos] = useState({ top: 0, left: 0 });

  // Fetch resume data
  useEffect(() => {
    const fetchResumeAndChats = async () => {
      try {
        setLoading(true);
        setError('');
        // Fetch resume
        const resumeData = await resumeEditorService.fetchResume(resumeId);
        if (resumeData.userId !== currentUser.uid) {
          throw new Error('Unauthorized access');
        }
        setResume(resumeData);
        setContent(resumeData.content || '');
      } catch (error) {
        setError(error.message);
        console.error('Error fetching resume or chats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumeAndChats();
  }, [resumeId, currentUser]);

  // Save resume content
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const version = {
        content,
        timestamp: new Date().toISOString(),
        userId: currentUser.uid
      };
      await resumeEditorService.saveResume(resumeId, content, version, currentUser.uid);
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

  const handleSelectionChange = (range, oldRange, source) => {
    setSelection(range);
    if (range && range.length > 0) {
      const quill = quillRef.current.getEditor();
      const bounds = quill.getBounds(range.index, range.length);
      const editorRect = quill.root.getBoundingClientRect();
      setReferenceBtnPos({
        top: bounds.top + editorRect.top - 40 + window.scrollY,
        left: bounds.left + editorRect.left + window.scrollX
      });
      setShowReferenceBtn(true);
    } else {
      console.log('Quill selection cleared or collapsed:', range);
    }
  };

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
        <Col md={7} className="d-flex" style={{ position: 'relative' }}>
          <Card className="editor-modern-card flex-grow-1 d-flex flex-column position-relative">
            <div className="editor-modern-header d-flex align-items-center mb-3">
              <FaEdit className="me-2 text-primary" size={22} />
              <h4 className="mb-0">Resume Editor</h4>
            </div>
            <div className="editor-scrollable-content flex-grow-1 d-flex flex-column">
              <div className="editor-modern-quill flex-grow-1 d-flex flex-column">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  onChangeSelection={handleSelectionChange}
                  modules={quillModules}
                  style={{ height: '100%' }}
                />
              </div>
            </div>
            <div className="editor-action-buttons d-flex justify-content-end gap-2 p-3">
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
              <Button
                variant="info"
                onClick={() => setShowPreview(true)}
              >
                Preview
              </Button>
              {showReferenceBtn && (
                <Button
                  variant="warning"
                  onClick={() => {
                    const quill = quillRef.current.getEditor();
                    const range = selection;
                    if (range && range.length > 0) {
                      const selectedText = quill.getText(range.index, range.length);
                      console.log('Referenced Text:', selectedText);
                      setReferencedHtml(selectedText);
                      setShowReferenceBtn(false);
                    }
                  }}
                >
                  Reference
                </Button>
              )}
            </div>
          </Card>
        </Col>
        {/* AI Assistant Panel */}
        <Col md={5} className="d-flex">
          <AIChat
            resumeId={resumeId}
            currentUser={currentUser}
            referencedHtml={referencedHtml}
            setReferencedHtml={setReferencedHtml}
            selection={selection}
            setSelection={setSelection}
            quillRef={quillRef}
          />
        </Col>
      </Row>
      {error && <Alert variant="danger" className="mt-3 text-center w-75 mx-auto">{error}</Alert>}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Resume Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ minHeight: '60vh', background: '#fff', padding: 24 }}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleExport}>
            <FaDownload className="me-2" />
            Export PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ResumeEditor; 