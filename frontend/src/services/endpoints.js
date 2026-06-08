import api from './api';

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export const orderAPI = {
  getPricing: () => api.get('/orders/pricing'),
  calculatePrice: (items) => api.post('/orders/calculate', { items }),
  createRazorpayOrder: (items) => api.post('/orders/create-razorpay-order', { items }),
  verifyPayment: (data) => api.post('/orders/verify-payment', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const inventoryAPI = {
  getInventory: (category) => api.get('/inventory', { params: { category } }),
  getInventoryItem: (id) => api.get(`/inventory/${id}`),
  createInventoryItem: (data) => api.post('/inventory', data),
  updateInventoryItem: (id, data) => api.put(`/inventory/${id}`, data),
  deleteInventoryItem: (id) => api.delete(`/inventory/${id}`),
  restockItem: (id, quantity, note) => api.put(`/inventory/${id}/restock`, { quantity, note }),
  getTransactions: (params) => api.get('/inventory/transactions', { params }),
  getAnalytics: () => api.get('/inventory/analytics'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
};