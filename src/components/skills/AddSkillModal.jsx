import React, { useState } from 'react';
import { skillService } from '../../services/skillService';
import { X, Plus, Trash2 } from 'lucide-react';
import '../../styles/AddSkillModal.css';

const AddSkillModal = ({ onClose, onSkillAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    resource_type: 'course',
    platform: 'Udemy',
    target_hours: 0,
    description: '',
    subtopics: [{ title: '', description: '' }]
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubtopicChange = (index, field, value) => {
    const newSubtopics = [...formData.subtopics];
    newSubtopics[index][field] = value;
    setFormData({ ...formData, subtopics: newSubtopics });
  };

  const addSubtopic = () => {
    setFormData({
      ...formData,
      subtopics: [...formData.subtopics, { title: '', description: '' }]
    });
  };

  const removeSubtopic = (index) => {
    const newSubtopics = formData.subtopics.filter((_, i) => i !== index);
    setFormData({ ...formData, subtopics: newSubtopics });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await skillService.createSkill(formData);
      onSkillAdded();
      onClose();
    } catch (error) {
      console.error('Error creating skill:', error);
      alert('Error creating skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Skill</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Skill Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., React.js, Python, Machine Learning"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Resource Type</label>
              <select
                name="resource_type"
                value={formData.resource_type}
                onChange={handleChange}
              >
                <option value="course">Course</option>
                <option value="video">Video Series</option>
                <option value="article">Article Series</option>
                <option value="tutorial">Tutorial</option>
                <option value="book">Book</option>
              </select>
            </div>

            <div className="form-group">
              <label>Platform</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
              >
                <option value="Udemy">Udemy</option>
                <option value="Coursera">Coursera</option>
                <option value="YouTube">YouTube</option>
                <option value="Pluralsight">Pluralsight</option>
                <option value="LinkedIn Learning">LinkedIn Learning</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Target Hours</label>
            <input
              type="number"
              name="target_hours"
              value={formData.target_hours}
              onChange={handleChange}
              min="0"
              step="0.5"
              placeholder="Estimated total learning hours"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of what you want to learn..."
            />
          </div>

          <div className="subtopics-section">
            <h3>Learning Topics</h3>
            <p className="subtitle">Add the main topics you'll cover (AI will suggest more)</p>
            
            {formData.subtopics.map((subtopic, index) => (
              <div key={index} className="subtopic-item">
                <div className="subtopic-header">
                  <h4>Topic {index + 1}</h4>
                  {formData.subtopics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubtopic(index)}
                      className="remove-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    value={subtopic.title}
                    onChange={(e) => handleSubtopicChange(index, 'title', e.target.value)}
                    required
                    placeholder="Topic title"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    value={subtopic.description}
                    onChange={(e) => handleSubtopicChange(index, 'description', e.target.value)}
                    rows="2"
                    placeholder="Topic description (optional)"
                  />
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addSubtopic} className="add-subtopic-btn">
              <Plus size={16} />
              Add Another Topic
            </button>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;