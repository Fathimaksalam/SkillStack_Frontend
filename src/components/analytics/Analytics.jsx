import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
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
  LineElement,
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

  const calculateStreak = () => {
    // Mock streak calculation
    return {
      current: 5,
      longest: 12,
      lastActive: '2024-01-15'
    };
  };

  const getWeeklyComparison = () => {
    const currentWeekHours = 15.5;
    const lastWeekHours = 12.2;
    const difference = currentWeekHours - lastWeekHours;
    const percentage = ((difference / lastWeekHours) * 100).toFixed(1);
    
    return {
      currentWeek: currentWeekHours,
      lastWeek: lastWeekHours,
      difference: difference,
      percentage: percentage,
      isImprovement: difference > 0
    };
  };

  const weeklyComparison = getWeeklyComparison();
  const streakData = calculateStreak();

  // Chart data for weekly learning hours
  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Current Week',
        data: [2.5, 3.2, 1.8, 2.7, 4.1, 1.2, 0],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
      },
      {
        label: 'Last Week',
        data: [1.8, 2.5, 2.1, 3.0, 2.2, 0.6, 0],
        backgroundColor: 'rgba(118, 75, 162, 0.6)',
        borderColor: 'rgba(118, 75, 162, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Chart data for skill distribution
  const skillDistributionData = {
    labels: analyticsData ? Object.keys(analyticsData.category_breakdown) : [],
    datasets: [
      {
        data: analyticsData ? Object.values(analyticsData.category_breakdown) : [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading analytics...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1>Learning Analytics</h1>
          <p className="text-muted">Track your progress and optimize your learning journey</p>
        </Col>
      </Row>

      {/* Weekly Comparison Alert */}
      <Row className="mb-4">
        <Col>
          <Alert variant={weeklyComparison.isImprovement ? 'success' : 'warning'}>
            <Alert.Heading>
              {weeklyComparison.isImprovement ? '🎉 Great Progress!' : '📊 Weekly Overview'}
            </Alert.Heading>
            <p>
              This week you've learned for <strong>{weeklyComparison.currentWeek} hours</strong>
              {weeklyComparison.isImprovement ? (
                <> - that's <strong>{weeklyComparison.percentage}% more</strong> than last week! Keep it up! 🚀</>
              ) : (
                <> - similar to last week's {weeklyComparison.lastWeek} hours. You can do better! 💪</>
              )}
            </p>
          </Alert>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {/* Streak Card */}
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">🔥</div>
              <Card.Title>Learning Streak</Card.Title>
              <div className="display-4 text-warning mb-2">{streakData.current}</div>
              <p className="text-muted">days in a row</p>
              <Badge bg="secondary">Longest: {streakData.longest} days</Badge>
              {streakData.current >= 7 && (
                <Alert variant="success" className="mt-3 mb-0">
                  <small>🔥 Fire streak! You're on fire this week!</small>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Total Hours Card */}
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 text-info mb-2">⏱️</div>
              <Card.Title>Total Learning Time</Card.Title>
              <div className="display-4 text-info mb-2">
                {analyticsData?.stats.total_learning_hours || 0}
              </div>
              <p className="text-muted">hours invested</p>
              <Badge bg="primary">This Week: {weeklyComparison.currentWeek}h</Badge>
            </Card.Body>
          </Card>
        </Col>

        {/* Skills Progress Card */}
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">📚</div>
              <Card.Title>Skills Progress</Card.Title>
              <div className="display-4 text-success mb-2">
                {analyticsData?.stats.completed_skills || 0}/{analyticsData?.stats.total_skills || 0}
              </div>
              <p className="text-muted">skills completed</p>
              <Badge bg="success">
                {analyticsData?.stats.completion_rate || 0}% Completion Rate
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Weekly Learning Chart */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title>Weekly Learning Hours</Card.Title>
              <p className="text-muted">Compare your learning hours with last week</p>
              <Bar data={weeklyChartData} options={chartOptions} height={300} />
            </Card.Body>
          </Card>
        </Col>

        {/* Skill Distribution Chart */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title>Skill Categories</Card.Title>
              <p className="text-muted">Distribution of your learning focus</p>
              <Doughnut data={skillDistributionData} options={chartOptions} height={300} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Timeline */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title>Learning Progress Timeline</Card.Title>
              <p className="text-muted">Your recent learning activities</p>
              {analyticsData?.recent_activities.map((activity, index) => (
                <div key={activity.id} className="d-flex align-items-center mb-3 p-3 border rounded">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                         style={{width: '40px', height: '40px'}}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1">{activity.skill_name}</h6>
                    <p className="mb-1 text-muted">
                      {activity.subtopic_title && `${activity.subtopic_title} • `}
                      {activity.duration_minutes} minutes
                    </p>
                    <small className="text-muted">
                      {new Date(activity.session_date).toLocaleDateString()}
                    </small>
                  </div>
                  <Badge bg="light" text="dark">
                    {activity.duration_minutes}m
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