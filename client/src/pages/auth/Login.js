import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setMessage('');
      setLoading(true);

      await login(email, password);
      navigate('/templates');

    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/change-password');
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue building your professional resume</p>
        </div>

        {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}
        {message && <Alert variant="success" className="auth-alert">{message}</Alert>}

        <Form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              required
            />
          </Form.Group>        
          <Button
            className="auth-button w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>

          <div className="auth-link">
            <p>
              Don't have an account?<Link to="/register">Sign Up</Link>
            </p>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
