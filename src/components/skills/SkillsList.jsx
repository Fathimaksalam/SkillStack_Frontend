// src/components/skills/SkillsList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import skillService from "../../services/skillService";
import AddSkillModal from "./AddSkillModal";

const SkillsList = () => {
  const [skills, setSkills] = useState([]);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [loading, setLoading] = useState(true);

  // Delete popup states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  // Toast states
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillService.getUserSkills();
      setSkills(response.data || response);
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const openDeletePopup = (skill) => {
    setSkillToDelete(skill);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;

    try {
      await skillService.deleteSkill(skillToDelete.id);
      setShowDeleteModal(false);
      setSkillToDelete(null);
      fetchSkills();

      // refresh dashboard
      window.dispatchEvent(new Event("refreshDashboard"));

      // show toast
      setShowToast(true);
    } catch (err) {
      console.error("Error deleting skill:", err);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getProgressVariant = (progress) => {
    if (progress >= 80) return "success";
    if (progress >= 50) return "warning";
    return "danger";
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Loading your skills...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">My Skills</h1>
          <p className="text-muted mb-0">Manage and track all your learning skills</p>
        </div>

        <Button variant="primary" onClick={() => setShowAddSkill(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Skill
        </Button>
      </div>

      {/* Skill Cards */}
      <Row className="g-4">
        {skills.map((skill) => (
          <Col lg={6} key={skill.id}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <i className="bi bi-journal-bookmark fs-5"></i>
                    </div>
                    <div>
                      <Card.Title className="h5 mb-1">{skill.name}</Card.Title>
                      <Badge bg={getStatusVariant(skill.status)} className="me-2">
                        {skill.status.replace("-", " ")}
                      </Badge>
                      <Badge bg="light" text="dark">
                        {skill.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => openDeletePopup(skill)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>

                {/* Progress */}
                <div className="my-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Progress</span>
                    <span className={`fw-bold text-${getProgressVariant(skill.progress)}`}>
                      {skill.progress}%
                    </span>
                  </div>

                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className={`progress-bar bg-${getProgressVariant(skill.progress)}`}
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="d-flex justify-content-between text-muted small mb-3">
                  <span>
                    <i className="bi bi-check-circle me-1"></i>
                    {skill.completed_subtopics}/{skill.total_subtopics} topics
                  </span>
                  {skill.target_hours > 0 && (
                    <span>
                      <i className="bi bi-clock me-1"></i>
                      {skill.target_hours}h target
                    </span>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    <i className="bi bi-laptop me-1"></i>
                    {skill.platform} • {skill.resource_type}
                  </small>

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


      {/* EMPTY STATE */}
      {skills.length === 0 && (
        <Card className="border-0 shadow-sm text-center">
          <Card.Body className="py-5">
            <h3>No skills yet</h3>
            <p className="text-muted">Start your learning journey by adding your first skill.</p>
            <Button variant="primary" onClick={() => setShowAddSkill(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Add Skill
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Add Skill Modal */}
      {showAddSkill && (
        <AddSkillModal
          onClose={() => setShowAddSkill(false)}
          onSkillAdded={fetchSkills}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete
          <strong> {skillToDelete?.name}</strong>?<br />
          <span className="text-muted small">
            This action cannot be undone.
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* SUCCESS TOAST */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
          show={showToast}
        >
          <Toast.Header className="text-white bg-success">
            <strong className="me-auto">Deleted</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Skill deleted successfully.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default SkillsList;
