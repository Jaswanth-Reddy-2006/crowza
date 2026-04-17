/**
 * NotificationBanner Component
 * System-wide notification display at top of app
 * Handles event reminders, queue updates, crowd warnings, etc.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, theme } from '@crowza/design-system';
import { LinearGradient } from 'expo-linear-gradient';

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
  duration?: number; // ms, 0 = persistent
}

interface Props {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
}

export function NotificationBanner({ notifications, onDismiss }: Props) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>(notifications);
  const slideAnim = new Animated.Value(-100);

  // Sample notifications for demo
  const defaultNotifications: Notification[] = [
    {
      id: 'demo-1',
      type: 'event-reminder',
      title: 'Event Starting Soon',
      message: 'Main Concert starts in 15 minutes at Main Hall',
      icon: 'calendar',
      color: '#2196F3',
      backgroundColor: '#E3F2FD',
      duration: 0,
    },
    {
      id: 'demo-2',
      type: 'queue-update',
      title: 'Queue Alert',
      message: 'Food Court wait time: 18 min (was 25 min)',
      icon: 'hourglass',
      color: '#FF9800',
      backgroundColor: '#FFF3E0',
      duration: 5000,
    },
    {
      id: 'demo-3',
      type: 'crowd-warning',
      title: 'Zone Alert',
      message: 'Main Hall is at 85% capacity - crowded',
      icon: 'warning',
      color: '#FF5252',
      backgroundColor: '#FFEBEE',
      duration: 0,
    },
  ];

  const notificationsToShow = notifications.length > 0 ? notifications : defaultNotifications;

  useEffect(() => {
    if (notificationsToShow.length > 0) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss notifications with duration
      const timers = notificationsToShow
        .filter((n) => n.duration && n.duration > 0)
        .map((n) =>
          setTimeout(() => {
            handleDismiss(n.id);
          }, n.duration)
        );

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [notificationsToShow]);

  const handleDismiss = (id: string) => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
      onDismiss?.(id);
    });
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  // Show only the first notification
  const notification = visibleNotifications[0];
  const unreadCount = visibleNotifications.length - 1;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[notification.backgroundColor, notification.backgroundColor + 'DD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.notificationContent}
      >
        <View style={[styles.iconContainer, { borderLeftColor: notification.color }]}>
          <Ionicons name={notification.icon as any} size={20} color={notification.color} />
        </View>

        <View style={styles.textContainer}>
          <Typography variant="labelSmall" weight="600" color={notification.color}>
            {notification.title}
          </Typography>
          <Typography variant="bodySmall" color={theme.colors.onSurfaceVariant}>
            {notification.message}
          </Typography>
        </View>

        <View style={styles.actionContainer}>
          {notification.action && (
            <TouchableOpacity
              onPress={notification.action.onPress}
              style={styles.actionButton}
            >
              <Typography variant="labelSmall" weight="700" color={notification.color}>
                {notification.action.label}
              </Typography>
            </TouchableOpacity>
          )}

          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: notification.color }]}>
              <Typography variant="labelSmall" weight="700" color="white">
                {unreadCount}+
              </Typography>
            </View>
          )}

          {notification.dismissible !== false && (
            <TouchableOpacity
              onPress={() => handleDismiss(notification.id)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={18} color={notification.color} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 10,
    zIndex: 1000,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  iconContainer: {
    borderLeftWidth: 4,
    paddingLeft: 8,
  },
  textContainer: {
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  closeButton: {
    padding: 4,
  },
});
