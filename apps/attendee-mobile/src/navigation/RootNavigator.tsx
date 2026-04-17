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
import ExitScreen from '../screens/ExitScreen';

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
            <Stack.Screen name="Payment" component={PaymentScreen} />
            
            <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: true, title: 'Venue Map', headerBackTitle: 'Back' }} />
            <Stack.Screen name="Wait" component={WaitTimesScreen} options={{ headerShown: true, title: 'Wait Times', headerBackTitle: 'Back' }} />
            <Stack.Screen name="Heat" component={HeatMapScreen} options={{ headerShown: true, title: 'Crowd Heatmap', headerBackTitle: 'Back' }} />
            <Stack.Screen name="Info" component={EventInfoScreen} options={{ headerShown: true, title: 'Event Info', headerBackTitle: 'Back' }} />
            <Stack.Screen name="Park" component={ParkingScreen} options={{ headerShown: true, title: 'Parking', headerBackTitle: 'Back' }} />
            <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Exit" component={ExitScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
