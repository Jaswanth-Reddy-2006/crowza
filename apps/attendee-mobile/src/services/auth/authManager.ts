import { store } from '../../store/store';
import { loginWithEmail, logout } from '../../store/slices/authSlice';
import { tokenManager } from './tokenManager';
import attendeeApiClient from '../api/attendeeApiClient';

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export const authManager = {
  async initialize() {
    const token = await tokenManager.getToken();
    const refreshToken = await tokenManager.getRefreshToken();

    if (!token || !refreshToken) return;

    const expiringSoon = await tokenManager.isTokenExpiringSoon();
    if (expiringSoon) {
      await this.refreshSession(refreshToken);
    } else {
      this.scheduleRefresh();
    }
  },

  async refreshSession(refreshToken: string) {
    try {
      const response = await attendeeApiClient.post('/auth/refresh-token', { refreshToken });
      const { token: newToken, refreshToken: newRefresh, expiresIn } = response.data.data;
      await tokenManager.storeTokens(newToken, newRefresh, expiresIn * 1000);
      this.scheduleRefresh();
    } catch {
      store.dispatch(logout());
      await tokenManager.clearTokens();
    }
  },

  scheduleRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    // Refresh 5 minutes before expiry — poll check every 60s
    refreshTimer = setTimeout(async () => {
      const refreshToken = await tokenManager.getRefreshToken();
      if (refreshToken) await this.refreshSession(refreshToken);
    }, 55 * 60 * 1000); // 55 minutes
  },

  async logout() {
    if (refreshTimer) clearTimeout(refreshTimer);
    await tokenManager.clearTokens();
    store.dispatch(logout());
  },
};
