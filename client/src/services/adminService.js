import api from './api';

export const getAdminAnalytics = async () => {
  return await api.get('/admin/analytics');
};

export const getUsers = async (page = 1, limit = 10) => {
  return await api.get(`/admin/users?page=${page}&limit=${limit}`);
};

export const updateUserStatus = async (id, statusData) => {
  return await api.put(`/admin/users/${id}`, statusData);
};

export const deleteUser = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};

export const getAllTransactions = async (page = 1, limit = 10) => {
  return await api.get(`/admin/transactions?page=${page}&limit=${limit}`);
};
