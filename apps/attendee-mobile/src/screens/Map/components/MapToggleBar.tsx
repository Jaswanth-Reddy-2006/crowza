import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, theme } from '@crowza/design-system';

interface MapToggleBarProps {
  mapMode: 'journey' | 'venue';
  setMapMode: (mode: 'journey' | 'venue') => void;
  emergencyMode: boolean;
  setEmergencyMode: (mode: boolean) => void;
  showFriends: boolean;
  setShowFriends: (show: boolean) => void;
}

export const MapToggleBar: React.FC<MapToggleBarProps> = ({
  mapMode,
  setMapMode,
  emergencyMode,
  setEmergencyMode,
  showFriends,
  setShowFriends,
}) => {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity 
        style={[styles.toggleBtn, mapMode === 'journey' && styles.toggleActive]}
        onPress={() => setMapMode('journey')}
      >
        <Ionicons name="car-outline" size={20} color={mapMode === 'journey' ? '#fff' : '#666'} />
        <Typography variant="labelSmall" color={mapMode === 'journey' ? '#fff' : '#666'}>YOUR CITY JOURNEY</Typography>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.toggleBtn, mapMode === 'venue' && styles.toggleActive]}
        onPress={() => setMapMode('venue')}
      >
        <Ionicons name="business-outline" size={20} color={mapMode === 'venue' ? '#fff' : '#666'} />
        <Typography variant="labelSmall" color={mapMode === 'venue' ? '#fff' : '#666'}>INDOOR VENUE</Typography>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.emergencyBtn, emergencyMode && styles.emergencyActive]}
        onPress={() => setEmergencyMode(!emergencyMode)}
      >
        <Ionicons name="warning-outline" size={20} color={emergencyMode ? '#fff' : '#F44336'} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.utilityBtn, showFriends && styles.utilityActive]}
        onPress={() => setShowFriends(!showFriends)}
      >
        <Ionicons name="people-outline" size={20} color={showFriends ? '#fff' : '#666'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FAFAFA',
    gap: 12,
    zIndex: 20,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  emergencyBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  emergencyActive: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  utilityBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  utilityActive: {
    backgroundColor: theme.colors.tertiary,
    borderColor: theme.colors.tertiary,
  },
});
