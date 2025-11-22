import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillService } from '../../services/skillService';
import AddSkillModal from './AddSkillModal';
import { Plus, BookOpen, Clock, Target } from 'lucide-react';
import '../../styles/SkillsList.css'

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="skills-loading">
        <div className="loading-spinner large"></div>
        <p>Loading your skills...</p>
      </div>
    );
  }

  return (
    <div className="skills-page">
      <div className="page-header">
        <div className="header-content">
          <h1>My Skills</h1>
          <p>Manage and track all your learning skills</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddSkill(true)}
        >
          <Plus size={20} />
          Add New Skill
        </button>
      </div>

      <div className="skills-grid">
        {skills.map(skill => (
          <div key={skill.id} className="skill-card">
            <div className="skill-header">
              <div className="skill-title">
                <BookOpen size={20} />
                <h3>{skill.name}</h3>
              </div>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(skill.status) }}
              >
                {skill.status.replace('-', ' ')}
              </span>
            </div>
            
            <div className="skill-details">
              <div className="detail-item">
                <span className="label">Platform:</span>
                <span>{skill.platform}</span>
              </div>
              <div className="detail-item">
                <span className="label">Type:</span>
                <span>{skill.resource_type}</span>
              </div>
              <div className="detail-item">
                <span className="label">Category:</span>
                <span className="category-tag">{skill.category}</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Progress</span>
                <span style={{ color: getProgressColor(skill.progress) }}>
                  {skill.progress}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${skill.progress}%`,
                    backgroundColor: getProgressColor(skill.progress)
                  }}
                ></div>
              </div>
              <div className="progress-stats">
                <div className="stat">
                  <Target size={14} />
                  <span>{skill.completed_subtopics}/{skill.total_subtopics} topics</span>
                </div>
                {skill.target_hours > 0 && (
                  <div className="stat">
                    <Clock size={14} />
                    <span>{skill.target_hours}h target</span>
                  </div>
                )}
              </div>
            </div>

            <div className="skill-actions">
              <Link to={`/skills/${skill.id}`} className="btn-primary">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="empty-state">
          <BookOpen size={64} className="empty-icon" />
          <h3>No skills yet</h3>
          <p>Start your learning journey by adding your first skill!</p>
          <button 
            className="btn-primary"
            onClick={() => setShowAddSkill(true)}
          >
            <Plus size={20} />
            Add Your First Skill
          </button>
        </div>
      )}

      {showAddSkill && (
        <AddSkillModal 
          onClose={() => setShowAddSkill(false)}
          onSkillAdded={fetchSkills}
        />
      )}
    </div>
  );
};

export default SkillsList;