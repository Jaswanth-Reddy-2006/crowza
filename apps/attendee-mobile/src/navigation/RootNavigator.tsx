/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../utils/hooks';
import { selectIsAuthenticated } from '../selectors';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import AttendeeTabNavigator from './TabNavigator';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventDashboardScreen from '../screens/EventDashboardScreen';

// Venue Feature Screens
import MapScreen from '../screens/MapScreen';
import WaitTimesScreen from '../screens/WaitTimesScreen';
import HeatMapScreen from '../screens/HeatMapScreen';
import EventInfoScreen from '../screens/EventInfoScreen';
import ParkingScreen from '../screens/ParkingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import TicketScreen from '../screens/TicketScreen';
import ExitScreen from '../screens/ExitScreen';

// Profile Sub-screens
import PersonalInfoScreen from '../screens/Profile/PersonalInfoScreen';
import PaymentMethodsScreen from '../screens/Profile/PaymentMethodsScreen';
import NotificationSettingsScreen from '../screens/Profile/NotificationSettingsScreen';
import SecurityPrivacyScreen from '../screens/Profile/SecurityPrivacyScreen';
import HelpSupportScreen from '../screens/Profile/HelpSupportScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={AttendeeTabNavigator} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="EventDashboard" component={EventDashboardScreen} />
            <Stack.Screen name="Ticket" component={TicketScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Wait" component={WaitTimesScreen} />
            <Stack.Screen name="Heat" component={HeatMapScreen} />
            <Stack.Screen name="Info" component={EventInfoScreen} />
            <Stack.Screen name="Park" component={ParkingScreen} />
            <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Exit" component={ExitScreen} options={{ headerShown: false }} />

            {/* Profile Sub-stack */}
            <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <Stack.Screen name="SecurityPrivacy" component={SecurityPrivacyScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
