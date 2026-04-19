/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import { store } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { auth } from '../firebase/config';

const attendeeApiClient = axios.create({
  baseURL: 'http://localhost:3000', // API Gateway
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

attendeeApiClient.interceptors.request.use(
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

attendeeApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // With Firebase, the SDK handles token refresh automatically.
    // If we get a 401, it usually means the user is truly unauthorized.
    if (error.response?.status === 401 && !originalRequest._retry) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default attendeeApiClient;
