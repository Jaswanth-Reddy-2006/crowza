import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography, theme, TonalCard } from '@crowza/design-system';

interface StatusOverlayProps {
  pois: any[];
  activeFacility: string | null;
  onPoiPress: (poi: any) => void;
  occupancyColors: any;
}

export const StatusOverlay: React.FC<StatusOverlayProps> = ({
  pois,
  activeFacility,
  onPoiPress,
  occupancyColors,
}) => {
  return (
    <>
      <View style={styles.poiQuickAccess}>
        {pois.map(poi => (
          <TouchableOpacity 
            key={poi.id} 
            style={[styles.poiChip, activeFacility === poi.id && styles.poiChipActive]}
            onPress={() => onPoiPress(poi)}
          >
            <Typography variant="labelSmall" color={activeFacility === poi.id ? '#FFF' : theme.colors.onSurface} weight="700">
              {poi.icon} {poi.name.toUpperCase()}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.legendOverlay}>
        <TonalCard variant="high" style={styles.legendCard} dark>
          {Object.entries(occupancyColors).map(([lvl, color]) => (
            <View key={lvl} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: color as string }]} />
              <Typography variant="labelSmall" color={theme.colors.onSurface} style={{ fontSize: 9 }}>
                {lvl.toUpperCase()}
              </Typography>
            </View>
          ))}
        </TonalCard>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  poiQuickAccess: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    zIndex: 50,
  },
  poiChip: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  poiChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  legendOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 50,
  },
  legendCard: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
    borderRadius: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
