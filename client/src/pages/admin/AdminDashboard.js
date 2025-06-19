import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [apiUsage, setApiUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const [templateNames, setTemplateNames] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        };

        // Fetch JobSeekerAnalytics
        const analyticsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/job-seeker-analytics`, {
          headers
        });
        const analyticsData = await analyticsResponse.json();
        if (!analyticsResponse.ok) throw new Error(analyticsData.error);
        setAnalytics(analyticsData);

        // Fetch API usage for recent activity (optional, keep for table)
        const usageResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/api-usage`, {
          headers
        });
        const usageData = await usageResponse.json();
        if (!usageResponse.ok) throw new Error(usageData.error);
        setApiUsage(usageData);

        // Fetch template names for display
        const templatesRes = await fetch(`${process.env.REACT_APP_API_URL}/api/templates`);
        const templates = await templatesRes.json();
        if (Array.isArray(templates)) {
          const nameMap = {};
          templates.forEach(t => { nameMap[t.id] = t.name; });
          setTemplateNames(nameMap);
        }
      } catch (error) {
        setError('Failed to fetch admin analytics');
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
              <Card.Title>Total Resumes</Card.Title>
              <h3>{analytics?.totalResumesCreated || 0}</h3>
              <p className="text-muted">Created resumes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <Card.Title>API Usage</Card.Title>
              <h3>{analytics?.totalApiCalls || 0}</h3>
              <p className="text-muted">Total API calls</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <Card.Title>PDF Downloads</Card.Title>
              <h3>{analytics?.totalPDFDownloads || 0}</h3>
              <p className="text-muted">Total downloads</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="metric-card">
            <Card.Body>
              <Card.Title>AI Tokens Used</Card.Title>
              <h3>{analytics?.totalAITokensUsed || 0}</h3>
              <p className="text-muted">Total AI tokens</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Template Usage */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="template-usage-card">
            <Card.Body>
              <Card.Title>Template Usage</Card.Title>
              <div className="template-usage-list">
                {analytics?.templateUsageCount && Object.entries(analytics.templateUsageCount).map(([templateId, count]) => (
                  <div key={templateId} className="template-usage-item">
                    <div className="template-info">
                      <span className="template-name">{templateNames[templateId] || templateId}</span>
                      <span className="template-count">{count} uses</span>
                    </div>
                    <div className="template-bar">
                      <div
                        className="template-bar-fill"
                        style={{ width: `${(count / Math.max(...Object.values(analytics.templateUsageCount))) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <strong>Most Used Template: </strong>
                {templateNames[analytics?.mostUsedTemplate] || analytics?.mostUsedTemplate || 'N/A'}
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