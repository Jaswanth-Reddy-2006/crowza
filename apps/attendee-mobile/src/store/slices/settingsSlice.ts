/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
  accessibilityEnabled: boolean;
}

const initialState: SettingsState = {
  theme: 'dark',
  language: 'en',
  notificationsEnabled: true,
  accessibilityEnabled: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    setAccessibility: (state, action: PayloadAction<boolean>) => {
      state.accessibilityEnabled = action.payload;
    },
  },
});

export const { setTheme, setLanguage, toggleNotifications, setAccessibility } = settingsSlice.actions;
export default settingsSlice.reducer;
