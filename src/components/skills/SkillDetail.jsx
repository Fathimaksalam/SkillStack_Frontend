import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Form, Modal } from "react-bootstrap";
import skillService from "../../services/skillService";
import api from "../../services/api";

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [sessionModal, setSessionModal] = useState({ open: false, subtopicId: null });
  const [sessionMinutes, setSessionMinutes] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");

  const [completionModal, setCompletionModal] = useState({ open: false, skillId: null });
  const [rating, setRating] = useState(0);
  const [completionNotes, setCompletionNotes] = useState("");
  const [savingCompletion, setSavingCompletion] = useState(false);

  useEffect(() => {
    fetchSkill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSkill = async () => {
    setLoading(true);
    try {
      const res = await skillService.getSkillDetail(id);
      setSkill(res.data || res);
    } catch (err) {
      console.error("Failed to load skill detail", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerDashboardRefresh = () => {
    window.dispatchEvent(new Event("refreshDashboard"));
  };

  const handleUpdateSubtopic = async (subtopicId, newStatus) => {
    setActionLoading(true);
    try {
      const st = skill?.subtopics?.find((s) => s.id === subtopicId);
      if (!st) {
        alert("Subtopic not found.");
        setActionLoading(false);
        return;
      }
      if (newStatus === "completed") {
        if ((Number(st.expected_hours) || 0) === 0 || (Number(st.hours_spent) || 0) === 0) {
          alert("Please log time for this topic before marking it complete.");
          setActionLoading(false);
          return;
        }
      }

      const res = await skillService.updateSubtopicStatus(subtopicId, newStatus);

      if (res?.data?.skill_completed) {
        setCompletionModal({ open: true, skillId: res.data.skill_id || id });
      }

      await fetchSkill();
      triggerDashboardRefresh();
    } catch (err) {
      console.error("Failed to update subtopic status", err);
      if (err.response?.data?.error) alert(err.response.data.error);
      else alert("Failed to update subtopic status.");
    } finally {
      setActionLoading(false);
    }
  };

  const openSessionModal = (subtopicId) => {
    setSessionModal({ open: true, subtopicId });
    setSessionMinutes("");
    setSessionNotes("");
  };

  const closeSessionModal = () => {
    setSessionModal({ open: false, subtopicId: null });
  };

  const handleAddSession = async () => {
    if (!sessionModal.subtopicId) return;
    const minutes = Number(sessionMinutes);
    if (!minutes || minutes <= 0) {
      alert("Please enter a valid duration in minutes (greater than 0).");
      return;
    }

    setActionLoading(true);
    try {
      await skillService.addLearningSession({
        skill_id: Number(id),
        subtopic_id: sessionModal.subtopicId,
        duration_minutes: minutes,
        notes: sessionNotes || ""
      });
      await fetchSkill();
      triggerDashboardRefresh();
      closeSessionModal();
    } catch (err) {
      console.error("Failed to add session", err);
      if (err.response?.data?.error) alert(err.response.data.error);
      else alert("Failed to add session.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveCompletion = async () => {
    if (!completionModal.skillId) return;
    setSavingCompletion(true);
    try {
      const payload = { rating, notes: completionNotes || "" };
      if (skillService.completeSkill && typeof skillService.completeSkill === "function") {
        try {
          await skillService.completeSkill(completionModal.skillId, payload);
        } catch (e) {
          await api.post(`/skills/${completionModal.skillId}/review`, payload);
        }
      } else {
        await api.post(`/skills/${completionModal.skillId}/review`, payload);
      }

      setCompletionModal({ open: false, skillId: null });
      setRating(0);
      setCompletionNotes("");
      await fetchSkill();
      triggerDashboardRefresh();
    } catch (err) {
      console.error("Failed to save completion review", err);
      alert("Failed to save review.");
    } finally {
      setSavingCompletion(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </Container>
    );
  }

  if (!skill) {
    return (
      <Container className="my-5">
        <Card>
          <Card.Body>
            <h5>Skill not found</h5>
            <p>The requested skill was not found or you do not have permission.</p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const { subtopics = [], target_hours = 0, learned_hours = 0 } = skill;

  return (
    <Container className="my-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2 className="mb-0">{skill.name}</h2>
          <div className="text-muted small">
            {skill.category && <><strong>{skill.category}</strong> • </>}
            {skill.platform && <>{skill.platform} • </>}
            Status: <Badge bg={skill.status === "completed" ? "success" : (skill.status === "in-progress" ? "primary" : "secondary")}>{skill.status}</Badge>
          </div>
        </Col>
        <Col className="text-end">
          <div className="small text-muted">
            Target: <strong>{target_hours}h</strong> • Learned: <strong>{learned_hours}h</strong>
          </div>
          <div className="small text-muted">Progress: <strong>{skill.progress ?? 0}%</strong></div>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Learning Path</h5>
            </Card.Header>
            <Card.Body>
              {subtopics.length === 0 && <p className="text-muted">No topics found.</p>}
              {subtopics.map((st) => (
                <div key={st.id} className="mb-3 p-3 border rounded">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ maxWidth: "68%" }}>
                      <h6 className="mb-1">{st.title}</h6>
                      <div className="small text-muted">{st.description}</div>
                      <div className="small text-muted mt-1">
                        Expected: <strong>{st.expected_hours ?? 0}h</strong> • Spent: <strong>{st.hours_spent ?? 0}h</strong>
                      </div>
                      {st.notes && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <strong className="small">Notes:</strong>
                          <div className="small">{st.notes}</div>
                        </div>
                      )}
                    </div>

                    <div className="text-end">
                      <div className="mb-2">
                        <Badge bg={st.status === "completed" ? "success" : (st.status === "in-progress" ? "primary" : "secondary")}>
                          {st.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {st.status !== "in-progress" && st.status !== "completed" && (
                          <Button size="sm" variant="outline-primary" onClick={() => handleUpdateSubtopic(st.id, "in-progress")} disabled={actionLoading}>
                            Start
                          </Button>
                        )}

                        {st.status !== "completed" && (
                          <Button size="sm" variant="outline-success" onClick={() => handleUpdateSubtopic(st.id, "completed")} disabled={actionLoading}>
                            Mark Complete
                          </Button>
                        )}

                        {st.status !== "completed" && (
                          <Button size="sm" variant="outline-secondary" onClick={() => openSessionModal(st.id)}>
                            Log Session
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <h6>Skill Summary</h6>
              <p className="mb-1"><strong>Target Hours:</strong> {target_hours}h</p>
              <p className="mb-1"><strong>Learned:</strong> {learned_hours}h</p>
              <p className="mb-1"><strong>Progress:</strong> {skill.progress ?? 0}%</p>
              {skill.rating && <p className="mb-1"><strong>Rating:</strong> {"★".repeat(skill.rating)}</p>}
              {skill.course_notes && <p className="small text-muted">{skill.course_notes}</p>}
              <div className="mt-3">
                <Button variant="primary" onClick={() => navigate("/skills")}>Back to Skills</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={sessionModal.open} onHide={closeSessionModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log Learning Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control type="number" value={sessionMinutes} onChange={(e) => setSessionMinutes(e.target.value)} min={1} placeholder="Enter minutes spent (e.g., 45)" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes (optional)</Form.Label>
              <Form.Control as="textarea" rows={3} value={sessionNotes} onChange={(e) => setSessionNotes(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeSessionModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddSession} disabled={actionLoading}>{actionLoading ? "Saving..." : "Save Session"}</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={completionModal.open} onHide={() => setCompletionModal({ open: false, skillId: null })} centered>
        <Modal.Header closeButton>
          <Modal.Title>Course Completed — Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Congrats! You completed all topics for this course. Would you like to leave a rating and notes?</p>
          <Form>
            <Form.Group className="mb-3">
              <div>
                {[1,2,3,4,5].map((s) => (
                  <Button key={s} variant={rating >= s ? "warning" : "outline-secondary"} size="sm" className="me-1" onClick={() => setRating(s)}>★</Button>
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes (optional)</Form.Label>
              <Form.Control as="textarea" rows={3} value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCompletionModal({ open: false, skillId: null })}>Skip</Button>
          <Button variant="primary" onClick={handleSaveCompletion} disabled={savingCompletion}>{savingCompletion ? "Saving..." : "Save & Finish"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SkillDetail;
