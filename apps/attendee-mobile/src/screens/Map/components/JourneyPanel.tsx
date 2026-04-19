import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, theme, TonalCard, SignatureButton } from '@crowza/design-system';

interface JourneyPanelProps {
  destination: 'gate' | 'parking';
  setDestination: (dest: 'gate' | 'parking') => void;
  carLocation: any;
  setCarLocation: (loc: any) => void;
  onShareLocation: () => void;
  onStartNav: () => void;
  stadiumCoords: any;
}

export const JourneyPanel: React.FC<JourneyPanelProps> = ({
  destination,
  setDestination,
  carLocation,
  setCarLocation,
  onShareLocation,
  onStartNav,
  stadiumCoords,
}) => {
  return (
    <View style={styles.journeyPanel}>
      <TonalCard variant="high" style={styles.journeyCard}>
        <View style={{ marginBottom: 16, flexDirection: 'row', gap: 12 }}>
           <SignatureButton 
              label="Main Gate" 
              variant={destination === 'gate' ? 'primary' : 'tonal'} 
              size="small"
              onPress={() => setDestination('gate')}
           />
           <SignatureButton 
              label="Parking P1" 
              variant={destination === 'parking' ? 'primary' : 'tonal'} 
              size="small"
              onPress={() => setDestination('parking')}
           />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Typography variant="headlineSmall">{destination === 'gate' ? '35 min' : '45 min'}</Typography>
            <Typography variant="labelSmall" color={theme.colors.outline}>
               {destination === 'gate' ? 'JOURNEY TO MAIN GATE' : 'JOURNEY TO P1 PARKING'}
            </Typography>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity 
              style={[styles.shareBtn, carLocation && { backgroundColor: theme.colors.primary }]} 
              onPress={() => setCarLocation(carLocation ? null : stadiumCoords)}
            >
               <Ionicons name={carLocation ? "car" : "car-outline"} size={24} color={carLocation ? "#FFF" : theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={onShareLocation}>
               <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <SignatureButton 
              label="Start Nav" 
              variant="primary" 
              size="small" 
              onPress={onStartNav} 
            />
          </View>
        </View>
      </TonalCard>
    </View>
  );
};

const styles = StyleSheet.create({
  journeyPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 60,
  },
  journeyCard: {
    padding: 20,
    borderRadius: 24,
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
