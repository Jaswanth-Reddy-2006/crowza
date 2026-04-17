import axios from 'axios';
import { store } from '../../store/store';
import { logoutStaff } from '../../store/slices/staffAuthSlice';
import { auth } from '../firebase/config';

const staffApiClient = axios.create({
  baseURL: 'http://localhost:3000', // API Gateway
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

staffApiClient.interceptors.request.use(
  async (config) => {
    // Sanitize URL to remove accidental spaces (fixes %20 encoding issues)
    if (config.url) {
      config.url = config.url.trim();
    }

    // Get Firebase ID token
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

staffApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // With Firebase, the SDK handles token refresh automatically.
    if (error.response?.status === 401 && !originalRequest._retry) {
      store.dispatch(logoutStaff());
    }
    return Promise.reject(error);
  }
);

export default staffApiClient;
