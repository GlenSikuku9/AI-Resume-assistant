import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { FaFileAlt, FaPlus } from 'react-icons/fa';

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const db = getFirestore();
        const resumesRef = collection(db, 'resumes');
        const q = query(resumesRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const resumesList = [];
        querySnapshot.forEach((doc) => {
          resumesList.push({ id: doc.id, ...doc.data() });
        });
        
        setResumes(resumesList);
      } catch (error) {
        setError('Failed to fetch resumes');
        console.error('Error fetching resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [currentUser]);

  const handleCreateNew = () => {
    navigate('/templates');
  };

  const handleEditResume = (resumeId) => {
    navigate(`/editor/${resumeId}`);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="admin-dashboard dashboard-container" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)', padding: '2.5rem 0' }}>
      <div className="d-flex justify-content-between align-items-center mb-5 px-3 px-md-5">
        <h2 className="dashboard-title" style={{ fontWeight: 700, color: '#2c3e50', letterSpacing: '0.5px' }}>My Resumes</h2>
        <Button onClick={handleCreateNew} variant="primary" style={{ borderRadius: 25, fontWeight: 600, padding: '0.6rem 2rem', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(26,115,232,0.08)' }}>
          <FaPlus className="me-2" />
          Create New Resume
        </Button>
      </div>

      {error && <Alert variant="danger" className="mx-3 mx-md-5">{error}</Alert>}

      {resumes.length === 0 ? (
        <Card className="text-center p-5 mx-3 mx-md-5 shadow-sm" style={{ borderRadius: 18, background: '#fff' }}>
          <Card.Body>
            <h4 style={{ color: '#2c3e50', fontWeight: 600 }}>No Resumes Yet</h4>
            <p style={{ color: '#6c757d' }}>Create your first resume to get started!</p>
            <Button onClick={handleCreateNew} variant="primary" style={{ borderRadius: 25, fontWeight: 600, padding: '0.6rem 2rem', fontSize: '1.1rem' }}>
              <FaPlus className="me-2" />
              Create Resume
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4 px-3 px-md-5">
          {resumes.map((resume) => (
            <Col key={resume.id}>
              <Card className="metric-card shadow-sm h-100" style={{ borderRadius: 16, background: '#fff', border: 'none', transition: 'transform 0.2s' }}>
                <Card.Body className="d-flex flex-column justify-content-between h-100">
                  <div className="d-flex align-items-center mb-3">
                    <FaFileAlt className="me-2 text-primary" size={26} />
                    <h5 className="mb-0" style={{ fontWeight: 600, color: '#2c3e50' }}>
                      {resume.jobDescription?.title || 'Untitled Resume'}
                    </h5>
                  </div>
                  <Card.Text style={{ color: '#6c757d', fontSize: '1.02rem' }}>
                    <span style={{ fontWeight: 500 }}>Created:</span> {resume.createdAt && resume.createdAt.toDate
                      ? resume.createdAt.toDate().toLocaleDateString()
                      : resume.createdAt
                        ? new Date(resume.createdAt).toLocaleDateString()
                        : 'N/A'}
                    <br />
                    <span style={{ fontWeight: 500 }}>Last Updated:</span> {resume.updatedAt && resume.updatedAt.toDate
                      ? resume.updatedAt.toDate().toLocaleDateString()
                      : resume.updatedAt
                        ? new Date(resume.updatedAt).toLocaleDateString()
                        : 'N/A'}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleEditResume(resume.id)}
                    className="w-100 mt-3"
                    style={{ borderRadius: 25, fontWeight: 600, fontSize: '1.05rem', boxShadow: '0 2px 8px rgba(26,115,232,0.08)' }}
                  >
                    Edit Resume
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Dashboard; 