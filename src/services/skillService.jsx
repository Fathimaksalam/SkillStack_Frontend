import api from "./api";

const skillService = {
  createSkill: (payload) => api.post("/skills", payload),

  getUserSkills: () => api.get("/skills"),

  getSkillDetail: (skillId) => api.get(`/skills/${skillId}`),

  updateSubtopicStatus: (subtopicId, status) =>
    api.put(`/skills/subtopics/${subtopicId}/status`, { status }),

  addLearningSession: (sessionPayload) =>
    api.post(`/skills/learning-sessions`, sessionPayload),

  completeSkill: (skillId, payload) =>
    api.post(`/skills/${skillId}/complete`, payload),

  deleteSkill: (skillId) => api.delete(`/skills/${skillId}`),
};

export default skillService;
