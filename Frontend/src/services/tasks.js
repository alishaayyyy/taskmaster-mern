import API from './api.js';

export const taskService = {
  async getAllTasks() {
    const response = await API.get('/tasks/gp');
    return response.data;
  },

  async createTask(taskData) {
    const response = await API.post('/tasks/gp', taskData);
    return response.data;
  },

  async getTaskById(id) {
    const response = await API.get(`/tasks/${id}/gp`);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await API.put(`/tasks/${id}/gp`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    const response = await API.delete(`/tasks/${id}/gp`);
    return response.data;
  }
};