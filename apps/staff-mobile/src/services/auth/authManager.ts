/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import { store } from '../../store/store';
import { logoutStaff } from '../../store/slices/staffAuthSlice';
import { tokenManager } from './tokenManager';
import staffApiClient from '../api/staffApiClient';

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
      const response = await staffApiClient.post('/auth/refresh-token', { refreshToken });
      const { token: newToken, refreshToken: newRefresh, expiresIn } = response.data.data;
      await tokenManager.storeTokens(newToken, newRefresh, expiresIn * 1000);
      this.scheduleRefresh();
    } catch {
      store.dispatch(logoutStaff());
      await tokenManager.clearTokens();
    }
  },

  scheduleRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(async () => {
      const refreshToken = await tokenManager.getRefreshToken();
      if (refreshToken) await this.refreshSession(refreshToken);
    }, 55 * 60 * 1000);
  },

  async logout() {
    if (refreshTimer) clearTimeout(refreshTimer);
    await tokenManager.clearTokens();
    store.dispatch(logoutStaff());
  },
};
