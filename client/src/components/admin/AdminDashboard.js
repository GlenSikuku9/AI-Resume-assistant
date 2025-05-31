import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

function AdminDashboard() {
  const [apiUsage, setApiUsage] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [stats, setStats] = useState(null);
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
    <Container>
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <h2 className="mb-4">Admin Dashboard</h2>

      {/* User Statistics */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h3>{stats?.totalUsers || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Resumes</Card.Title>
              <h3>{stats?.totalResumes || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Avg. Resumes/User</Card.Title>
              <h3>{stats?.averageResumesPerUser?.toFixed(2) || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* API Usage */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Recent API Usage</Card.Title>
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

      {/* Performance Metrics */}
      <Card>
        <Card.Body>
          <Card.Title>System Performance</Card.Title>
          <Table responsive>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>CPU Usage</th>
                <th>Memory Usage</th>
                <th>Active Users</th>
                <th>Response Time</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((metric) => (
                <tr key={metric.id}>
                  <td>{new Date(metric.timestamp).toLocaleString()}</td>
                  <td>{metric.cpuUsage}%</td>
                  <td>{metric.memoryUsage}MB</td>
                  <td>{metric.activeUsers}</td>
                  <td>{metric.avgResponseTime}ms</td>
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