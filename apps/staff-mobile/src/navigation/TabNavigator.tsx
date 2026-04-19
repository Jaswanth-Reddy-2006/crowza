import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { theme } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../utils/hooks';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import EventsHistoryScreen from '../screens/EventsHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TasksScreen from '../screens/TasksScreen';
import RadarIntelligenceScreen from '../screens/RadarIntelligenceScreen';

export type StaffTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Radar: undefined;
  Events: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<StaffTabParamList>();

export default function StaffTabNavigator() {
  const { joinedEventId } = useAppSelector((state) => state.staffAuth);

  const screenOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.outline,
    tabBarStyle: {
      backgroundColor: '#FFFFFF',
      borderTopColor: '#F3F4F6',
      borderTopWidth: 1,
      height: Platform.OS === 'ios' ? 92 : 72,
      paddingBottom: Platform.OS === 'ios' ? 32 : 12,
      paddingTop: 12,
      elevation: 20,
      shadowColor: '#1C1B1B',
      shadowOffset: { width: 0, height: -10 },
      shadowOpacity: 0.05,
      shadowRadius: 15,
    },
    tabBarLabelStyle: { 
      fontSize: 10, 
      fontWeight: '800',
      marginTop: 4,
      letterSpacing: 0.5,
    },
    headerShown: false,
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {joinedEventId ? (
        <>
          <Tab.Screen
            name="Home"
            component={DashboardScreen}
            options={{ 
              tabBarLabel: 'MISSION',
              tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "flash" : "flash-outline"} size={size} color={color} /> 
            }}
          />
          <Tab.Screen
            name="Tasks"
            component={TasksScreen}
            options={{ 
              tabBarLabel: 'WORKLIST',
              tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "list-circle" : "list-circle-outline"} size={size} color={color} /> 
            }}
          />
          <Tab.Screen
            name="Radar"
            component={RadarIntelligenceScreen}
            options={{ 
              tabBarLabel: 'STADIUM MAP',
              tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "map" : "map-outline"} size={size} color={color} /> 
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={DashboardScreen}
            options={{ 
              tabBarLabel: 'HOME',
              tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} /> 
            }}
          />
          <Tab.Screen
            name="Events"
            component={EventsHistoryScreen}
            options={{ 
              tabBarLabel: 'ARCHIVE',
              tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} /> 
            }}
          />
        </>
      )}

      <Tab.Screen
        name="Profile"
        component={SettingsScreen}
        options={{ 
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} /> 
        }}
      />
    </Tab.Navigator>
  );
}
