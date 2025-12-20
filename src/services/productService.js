import api from './api';

const productService = {
  // GET /api/payments/products/ - List Products
  // Params: page, page_size, search
  getProducts: async (params = {}) => {
    const response = await api.get('/api/payments/products/', { params });
    return response.data;
  },

  // POST /api/payments/products/ - Create Product
  createProduct: async (data) => {
    const response = await api.post('/api/payments/products/', data);
    return response.data;
  },

  // GET /api/payments/products/{id}/ - Get Product by ID
  getProductById: async (id) => {
    const response = await api.get(`/api/payments/products/${id}/`);
    return response.data;
  },

  // PUT /api/payments/products/{id}/ - Update Product
  updateProduct: async (id, data) => {
    const response = await api.put(`/api/payments/products/${id}/`, data);
    return response.data;
  },

  // PATCH /api/payments/products/{id}/ - Partial Update Product
  patchProduct: async (id, data) => {
    const response = await api.patch(`/api/payments/products/${id}/`, data);
    return response.data;
  },

  // DELETE /api/payments/products/{id}/ - Delete Product
  deleteProduct: async (id) => {
    const response = await api.delete(`/api/payments/products/${id}/`);
    return response.data;
  },

  // POST /api/payments/products/{id}/checkout-session/ - Checkout Session
  createCheckoutSession: async (id, data = {}) => {
    const response = await api.post(`/api/payments/products/${id}/checkout-session/`, data);
    return response.data;
  },
};

export default productService;
