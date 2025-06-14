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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Resumes</h2>
        <Button onClick={handleCreateNew} variant="primary">
          <FaPlus className="me-2" />
          Create New Resume
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {resumes.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4>No Resumes Yet</h4>
            <p>Create your first resume to get started!</p>
            <Button onClick={handleCreateNew} variant="primary">
              <FaPlus className="me-2" />
              Create Resume
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {resumes.map((resume) => (
            <Col key={resume.id}>
              <Card>
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaFileAlt className="me-2" size={24} />
                    <h5 className="mb-0">
                      {resume.jobDescription?.title || 'Untitled Resume'}
                    </h5>
                  </div>
                  <Card.Text>
                    Created: {new Date(resume.createdAt).toLocaleDateString()}
                    <br />
                    Last Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleEditResume(resume.id)}
                    className="w-100"
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