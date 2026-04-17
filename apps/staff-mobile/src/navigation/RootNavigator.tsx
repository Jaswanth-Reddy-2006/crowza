import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import JoinEventScreen from '../screens/JoinEventScreen';
import StaffTabNavigator from './TabNavigator';
import { useAppSelector } from '../utils/hooks';

import OccupancyManagementScreen from '../screens/OccupancyManagementScreen';
import WaitTimeManagementScreen from '../screens/WaitTimeManagementScreen';
import IncidentManagementScreen from '../screens/IncidentManagementScreen';
import ParkingManagementScreen from '../screens/ParkingManagementScreen';
import RadarIntelligenceScreen from '../screens/RadarIntelligenceScreen';

export type StaffRootStackParamList = {
  StaffLogin: undefined;
  StaffRegister: undefined;
  JoinEvent: undefined;
  StaffMain: undefined;
  Incidents: undefined;
  Parking: undefined;
  WaitTimes: undefined;
  Occupancy: undefined;
  Radar: undefined;
};

const Stack = createStackNavigator<StaffRootStackParamList>();

export default function StaffRootNavigator() {
  const { isAuthenticated, joinedEventId } = useAppSelector((s) => s.staffAuth);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={!isAuthenticated ? 'StaffLogin' : (!joinedEventId ? 'JoinEvent' : 'StaffMain')}
      >
        <Stack.Screen name="StaffLogin" component={LoginScreen} />
        <Stack.Screen name="StaffRegister" component={RegisterScreen} />
        <Stack.Screen name="JoinEvent" component={JoinEventScreen} />
        <Stack.Screen name="StaffMain" component={StaffTabNavigator} />
        
        {/* Operational Modules */}
        <Stack.Screen name="Incidents" component={IncidentManagementScreen} />
        <Stack.Screen name="Parking" component={ParkingManagementScreen} />
        <Stack.Screen name="WaitTimes" component={WaitTimeManagementScreen} />
        <Stack.Screen name="Occupancy" component={OccupancyManagementScreen} />
        <Stack.Screen name="Radar" component={RadarIntelligenceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
