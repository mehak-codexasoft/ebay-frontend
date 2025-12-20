import api from './api';

const landmarkService = {
  // GET /api/landmarks/ - List Landmarks
  // Params: page, page_size, search, city, travel
  getLandmarks: async (params = {}) => {
    const response = await api.get('/api/landmarks/', { params });
    return response.data;
  },

  // POST /api/landmarks/ - Create Landmark
  createLandmark: async (data, isFormData = false) => {
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/api/landmarks/', data, config);
    return response.data;
  },

  // GET /api/landmarks/{id}/ - Get Landmark by ID
  getLandmarkById: async (id) => {
    const response = await api.get(`/api/landmarks/${id}/`);
    return response.data;
  },

  // PUT /api/landmarks/{id}/ - Update Landmark
  updateLandmark: async (id, data) => {
    const response = await api.put(`/api/landmarks/${id}/`, data);
    return response.data;
  },

  // PATCH /api/landmarks/{id}/ - Partial Update Landmark
  patchLandmark: async (id, data, isFormData = false) => {
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.patch(`/api/landmarks/${id}/`, data, config);
    return response.data;
  },

  // DELETE /api/landmarks/{id}/ - Delete Landmark
  deleteLandmark: async (id) => {
    const response = await api.delete(`/api/landmarks/${id}/`);
    return response.data;
  },

  // GET /api/landmarks/{id}/like/ - Like Landmark
  likeLandmark: async (id) => {
    const response = await api.get(`/api/landmarks/${id}/like/`);
    return response.data;
  },

  // GET /api/landmarks/{id}/unlike/ - Unlike Landmark
  unlikeLandmark: async (id) => {
    const response = await api.get(`/api/landmarks/${id}/unlike/`);
    return response.data;
  },

  // PATCH /api/landmarks/{id}/rate/ - Rate Landmark
  rateLandmark: async (id, rating) => {
    const response = await api.patch(`/api/landmarks/${id}/rate/`, { rating });
    return response.data;
  },

  // GET /api/landmarks/{id}/mark-swiped/ - Mark Swiped
  markSwiped: async (id) => {
    const response = await api.get(`/api/landmarks/${id}/mark-swiped/`);
    return response.data;
  },

  // GET /api/landmarks/map-landmarks/ - Get Map Landmarks
  getMapLandmarks: async () => {
    const response = await api.get('/api/landmarks/map-landmarks/');
    return response.data;
  },
};

export default landmarkService;
