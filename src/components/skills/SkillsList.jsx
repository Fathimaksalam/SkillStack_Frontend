import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { skillService } from '../../services/skillService';
import AddSkillModal from './AddSkillModal';

const SkillsList = () => {
  const [skills, setSkills] = useState([]);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillService.getSkills();
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'secondary';
    }
  };

  const getProgressVariant = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your skills...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">My Skills</h1>
          <p className="text-muted mb-0">Manage and track all your learning skills</p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setShowAddSkill(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Skill
        </Button>
      </div>

      <Row className="g-4">
        {skills.map(skill => (
          <Col lg={6} key={skill.id}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{width: '48px', height: '48px'}}>
                      <i className="bi bi-journal-bookmark fs-5"></i>
                    </div>
                    <div>
                      <Card.Title className="h5 mb-1">{skill.name}</Card.Title>
                      <Badge bg={getStatusVariant(skill.status)} className="me-2">
                        {skill.status.replace('-', ' ')}
                      </Badge>
                      <Badge bg="light" text="dark">{skill.category}</Badge>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Progress</span>
                    <span className={`fw-bold text-${getProgressVariant(skill.progress)}`}>
                      {skill.progress}%
                    </span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div 
                      className={`progress-bar bg-${getProgressVariant(skill.progress)}`}
                      style={{width: `${skill.progress}%`}}
                    ></div>
                  </div>
                </div>

                <div className="d-flex justify-content-between text-muted small mb-3">
                  <div>
                    <i className="bi bi-check-circle me-1"></i>
                    {skill.completed_subtopics}/{skill.total_subtopics} topics
                  </div>
                  {skill.target_hours > 0 && (
                    <div>
                      <i className="bi bi-clock me-1"></i>
                      {skill.target_hours}h target
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      <i className="bi bi-laptop me-1"></i>
                      {skill.platform} • {skill.resource_type}
                    </small>
                  </div>
                  <Button 
                    as={Link}
                    to={`/skills/${skill.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {skills.length === 0 && (
        <Card className="border-0 shadow-sm text-center">
          <Card.Body className="py-5">
            <div className="text-muted mb-3">
              <i className="bi bi-journal-bookmark display-1"></i>
            </div>
            <h3 className="h4 mb-3">No skills yet</h3>
            <p className="text-muted mb-4">
              Start your learning journey by adding your first skill!
            </p>
            <Button 
              variant="primary"
              onClick={() => setShowAddSkill(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Your First Skill
            </Button>
          </Card.Body>
        </Card>
      )}

      {showAddSkill && (
        <AddSkillModal 
          onClose={() => setShowAddSkill(false)}
          onSkillAdded={fetchSkills}
        />
      )}
    </Container>
  );
};

export default SkillsList;