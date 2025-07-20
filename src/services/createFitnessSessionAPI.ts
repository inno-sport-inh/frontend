import apiRequest from './api';

export const createFitnessSessionAPI = {
  createSession: async (semester_id: number, retake: boolean = false) => {
    // Для создания сессии используем upload с пустым results
    return apiRequest('/fitness-test/upload', {
      method: 'POST',
      body: JSON.stringify({
        semester_id,
        retake,
        results: []
      })
    });
  }
};
