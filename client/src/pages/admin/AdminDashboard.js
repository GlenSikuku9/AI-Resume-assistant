import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const [apiUsage, setApiUsage] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [stats, setStats] = useState(null);
  const [templateUsage, setTemplateUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        };

        // Fetch API usage
        const usageResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/api-usage`, {
          headers
        });
        const usageData = await usageResponse.json();
        if (!usageResponse.ok) throw new Error(usageData.error);
        setApiUsage(usageData);

        // Fetch performance metrics
        const perfResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/performance`, {
          headers
        });
        const perfData = await perfResponse.json();
        if (!perfResponse.ok) throw new Error(perfData.error);
        setPerformance(perfData);

        // Fetch user statistics
        const statsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/user-stats`, {
          headers
        });
        const statsData = await statsResponse.json();
        if (!statsResponse.ok) throw new Error(statsData.error);
        setStats(statsData);

        // Fetch template usage statistics
        const templateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/template-stats`, {
          headers
        });
        const templateData = await templateResponse.json();
        if (!templateResponse.ok) throw new Error(templateData.error);
        setTemplateUsage(templateData);
      } catch (error) {
        setError('Failed to fetch admin data');
        console.error('Admin dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Container className="admin-dashboard">
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <h2 className="dashboard-title mb-4">Admin Dashboard</h2>

      {/* Key Metrics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h3>{stats?.totalUsers || 0}</h3>
              <p className="text-muted">Registered accounts</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <Card.Title>Total Resumes</Card.Title>
              <h3>{stats?.totalResumes || 0}</h3>
              <p className="text-muted">Created resumes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <Card.Title>PDF Downloads</Card.Title>
              <h3>{stats?.totalDownloads || 0}</h3>
              <p className="text-muted">Total downloads</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <Card.Title>API Usage</Card.Title>
              <h3>{stats?.totalApiCalls || 0}</h3>
              <p className="text-muted">Total API calls</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Template Usage */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="template-usage-card">
            <Card.Body>
              <Card.Title>Most Used Templates</Card.Title>
              <div className="template-usage-list">
                {templateUsage.map((template) => (
                  <div key={template.id} className="template-usage-item">
                    <div className="template-info">
                      <span className="template-name">{template.name}</span>
                      <span className="template-count">{template.usageCount} uses</span>
                    </div>
                    <div className="template-bar">
                      <div 
                        className="template-bar-fill"
                        style={{ width: `${(template.usageCount / templateUsage[0].usageCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="recent-activity-card">
            <Card.Body>
              <Card.Title>Recent Activity</Card.Title>
              <Table responsive className="activity-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>User</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apiUsage.slice(0, 5).map((usage) => (
                    <tr key={usage.id}>
                      <td>{new Date(usage.timestamp).toLocaleTimeString()}</td>
                      <td>{usage.userId}</td>
                      <td>{usage.endpoint}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* API Usage Details */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>API Usage Details</Card.Title>
          <Table responsive>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Endpoint</th>
                <th>Response Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {apiUsage.map((usage) => (
                <tr key={usage.id}>
                  <td>{new Date(usage.timestamp).toLocaleString()}</td>
                  <td>{usage.userId}</td>
                  <td>{usage.endpoint}</td>
                  <td>{usage.responseTime}ms</td>
                  <td>
                    <span className={`badge bg-${usage.status === 200 ? 'success' : 'danger'}`}>
                      {usage.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard; 