import api from './api';

export const getPortfolio = async () => {
  return await api.get('/portfolio');
};
