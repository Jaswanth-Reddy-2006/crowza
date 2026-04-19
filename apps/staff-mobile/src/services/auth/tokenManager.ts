/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@staff_auth_token';
const REFRESH_TOKEN_KEY = '@staff_refresh_token';
const TOKEN_EXPIRY_KEY = '@staff_token_expiry';

export const tokenManager = {
  async storeTokens(token: string, refreshToken: string, expiresInMs: number) {
    const expiry = Date.now() + expiresInMs;
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async isTokenExpiringSoon(): Promise<boolean> {
    const expiry = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    const expiryMs = parseInt(expiry, 10);
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() >= expiryMs - fiveMinutes;
  },

  async clearTokens() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(TOKEN_EXPIRY_KEY);
  },
};
