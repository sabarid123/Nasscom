import api from './api';

export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const logout = async () => {
  return await api.post('/auth/logout');
};

export const getMe = async () => {
  return await api.get('/auth/me');
};

export const updateProfile = async (profileData) => {
  return await api.put('/users/profile', profileData);
};

export const addFunds = async (amount) => {
  return await api.post('/users/add-funds', { amount });
};

export const changePassword = async (passwords) => {
  return await api.put('/auth/change-password', passwords);
};
