import api from './api';

const tripService = {
  // GET /api/trips/ - List Trips
  // Params: page, page_size, search
  getTrips: async (params = {}) => {
    const response = await api.get('/api/trips/', { params });
    return response.data;
  },

  // POST /api/trips/ - Create Trip
  createTrip: async (data) => {
    const response = await api.post('/api/trips/', data);
    return response.data;
  },

  // GET /api/trips/{id}/ - Get Trip by ID
  getTripById: async (id) => {
    const response = await api.get(`/api/trips/${id}/`);
    return response.data;
  },

  // PUT /api/trips/{id}/ - Update Trip
  updateTrip: async (id, data) => {
    const response = await api.put(`/api/trips/${id}/`, data);
    return response.data;
  },

  // PATCH /api/trips/{id}/ - Partial Update Trip
  patchTrip: async (id, data) => {
    const response = await api.patch(`/api/trips/${id}/`, data);
    return response.data;
  },

  // DELETE /api/trips/{id}/ - Delete Trip
  deleteTrip: async (id) => {
    const response = await api.delete(`/api/trips/${id}/`);
    return response.data;
  },

  // GET /api/trips/{id}/get_landmarks/ - Get Trip Landmarks
  getTripLandmarks: async (id) => {
    const response = await api.get(`/api/trips/${id}/get_landmarks/`);
    return response.data;
  },

  // POST /api/trips/{id}/copy_trip/ - Copy Trip
  copyTrip: async (id) => {
    const response = await api.post(`/api/trips/${id}/copy_trip/`);
    return response.data;
  },

  // POST /api/trips/add_landmarks/ - Add Landmarks to Trip
  addLandmarksToTrip: async (data) => {
    const response = await api.post('/api/trips/add_landmarks/', data);
    return response.data;
  },

  // POST /api/trips/check_trip/ - Check Trip
  checkTrip: async (data) => {
    const response = await api.post('/api/trips/check_trip/', data);
    return response.data;
  },

  // GET /api/trips/landmarks/{id}/ - Get Trip Landmark
  getTripLandmark: async (id) => {
    const response = await api.get(`/api/trips/landmarks/${id}/`);
    return response.data;
  },

  // PATCH /api/trips/landmarks/{id}/ - Update Trip Landmark
  updateTripLandmark: async (id, data) => {
    const response = await api.patch(`/api/trips/landmarks/${id}/`, data);
    return response.data;
  },

  // DELETE /api/trips/landmarks/{id}/ - Delete Trip Landmark
  deleteTripLandmark: async (id) => {
    const response = await api.delete(`/api/trips/landmarks/${id}/`);
    return response.data;
  },
};

export default tripService;
