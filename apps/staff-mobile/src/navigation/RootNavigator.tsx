/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '@crowza/design-system';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StaffTabNavigator from './TabNavigator';
import { useAppSelector } from '../utils/hooks';

import OccupancyManagementScreen from '../screens/OccupancyManagementScreen';
import WaitTimeManagementScreen from '../screens/WaitTimeManagementScreen';
import IncidentManagementScreen from '../screens/IncidentManagementScreen';
import ParkingManagementScreen from '../screens/ParkingManagementScreen';
import RadarIntelligenceScreen from '../screens/RadarIntelligenceScreen';
import JoinEventScreen from '../screens/JoinEventScreen';

export type StaffRootStackParamList = {
  StaffLogin: undefined;
  StaffRegister: undefined;
  StaffMain: undefined;
  Incidents: undefined;
  Parking: undefined;
  WaitTimes: undefined;
  Occupancy: undefined;
  Radar: undefined;
  JoinEvent: undefined;
};

const Stack = createStackNavigator<StaffRootStackParamList>();

export default function StaffRootNavigator() {
  const { isAuthenticated, joinedEventId } = useAppSelector((s) => s.staffAuth);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="StaffLogin" component={LoginScreen} />
            <Stack.Screen name="StaffRegister" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="StaffMain" component={StaffTabNavigator} />
            <Stack.Screen name="JoinEvent" component={JoinEventScreen} />
            
            {/* Operational Modules - Headers Enabled for Back Navigation */}
            <Stack.Screen name="Incidents" component={IncidentManagementScreen} options={{ headerShown: true, title: 'INCIDENT COMMAND' }} />
            <Stack.Screen name="Parking" component={ParkingManagementScreen} options={{ headerShown: true, title: 'TRAFFIC CONTROL' }} />
            <Stack.Screen name="WaitTimes" component={WaitTimeManagementScreen} options={{ headerShown: true, title: 'FLOW ANALYTICS' }} />
            <Stack.Screen name="Occupancy" component={OccupancyManagementScreen} options={{ headerShown: true, title: 'OCCUPANCY MONITOR' }} />
            <Stack.Screen name="Radar" component={RadarIntelligenceScreen} options={{ headerShown: true, title: 'MISSION RADAR' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
