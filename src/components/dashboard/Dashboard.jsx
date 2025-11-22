import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { skillService } from '../../services/skillService';
import AddSkillModal from '../skills/AddSkillModal';
import { 
  BookOpen, Clock, Target, TrendingUp, 
  Calendar, BarChart3, Plus 
} from 'lucide-react';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner large"></div>
        <p>Loading your learning dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>Error loading dashboard</div>;
  }

  const { stats, recent_activities, skills_progress, category_breakdown, calendar_data } = dashboardData;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Learning Dashboard</h1>
          <p>Track your skill development progress</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddSkill(true)}
        >
          <Plus size={20} />
          Add New Skill
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Skills</h3>
            <p className="stat-number">{stats.total_skills}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">{stats.completed_skills}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>Learning Time</h3>
            <p className="stat-number">{stats.total_learning_hours}h</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Completion Rate</h3>
            <p className="stat-number">{stats.completion_rate}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Skills Progress */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Skills Progress</h2>
            <Link to="/skills" className="view-all">View All</Link>
          </div>
          <div className="skills-progress">
            {skills_progress.slice(0, 5).map(skill => (
              <div key={skill.id} className="progress-item">
                <div className="progress-header">
                  <h4>{skill.name}</h4>
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
                <div className="progress-details">
                  <span className="category-tag">{skill.category}</span>
                  <span>
                    {skill.completed_subtopics} / {skill.total_subtopics} topics
                  </span>
                  <Link to={`/skills/${skill.id}`} className="view-details">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities & Categories */}
        <div className="dashboard-columns">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Activities</h2>
            </div>
            <div className="activities-list">
              {recent_activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    <Clock size={16} />
                  </div>
                  <div className="activity-content">
                    <strong>{activity.skill_name}</strong>
                    {activity.subtopic_title && ` - ${activity.subtopic_title}`}
                    <div className="activity-meta">
                      <span>{activity.duration_minutes} minutes</span>
                      <span>•</span>
                      <span>{new Date(activity.session_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Categories</h2>
            </div>
            <div className="categories-list">
              {Object.entries(category_breakdown).map(([category, count]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{count} skills</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddSkill && (
        <AddSkillModal 
          onClose={() => setShowAddSkill(false)}
          onSkillAdded={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default Dashboard;