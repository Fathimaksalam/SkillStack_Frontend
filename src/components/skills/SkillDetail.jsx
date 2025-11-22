import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { skillService } from '../../services/skillService';
import { ArrowLeft, CheckCircle, Circle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import '../../styles/SkillDetail.css';

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="status-icon completed" />;
      case 'in-progress':
        return <PlayCircle size={20} className="status-icon in-progress" />;
      default:
        return <Circle size={20} className="status-icon to-learn" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="skill-detail-loading">
        <div className="loading-spinner large"></div>
        <p>Loading skill details...</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="skill-detail-error">
        <h2>Skill not found</h2>
        <button onClick={() => navigate('/skills')} className="btn-primary">
          Back to Skills
        </button>
      </div>
    );
  }

  return (
    <div className="skill-detail">
      <div className="detail-header">
        <button onClick={() => navigate('/skills')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Skills
        </button>
        
        <div className="skill-info">
          <div className="skill-meta">
            <h1>{skill.name}</h1>
            <div className="meta-tags">
              <span className="platform-tag">{skill.platform}</span>
              <span className="type-tag">{skill.resource_type}</span>
              <span className="category-tag">{skill.category}</span>
              <span 
                className="status-tag"
                style={{ backgroundColor: getStatusColor(skill.status) }}
              >
                {skill.status}
              </span>
            </div>
            {skill.description && (
              <p className="skill-description">{skill.description}</p>
            )}
          </div>
          
          <div className="skill-stats">
            <div className="stat">
              <BookOpen size={20} />
              <div>
                <span className="stat-value">{skill.progress}%</span>
                <span className="stat-label">Progress</span>
              </div>
            </div>
            <div className="stat">
              <CheckCircle size={20} />
              <div>
                <span className="stat-value">
                  {skill.subtopics.filter(st => st.status === 'completed').length}/
                  {skill.subtopics.length}
                </span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            {skill.target_hours > 0 && (
              <div className="stat">
                <Clock size={20} />
                <div>
                  <span className="stat-value">{skill.target_hours}h</span>
                  <span className="stat-label">Target</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar-large">
          <div 
            className="progress-fill" 
            style={{ width: `${skill.progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{skill.progress}% Complete</span>
      </div>

      <div className="subtopics-section">
        <h2>Learning Path</h2>
        <div className="subtopics-list">
          {skill.subtopics.map((subtopic, index) => (
            <div key={subtopic.id} className="subtopic-card">
              <div className="subtopic-header">
                <div className="subtopic-info">
                  <span className="subtopic-number">{(index + 1).toString().padStart(2, '0')}</span>
                  <div>
                    <h3>{subtopic.title}</h3>
                    {subtopic.description && (
                      <p className="subtopic-description">{subtopic.description}</p>
                    )}
                    {subtopic.hours_spent > 0 && (
                      <div className="time-spent">
                        <Clock size={14} />
                        <span>{subtopic.hours_spent.toFixed(1)} hours spent</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="subtopic-actions">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(subtopic.status) }}
                  >
                    {getStatusIcon(subtopic.status)}
                    {subtopic.status.replace('-', ' ')}
                  </span>
                  
                  <div className="action-buttons">
                    {subtopic.status !== 'to-learn' && (
                      <button
                        onClick={() => updateSubtopicStatus(subtopic.id, 'to-learn')}
                        disabled={updating}
                        className="btn-outline"
                      >
                        Reset
                      </button>
                    )}
                    {subtopic.status !== 'in-progress' && (
                      <button
                        onClick={() => updateSubtopicStatus(subtopic.id, 'in-progress')}
                        disabled={updating}
                        className="btn-outline"
                      >
                        Start
                      </button>
                    )}
                    {subtopic.status !== 'completed' && (
                      <button
                        onClick={() => updateSubtopicStatus(subtopic.id, 'completed')}
                        disabled={updating}
                        className="btn-primary"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;