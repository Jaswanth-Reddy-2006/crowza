/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
/**
 * Redux Slice for Notifications
 * Manages notification state and history
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'event-reminder' | 'queue-update' | 'crowd-warning' | 'system' | 'booking';
  title: string;
  message: string;
  icon: string;
  color: string;
  backgroundColor: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  dismissible?: boolean;
  duration?: number;
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
  history: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  history: [],
  unreadCount: 0,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        timestamp: Date.now(),
      };
      state.notifications.unshift(notification);
      state.history.unshift(notification);
      state.unreadCount += 1;

      // Limit notifications array to 50 items
      if (state.notifications.length > 50) {
        state.notifications.pop();
      }
    },

    dismissNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },

    dismissAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    clearHistory: (state) => {
      state.history = [];
    },

    markAsRead: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  dismissNotification,
  dismissAllNotifications,
  clearHistory,
  markAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
