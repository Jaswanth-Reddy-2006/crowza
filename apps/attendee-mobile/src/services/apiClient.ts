import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  if (config.url) {
    config.url = config.url.trim();
  }
  return config;
});

export default apiClient;
