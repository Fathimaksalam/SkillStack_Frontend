import api from './api';

export const skillService = {
  // Skills
  getSkills: () => api.get('/skills'),
  createSkill: (skillData) => api.post('/skills', skillData),
  getSkillDetail: (skillId) => api.get(`/skills/${skillId}`),
  
  // Subtopics
  updateSubtopicStatus: (subtopicId, status) => 
    api.put(`/skills/subtopics/${subtopicId}/status`, { status }),
  
  // Learning Sessions
  addLearningSession: (sessionData) => 
    api.post('/skills/learning-sessions', sessionData),
};