import api from './api';

export const buyStock = async (stockId, quantity) => {
  return await api.post('/trade/buy', { stockId, quantity });
};

export const sellStock = async (stockId, quantity) => {
  return await api.post('/trade/sell', { stockId, quantity });
};

export const getTransactions = async (page = 1, limit = 10) => {
  return await api.get(`/trade/transactions?page=${page}&limit=${limit}`);
};

export const deleteTransaction = async (id) => {
  return await api.delete(`/trade/transactions/${id}`);
};

export const clearAllTransactions = async () => {
  return await api.delete('/trade/transactions/clear-all');
};
