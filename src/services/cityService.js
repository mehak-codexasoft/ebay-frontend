import api from './api';

const cityService = {
  // GET /api/cities/ - List Cities
  // Params: page, page_size, search
  getCities: async (params = {}) => {
    const response = await api.get('/api/cities/', { params });
    return response.data;
  },

  // GET /api/cities/{id}/ - Get City by ID
  getCityById: async (id) => {
    const response = await api.get(`/api/cities/${id}/`);
    return response.data;
  },
};

export default cityService;
