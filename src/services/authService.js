import api from './api';

const authService = {
  // POST /api/auth/token/ - Login
  login: async (email, password) => {
    const response = await api.post('/api/auth/token/', { username: email, password });
    const { access, refresh } = response.data;

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('isLoggedIn', 'true');

    return response.data;
  },

  // POST /api/auth/token/refresh/ - Refresh Token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/api/auth/token/refresh/', { refresh: refreshToken });
    const { access } = response.data;

    localStorage.setItem('accessToken', access);

    return response.data;
  },

  // GET /api/auth/logout/ - Logout
  logout: async () => {
    try {
      await api.get('/api/auth/logout/');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Get access token
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },
};

export default authService;
