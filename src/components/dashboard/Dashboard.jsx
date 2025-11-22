// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { dashboardService } from '../../services/dashboardService';
import AddSkillModal from '../skills/AddSkillModal';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();

    // listen to global event to refresh dashboard when skill detail changes
    const onRefresh = () => {
      fetchDashboardData();
    };
    window.addEventListener('refreshDashboard', onRefresh);

    return () => {
      window.removeEventListener('refreshDashboard', onRefresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getDashboardData();
      setDashboardData(response.data || response); // support both shapes
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressVariant = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'danger';
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Dashboard</Alert.Heading>
          <p>Unable to load your dashboard data. Please try refreshing the page.</p>
        </Alert>
      </Container>
    );
  }

  const { stats, recent_activities, skills_progress, category_breakdown } = dashboardData;

  return (
    <Container className="my-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">Learning Dashboard</h1>
              <p className="text-muted mb-0">Track your skill development progress</p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary"
                onClick={() => navigate('/analytics')}
              >
                <i className="bi bi-graph-up me-2"></i>
                Analytics
              </Button>
              <Button 
                variant="primary"
                onClick={() => setShowAddSkill(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Skill
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-primary mb-2">
                <i className="bi bi-journal-bookmark display-6"></i>
              </div>
              <Card.Title className="h4">{stats.total_skills}</Card.Title>
              <Card.Text className="text-muted">Total Skills</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-success mb-2">
                <i className="bi bi-check-circle display-6"></i>
              </div>
              <Card.Title className="h4">{stats.completed_skills}</Card.Title>
              <Card.Text className="text-muted">Completed</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-info mb-2">
                <i className="bi bi-clock display-6"></i>
              </div>
              <Card.Title className="h4">{stats.total_learning_hours}h</Card.Title>
              <Card.Text className="text-muted">Learning Time</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="text-warning mb-2">
                <i className="bi bi-graph-up-arrow display-6"></i>
              </div>
              <Card.Title className="h4">{stats.completion_rate}%</Card.Title>
              <Card.Text className="text-muted">Completion Rate</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Skills Progress */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Skills Progress</h5>
                <Link to="/skills" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              {skills_progress.length === 0 && <p className="text-muted">No skills yet. Add one to get started.</p>}
              {skills_progress.slice(0, 5).map(skill => (
                <div key={skill.id} className="mb-3 p-3 border rounded">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{skill.name}</h6>
                      <div className="small text-muted">
                        <span className="me-2">Category: {skill.category || 'Uncategorized'}</span>
                        <span>Target: <strong>{skill.target_hours}h</strong></span>
                      </div>
                      <div className="small text-muted mt-1">
                        Learned: <strong>{skill.learned_hours}h</strong>
                      </div>
                      <div className="small mt-1">
                        <Badge bg={getStatusVariant(skill.status)} className="me-2">
                          {skill.status.replace('-', ' ')}
                        </Badge>
                        <span className={`fw-bold text-${getProgressVariant(skill.progress)}`}>{skill.progress}%</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <Link to={`/skills/${skill.id}`} className="btn btn-sm btn-outline-primary">
                        View Details →
                      </Link>
                    </div>
                  </div>
                  <div className="progress mb-2" style={{height: '8px'}}>
                    <div 
                      className={`progress-bar bg-${getProgressVariant(skill.progress)}`}
                      style={{width: `${skill.progress}%`}}
                    />
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activities & Categories */}
        <Col lg={4}>
          {/* Recent Activities */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Recent Activities</h5>
            </Card.Header>
            <Card.Body>
              {recent_activities.length === 0 && <p className="text-muted">No recent activity yet.</p>}
              {recent_activities.map(activity => (
                <div key={activity.id} className="d-flex align-items-start mb-3">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                         style={{width: '32px', height: '32px', fontSize: '12px'}}>
                      <i className="bi bi-clock"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1 small">{activity.skill_name}</h6>
                    <p className="mb-1 small text-muted">
                      {activity.subtopic_title && `${activity.subtopic_title} • `}
                      {activity.duration_minutes} minutes
                    </p>
                    <small className="text-muted">
                      {new Date(activity.session_date).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* Categories */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Skill Categories</h5>
            </Card.Header>
            <Card.Body>
              {Object.entries(category_breakdown).length === 0 && <p className="text-muted">No categories yet.</p>}
              {Object.entries(category_breakdown).map(([category, count]) => (
                <div key={category} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                  <span className="fw-medium">{category}</span>
                  <Badge bg="primary" pill>{count}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showAddSkill && (
        <AddSkillModal 
          onClose={() => setShowAddSkill(false)}
          onSkillAdded={fetchDashboardData}
        />
      )}
    </Container>
  );
};

export default Dashboard;
