import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform } from 'react-native';
import { theme } from '@crowza/design-system';

import DashboardScreen from '../screens/DashboardScreen';
import { TaskAssignmentScreen } from '../screens/TaskAssignmentScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen'; // To be refactored to Radar
import SettingsScreen from '../screens/SettingsScreen'; // To be refactored to Profile
import { Ionicons } from '@expo/vector-icons';

export type StaffTabParamList = {
  Dashboard: undefined;
  Radar: undefined;
  Tasks: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<StaffTabParamList>();

export default function StaffTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: { 
          fontSize: 11, 
          fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Roboto',
          fontWeight: '600',
          marginTop: 2
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> 
        }}
      />
      <Tab.Screen
        name="Radar"
        component={AnalyticsScreen}
        options={{ 
          tabBarLabel: 'Radar',
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse-outline" size={size} color={color} /> 
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskAssignmentScreen}
        options={{ 
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} /> 
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsScreen}
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} /> 
        }}
      />
    </Tab.Navigator>
  );
}
