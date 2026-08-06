import api from './api';

export const getStocks = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await api.get(`/stocks?${query}`);
};

export const getStockById = async (id) => {
  return await api.get(`/stocks/${id}`);
};

export const createStock = async (stockData) => {
  return await api.post('/stocks', stockData);
};

export const updateStock = async (id, stockData) => {
  return await api.put(`/stocks/${id}`, stockData);
};

export const deleteStock = async (id) => {
  return await api.delete(`/stocks/${id}`);
};
