import api from './api';

export const getWatchlist = async () => {
  return await api.get('/watchlist');
};

export const addToWatchlist = async (stockId) => {
  return await api.post('/watchlist/add', { stockId });
};

export const removeFromWatchlist = async (stockId) => {
  return await api.delete(`/watchlist/remove/${stockId}`);
};
