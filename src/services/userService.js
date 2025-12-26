import api from './api';

const userService = {
  // GET /api/users/ - List Users
  // Params: page, page_size, search
  getUsers: async (params = {}) => {
    const response = await api.get('/api/users/', { params });
    return response.data;
  },

  // GET /api/users/{id}/ - Get User by ID
  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}/`);
    return response.data;
  },

  // PUT /api/users/{id}/ - Update User
  // Payload: nickname, email, username, birthday, country, role
  updateUser: async (id, data) => {
    const payload = {
      nickname: data.nickname,
      email: data.email,
      username: data.username,
      birthday: data.birthday || null,
      country: data.country || null,
      role: data.role,
    };
    const response = await api.put(`/api/users/${id}/`, payload);
    return response.data;
  },

  // PATCH /api/users/{id}/ - Partial Update User
  patchUser: async (id, data) => {
    const response = await api.patch(`/api/users/${id}/`, data);
    return response.data;
  },

  // DELETE /api/users/{id}/ - Delete User
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}/`);
    return response.data;
  },

  // GET /api/users/me/ - Get Current User
  getCurrentUser: async () => {
    const response = await api.get('/api/users/me/');
    return response.data;
  },

  // POST /api/users/change_password/ - Change Password
  // Payload: current_password, new_password, confirm_password
  changePassword: async (data) => {
    const payload = {
      current_password: data.current_password,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    };
    const response = await api.post('/api/users/change_password/', payload);
    return response.data;
  },

  // GET /api/users/{id}/followers/ - Get Followers
  getFollowers: async (id) => {
    const response = await api.get(`/api/users/${id}/followers/`);
    return response.data;
  },

  // GET /api/users/{id}/following/ - Get Following
  getFollowing: async (id) => {
    const response = await api.get(`/api/users/${id}/following/`);
    return response.data;
  },

  // POST /api/users/follow/ - Follow User
  // Payload: id (uuid of user to follow)
  followUser: async (userId) => {
    const response = await api.post('/api/users/follow/', { id: userId });
    return response.data;
  },

  // POST /api/users/unfollow/ - Unfollow User
  // Payload: id (uuid of user to unfollow)
  unfollowUser: async (userId) => {
    const response = await api.post('/api/users/unfollow/', { id: userId });
    return response.data;
  },

  // GET /api/users/delete-account/ - Delete Account
  deleteAccount: async () => {
    const response = await api.get('/api/users/delete-account/');
    return response.data;
  },
};

export default userService;
