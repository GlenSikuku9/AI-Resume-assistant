import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Card, Alert, InputGroup } from 'react-bootstrap';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import resumeEditorService from '../../services/resumeEditorService';
import "./ResumeEditor.css";

const AIChat = ({ resumeId, currentUser, referencedHtml, setReferencedHtml, selection, setSelection, quillRef }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [chatError, setChatError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!resumeId) return;
      try {
        const messages = await resumeEditorService.fetchChatMessages(resumeId);
        console.log('AIChat loaded messages:', messages);
        setChatMessages(messages);
      } catch (err) {
        setChatError('Failed to load chat history');
        console.error('Fetch chat error:', err);
      }
    };
    fetchChats();
  }, [resumeId]);

  const handleAiChat = async () => {
    try {
      setChatError('');
      let contentToSend = referencedHtml;
      if (!contentToSend) {
        setChatError('Please highlight a section in the editor, click Reference, and then send your instruction.');
        return;
      }
      setIsLoading(true);
      const response = await resumeEditorService.editSectionAI({
        userId: currentUser.uid,
        resumeId,
        content: contentToSend,
        instruction: userMessage
      });
      setUserMessage('');
      setChatMessages(prev => ([
        ...prev,
        { role: 'user', content: userMessage, referenced: referencedHtml, timestamp: new Date().toISOString() },
        { role: 'ai', content: response.content || '', timestamp: new Date().toISOString() }
      ]));
      // Only clear referencedHtml after successful response
      setReferencedHtml('');
    } catch (error) {
      setChatError('Failed to get AI response');
      console.error('AI chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility to replace the first occurrence of referenced text in Quill with AI HTML
  const replaceReferencedInQuill = (quill, referenced, aiHtml) => {
    if (!quill || !referenced) return;
    const editorText = quill.getText();
    const index = editorText.indexOf(referenced);
    if (index !== -1) {
      quill.deleteText(index, referenced.length);
      quill.clipboard.dangerouslyPasteHTML(index, aiHtml);
    }
  };

  return (
    <Card className="ai-modern-card flex-grow-1">
      <div className="ai-modern-header d-flex align-items-center mb-3">
        <FaRobot className="me-2 text-primary" size={22} />
        <h4 className="mb-0">AI Assistant</h4>
      </div>
      <div className="ai-modern-body d-flex flex-column flex-grow-1">
        <div className="ai-modern-chat-messages flex-grow-1 mb-3">
          {chatError && (
            <Alert variant="info" className="py-1 px-2 mb-2">{chatError}</Alert>
          )}
          {chatMessages.map((msg, idx) => (
            <div key={msg.id || idx} className={`ai-chat-bubble ai-chat-bubble-${msg.role} mb-2`}>
              <span className="fw-bold">{msg.role === 'user' ? 'You' : 'AI'}:</span>
              {msg.role === 'user' && (
                <>
                  {msg.instruction && (
                    <div style={{ fontSize: '0.98em', marginBottom: 2 }}><strong>Instruction:</strong> {msg.instruction}</div>
                  )}
                  {msg.referenced && (
                    <div className="referenced-section" style={{ fontSize: '0.9em', color: '#888', marginBottom: 4 }}>
                      <span>Referenced:</span>
                      <div>{msg.referenced}</div>
                    </div>
                  )}
                </>
              )}
              {msg.role === 'ai' && (
                <>
                  <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                  <Button
                    size="sm"
                    variant="outline-success"
                    className="ms-2"
                    style={{ verticalAlign: 'middle' }}
                    disabled={!quillRef?.current}
                    onClick={() => {
                      const quill = quillRef.current.getEditor();
                      replaceReferencedInQuill(quill, msg.referenced, msg.content || '');
                    }}
                  >
                    Replace
                  </Button>
                </>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
          {referencedHtml && (
            <div className="referenced-section" style={{ fontSize: '0.9em', color: '#888', marginTop: 8, display: 'flex', alignItems: 'center' }}>
              <span>Referenced:</span>
              <div style={{ marginLeft: 6, marginRight: 6, flex: 1 }}>{referencedHtml}</div>
              <button
                style={{ background: 'transparent', border: 'none', color: '#888', fontWeight: 'bold', fontSize: '1.1em', cursor: 'pointer', padding: 0 }}
                aria-label="Clear referenced text"
                onClick={() => {
                  setReferencedHtml('');
                  // Clear selection in Quill
                  const quill = quillRef.current?.getEditor();
                  if (quill) {
                    quill.setSelection(null);
                  }
                  setSelection(null);
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
        <Form onSubmit={e => { e.preventDefault(); handleAiChat(); }}>
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              value={userMessage}
              onChange={e => setUserMessage(e.target.value)}
              placeholder="Ask the AI to help improve your resume..."
              className="ai-modern-input"
              disabled={isLoading}
            />
          </Form.Group>
          <div className="d-grid">
            <Button type="submit" variant="primary" disabled={!userMessage.trim() || isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
          <div className="resume-disclaimer" style={{ fontSize: '0.85em', color: '#ff9800', marginTop: 10, textAlign: 'center' }}>
            The AI may occasionally produce inaccurate or incomplete suggestions. Please review all content before using it in applications.
          </div>
        </Form>
      </div>
    </Card>
  );
};

export default AIChat; 