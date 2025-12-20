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

  // POST /api/register/ - Register User
  // Payload: nickname, username, password, birthday (optional)
  register: async (data) => {
    const payload = {
      nickname: data.nickname,
      username: data.username,
      password: data.password,
    };
    if (data.birthday) {
      payload.birthday = data.birthday;
    }
    const response = await api.post('/api/register/', payload);
    return response.data;
  },

  // POST /api/otp/ - Request OTP
  // Payload: user (email), used_for (AA, EV, FP)
  requestOTP: async (email, usedFor = 'AA') => {
    const response = await api.post('/api/otp/', {
      user: email,
      used_for: usedFor,
    });
    return response.data;
  },

  // POST /api/otp/verify_otp/ - Verify OTP
  // Payload: code, user (email), used_for
  verifyOTP: async (email, code, usedFor = 'AA') => {
    const response = await api.post('/api/otp/verify_otp/', {
      user: email,
      code: code,
      used_for: usedFor,
    });
    return response.data;
  },

  // POST /api/otp/set_password/ - Set Password (after OTP verification)
  // Payload: user (uuid), new_password, confirm_password
  setPassword: async (userId, newPassword, confirmPassword) => {
    const response = await api.post('/api/otp/set_password/', {
      user: userId,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    return response.data;
  },
};

export default authService;
