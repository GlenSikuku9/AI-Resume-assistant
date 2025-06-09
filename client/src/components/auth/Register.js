import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
<<<<<<< HEAD

function Register() {
=======
import './Auth.css';

function Register() {
  const [name, setName] = useState('');
>>>>>>> 3d418f8a77be851b545e1b330f84a020bcc0d1cf
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      
      // Create user in Firebase Auth
      const { user } = await signup(email, password);
      
      // Create user document in Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
<<<<<<< HEAD
=======
        name: name,
>>>>>>> 3d418f8a77be851b545e1b330f84a020bcc0d1cf
        email: user.email,
        createdAt: new Date().toISOString(),
        isAdmin: false,
        resumes: []
      });

<<<<<<< HEAD
      navigate('/');
=======
      navigate('/dashboard');
>>>>>>> 3d418f8a77be851b545e1b330f84a020bcc0d1cf
    } catch (error) {
      setError('Failed to create an account. ' + error.message);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="d-flex justify-content-center">
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </Form.Group>

            <Button
              className="w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </Card.Body>
=======
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us to start building your professional resume</p>
        </div>

        {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}

        <Form className="auth-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
            <Form.Text className="text-muted">
              Password must be at least 6 characters long
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </Form.Group>

          <Button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="auth-link">
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </Form>
>>>>>>> 3d418f8a77be851b545e1b330f84a020bcc0d1cf
      </Card>
    </div>
  );
}

export default Register; 