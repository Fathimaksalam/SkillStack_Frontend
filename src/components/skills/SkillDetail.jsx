import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { skillService } from '../../services/skillService';

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSkillDetail();
  }, [id]);

  const fetchSkillDetail = async () => {
    try {
      const response = await skillService.getSkillDetail(id);
      setSkill(response.data);
    } catch (error) {
      console.error('Error fetching skill detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubtopicStatus = async (subtopicId, newStatus) => {
    setUpdating(true);
    try {
      await skillService.updateSubtopicStatus(subtopicId, newStatus);
      await fetchSkillDetail(); // Refresh data
    } catch (error) {
      console.error('Error updating subtopic:', error);
      alert('Error updating subtopic status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'bi-check-circle-fill text-success';
      case 'in-progress': return 'bi-play-circle-fill text-primary';
      default: return 'bi-circle text-secondary';
    }
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading skill details...</p>
        </div>
      </Container>
    );
  }

  if (!skill) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Skill Not Found</Alert.Heading>
          <p>The skill you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/skills')}>
            Back to Skills
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/skills')}
          className="me-3"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </Button>
        <div>
          <h1 className="h2 mb-1">{skill.name}</h1>
          <div className="d-flex gap-2">
            <Badge bg="primary">{skill.platform}</Badge>
            <Badge bg="info">{skill.resource_type}</Badge>
            <Badge bg="light" text="dark">{skill.category}</Badge>
            <Badge bg={getStatusVariant(skill.status)}>
              {skill.status}
            </Badge>
          </div>
        </div>
      </div>

      {skill.description && (
        <Card className="border-0 bg-light mb-4">
          <Card.Body>
            <p className="mb-0">{skill.description}</p>
          </Card.Body>
        </Card>
      )}

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="text-primary mb-2">
                <i className="bi bi-graph-up display-6"></i>
              </div>
              <Card.Title className="h3">{skill.progress}%</Card.Title>
              <Card.Text className="text-muted">Progress</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="text-success mb-2">
                <i className="bi bi-check-circle display-6"></i>
              </div>
              <Card.Title className="h3">
                {skill.subtopics.filter(st => st.status === 'completed').length}/
                {skill.subtopics.length}
              </Card.Title>
              <Card.Text className="text-muted">Topics Completed</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <div className="text-warning mb-2">
                <i className="bi bi-clock display-6"></i>
              </div>
              <Card.Title className="h3">{skill.target_hours || 0}h</Card.Title>
              <Card.Text className="text-muted">Target Hours</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Bar */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold">Overall Progress</span>
            <span className="text-primary fw-bold">{skill.progress}% Complete</span>
          </div>
          <div className="progress" style={{height: '12px'}}>
            <div 
              className="progress-bar bg-primary" 
              style={{width: `${skill.progress}%`}}
            ></div>
          </div>
        </Card.Body>
      </Card>

      {/* Learning Path */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0">
          <h5 className="mb-0">
            <i className="bi bi-list-task me-2"></i>
            Learning Path
          </h5>
        </Card.Header>
        <Card.Body>
          {skill.subtopics.map((subtopic, index) => (
            <div key={subtopic.id} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-start flex-grow-1">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{width: '40px', height: '40px', flexShrink: 0}}>
                    {index + 1}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{subtopic.title}</h6>
                    {subtopic.description && (
                      <p className="text-muted mb-2 small">{subtopic.description}</p>
                    )}
                    {subtopic.hours_spent > 0 && (
                      <div className="d-flex align-items-center text-muted small">
                        <i className="bi bi-clock me-1"></i>
                        <span>{subtopic.hours_spent.toFixed(1)} hours spent</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="d-flex flex-column align-items-end gap-2">
                  <Badge bg={getStatusVariant(subtopic.status)} className="d-flex align-items-center">
                    <i className={`bi ${getStatusIcon(subtopic.status)} me-1`}></i>
                    {subtopic.status.replace('-', ' ')}
                  </Badge>
                  
                  <div className="d-flex gap-1">
                    {subtopic.status !== 'to-learn' && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateSubtopicStatus(subtopic.id, 'to-learn')}
                        disabled={updating}
                      >
                        Reset
                      </Button>
                    )}
                    {subtopic.status !== 'in-progress' && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => updateSubtopicStatus(subtopic.id, 'in-progress')}
                        disabled={updating}
                      >
                        Start
                      </Button>
                    )}
                    {subtopic.status !== 'completed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateSubtopicStatus(subtopic.id, 'completed')}
                        disabled={updating}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SkillDetail;