import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { dashboardService } from '../../services/dashboardService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await dashboardService.getDashboardData();
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Loading analytics...</p>
      </Container>
    );
  }

  if (!analyticsData) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Unable to load analytics</Alert>
      </Container>
    );
  }

  const skills = analyticsData.skills_progress || [];

  
  const expectedData = skills.map((s) => s.target_hours || 0);
  const actualData = skills.map((s) => s.learned_hours || 0);
  const skillLabels = skills.map((s) => s.name);

  const dynamicHeight = Math.max(skills.length * 55, 250); // auto height

  const expectedVsActualData = {
    labels: skillLabels,
    datasets: [
      {
        label: 'Expected Hours',
        data: expectedData,
        backgroundColor: '#9bbcf8',
      },
      {
        label: 'Actual Hours',
        data: actualData,
        backgroundColor: '#7f80ff',
      },
    ],
  };

  const expectedVsActualOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { beginAtZero: true },
      },
    },
    plugins: {
      legend: { position: 'top' },
    },
  };

  
  const categoryData = {
    labels: Object.keys(analyticsData.category_breakdown),
    datasets: [
      {
        data: Object.values(analyticsData.category_breakdown),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#7ED957', '#9966FF', '#FF9F40'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  return (
    <Container className="my-4">
      {/* HEADER */}
      <Row className="mb-4">
        <Col>
          <h1>Learning Analytics</h1>
          <p className="text-muted">Track your learning journey</p>
        </Col>
      </Row>

      {/* TOP STATS */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-2">⏱</div>
              <h5>Total Learning Hours</h5>
              <h2>{analyticsData.stats.total_learning_hours}h</h2>
              <p className="text-muted">All-time tracked</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-2">📘</div>
              <h5>Skills Completed</h5>
              <h2>
                {analyticsData.stats.completed_skills}/{analyticsData.stats.total_skills}
              </h2>
              <div className="progress mt-2" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${analyticsData.stats.completion_rate}%` }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 mb-2">📅</div>
              <h5>Active Learning Days</h5>
              <h2>{Object.keys(analyticsData.calendar_data).length}</h2>
              <p className="text-muted">Last 30 days</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CHARTS ROW */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5>Expected vs Actual Hours</h5>
              <p className="text-muted">How your learning compares to your plan</p>

              <div style={{ height: dynamicHeight, overflowY: 'auto' }}>
                <Bar data={expectedVsActualData} options={expectedVsActualOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5>Skill Categories</h5>
              <p className="text-muted">Your distribution of skills</p>

              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '320px',
                }}
              >
                <Doughnut data={categoryData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* TIMELINE */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Recent Learning Activities</h5>

              {analyticsData.recent_activities.map((a, i) => (
                <div key={a.id} className="d-flex p-3 border rounded mb-2">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '45px', height: '45px' }}
                  >
                    {i + 1}
                  </div>

                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-1">{a.skill_name}</h6>
                    <p className="mb-1 text-muted">
                      {a.subtopic_title && `${a.subtopic_title} • `}
                      {a.duration_minutes} minutes
                    </p>
                    <small className="text-muted">
                      {new Date(a.session_date).toLocaleDateString()}
                    </small>
                  </div>

                  <Badge bg="light" text="dark">
                    {a.duration_minutes}m
                  </Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;
