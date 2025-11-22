// src/components/skills/AddSkillModal.jsx
import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import skillService from "../../services/skillService";

const AddSkillModal = ({ onClose, onSkillAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    resource_type: "",
    platform: "",
    target_hours: "",
    description: "",
    subtopics: [{ title: "", description: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubtopicChange = (index, field, value) => {
    const updated = [...formData.subtopics];
    updated[index][field] = value;
    setFormData({ ...formData, subtopics: updated });
  };

  const addSubtopic = () => {
    setFormData({
      ...formData,
      subtopics: [...formData.subtopics, { title: "", description: "" }],
    });
  };

  const removeSubtopic = (index) => {
    const filtered = formData.subtopics.filter((_, i) => i !== index);
    setFormData({ ...formData, subtopics: filtered });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cleanTopics = formData.subtopics
        .filter((t) => t.title.trim() !== "")
        .map((t) => ({
          title: t.title.trim(),
          description: t.description.trim(),
        }));

      const payload = {
        name: formData.name.trim(),
        resource_type: formData.resource_type,
        platform: formData.platform,
        target_hours: formData.target_hours,
        description: formData.description.trim(),
        user_subtopics: cleanTopics,
      };

      await skillService.createSkill(payload);
      onSkillAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Error creating skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-plus-circle me-2"></i>
          Add New Skill
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Skill Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., React.js, Python, Machine Learning"
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Resource Type *</Form.Label>
                <Form.Select
                  name="resource_type"
                  value={formData.resource_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Resource Type --</option>
                  <option value="course">Course</option>
                  <option value="video">Video Series</option>
                  <option value="article">Article Series</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="book">Book</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Platform *</Form.Label>
                <Form.Select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Platform --</option>
                  <option value="Udemy">Udemy</option>
                  <option value="Coursera">Coursera</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Pluralsight">Pluralsight</option>
                  <option value="LinkedIn Learning">LinkedIn Learning</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Target Hours *</Form.Label>
            <Form.Control
              type="number"
              name="target_hours"
              value={formData.target_hours}
              onChange={handleChange}
              min="0"
              step="0.5"
              required
              placeholder="Estimated total learning hours"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description..."
            />
          </Form.Group>

          <div className="border-top pt-3 mt-3">
            <h6>
              <i className="bi bi-list-task me-2"></i>
              Learning Topics
            </h6>
            <p className="text-muted small mb-3">
              Add the main topics you'll cover (AI will add more automatically)
            </p>

            {formData.subtopics.map((sub, index) => (
              <div key={index} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <small className="fw-bold">Topic {index + 1}</small>
                  {formData.subtopics.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeSubtopic(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  )}
                </div>

                <Form.Group className="mb-2">
                  <Form.Control
                    type="text"
                    value={sub.title}
                    onChange={(e) =>
                      handleSubtopicChange(index, "title", e.target.value)
                    }
                    placeholder="Topic title"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={sub.description}
                    onChange={(e) =>
                      handleSubtopicChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Topic description (optional)"
                  />
                </Form.Group>
              </div>
            ))}

            <Button
              variant="outline-primary"
              className="w-100"
              onClick={addSubtopic}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Another Topic
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creating...
              </>
            ) : (
              "Create Skill"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddSkillModal;
