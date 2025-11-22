// src/services/skillService.js
import api from './api'; // adjust path if your api file is located elsewhere

const skillService = {
  // Create a skill (AddSkillModal should send user_subtopics)
  createSkill: (payload) => api.post('/skills', payload),

  // Get skill detail
  getSkillDetail: (skillId) => api.get(`/skills/${skillId}`),

  // Update subtopic status (in-progress / completed)
  // Uses a PUT to /skills/subtopics/:id/status with body { status: 'in-progress' }
  updateSubtopicStatus: (subtopicId, status) =>
    api.put(`/skills/subtopics/${subtopicId}/status`, { status }),

  // Add learning session: { skill_id, subtopic_id (optional), duration_minutes, notes, session_date (optional) }
  addLearningSession: (sessionPayload) => api.post('/sessions', sessionPayload),

  // Get all skills (if needed)
  getUserSkills: () => api.get('/skills'),

  deleteSkill: (skillId) => api.delete(`/skills/${skillId}`),

};

export default skillService;
