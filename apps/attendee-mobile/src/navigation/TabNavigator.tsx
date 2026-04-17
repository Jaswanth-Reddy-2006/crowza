/**
 * Complete Working Tab Navigator
 * All screens properly connected and functional
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@crowza/design-system';

// Import all screens
import AdvancedHomeScreen from '../screens/AdvancedHomeScreen';
import EventDashboardScreen from '../screens/EventDashboardScreen';
import QueuePredictionScreen from '../screens/QueuePredictionScreen';
import HeatMapScreen from '../screens/HeatMapScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

/**
 * Complete Attendee Tab Navigator
 * All buttons work, all screens are functional
 */
export default function AttendeeTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
        },
        headerTitleStyle: {
          fontWeight: '700',
          color: theme.colors.onSurface,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      })}
    >
      {/* Home Screen - Advanced Navigation */}
      <Tab.Screen
        name="Home"
        component={AdvancedHomeScreen}
        options={{
          title: '🎯 Navigator',
          tabBarLabel: 'Navigate',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} />,
          headerTitle: '🎯 Smart Navigation',
        }}
      />

      {/* Events Screen */}
      <Tab.Screen
        name="Events"
        component={EventDashboardScreen}
        options={{
          title: '📅 Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
          headerTitle: '📅 Available Events',
        }}
      />

      {/* Queue Prediction Screen */}
      <Tab.Screen
        name="Queues"
        component={QueuePredictionScreen}
        options={{
          title: '⏱️ Queues',
          tabBarLabel: 'Queues',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="timer-sand" size={size} color={color} />,
          headerTitle: '⏱️ Queue Predictions',
        }}
      />

      {/* Crowd Heatmap */}
      <Tab.Screen
        name="Crowd"
        component={HeatMapScreen}
        options={{
          title: '📊 Crowd Map',
          tabBarLabel: 'Crowd',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="heatmap" size={size} color={color} />,
          headerTitle: '📊 Crowd Heatmap',
        }}
      />

      {/* Profile Screen */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '👤 Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          headerTitle: '👤 My Profile',
        }}
      />
    </Tab.Navigator>
  );
}
