/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, theme } from '@crowza/design-system';

// Data and Types
import { 
  VENUE_DESTINATIONS, 
  TRANSPORT_OPTIONS, 
  NavigationOption, 
  VenueLocation 
} from '../data/venueData';

// Modular Components
import { HomeHeader } from './Home/components/HomeHeader';
import { NavigationUI } from './Home/components/NavigationUI';
import { DestinationGrid } from './Home/components/DestinationGrid';
import { TransportSelector } from './Home/components/TransportSelector';

export interface NavigationState {
  currentLocation: { latitude: number; longitude: number; description: string };
  destination: { latitude: number; longitude: number; description: string } | null;
  selectedTransport: 'walk' | 'car' | 'bus' | 'parking' | null;
  isNavigating: boolean;
  currentStep: number;
  directions: string[];
}

export function AdvancedHomeScreen({ navigation }: any) {
  const [navState, setNavState] = useState<NavigationState>({
    currentLocation: { latitude: 40.7128, longitude: -74.006, description: 'Main Entrance' },
    destination: null,
    selectedTransport: null,
    isNavigating: false,
    currentStep: 0,
    directions: [],
  });

  const [showDestinations, setShowDestinations] = useState(false);
  const [showTransportOptions, setShowTransportOptions] = useState(false);

  const handleSelectDestination = (dest: VenueLocation) => {
    const newDest = { latitude: dest.lat, longitude: dest.lon, description: dest.name };
    setNavState((prev) => ({ ...prev, destination: newDest }));
    setShowDestinations(false);
    setShowTransportOptions(true);
    Alert.alert('✓ Destination Set', `You selected: ${dest.name}`);
  };

  const handleSelectTransport = (transport: NavigationOption) => {
    const directionSteps = [
      `Starting from ${navState.currentLocation.description}`,
      `Head towards ${transport.name} direction`,
      `Continue for approximately ${transport.distance} km`,
      `You will arrive at ${navState.destination?.description} in ${transport.estimatedTime} minutes`,
      `Navigation complete! You have arrived.`,
    ];

    setNavState((prev) => ({
      ...prev,
      selectedTransport: transport.id as any,
      isNavigating: true,
      directions: directionSteps,
      currentStep: 0,
    }));
    setShowTransportOptions(false);
  };

  const advanceNavigation = () => {
    setNavState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.directions.length - 1),
    }));
  };

  const stopNavigation = () => {
    setNavState((prev) => ({
      ...prev,
      isNavigating: false,
      currentStep: 0,
      directions: [],
      destination: null,
      selectedTransport: null,
    }));
  };

  if (navState.isNavigating) {
    return (
      <NavigationUI 
        destination={navState.destination}
        directions={navState.directions}
        currentStep={navState.currentStep}
        onAdvance={advanceNavigation}
        onStop={stopNavigation}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <HomeHeader />

        {/* Current Location Box */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Typography variant="titleMedium" weight="600">Current Location</Typography>
          </View>
          <View style={styles.locationBox}>
            <Typography variant="bodyLarge" weight="600">📍 {navState.currentLocation.description}</Typography>
            <Typography variant="labelSmall" color={theme.colors.outline}>
              Coords: {navState.currentLocation.latitude.toFixed(4)}, {navState.currentLocation.longitude.toFixed(4)}
            </Typography>
          </View>
        </View>

        <DestinationGrid 
          destinations={VENUE_DESTINATIONS}
          showDestinations={showDestinations}
          setShowDestinations={setShowDestinations}
          onSelectDestination={handleSelectDestination}
          selectedDestination={navState.destination}
          onClearDestination={() => setNavState(p => ({ ...p, destination: null }))}
        />

        {navState.destination && (
          <TransportSelector 
            options={TRANSPORT_OPTIONS}
            showOptions={showTransportOptions}
            setShowOptions={setShowTransportOptions}
            onSelect={handleSelectTransport}
          />
        )}

        {/* Quick Actions */}
        <View style={styles.card}>
          <Typography variant="titleMedium" weight="600" style={styles.marginBottom}>Quick Actions</Typography>
          {[
            { label: 'Check Queue Times', icon: 'time-outline', route: 'Queues' },
            { label: 'View Events', icon: 'calendar-outline', route: 'Events' },
            { label: 'Emergency Exit', icon: 'alert-circle-outline', route: 'Emergency', color: '#FF5252' },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickActionButton}
              onPress={() => navigation?.navigate(action.route)}
            >
              <Ionicons name={action.icon as any} size={20} color={action.color || theme.colors.primary} />
              <Typography variant="bodyMedium" weight="600" style={{ flex: 1 }}>{action.label}</Typography>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { flex: 1, padding: 12 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  locationBox: { backgroundColor: theme.colors.surfaceVariant, padding: 12, borderRadius: 8, gap: 6 },
  quickActionButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant },
  marginBottom: { marginBottom: 12 },
});
