import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, theme } from '@crowza/design-system';
import { VenueLocation } from '../../../data/venueData';

interface DestinationGridProps {
  destinations: VenueLocation[];
  showDestinations: boolean;
  setShowDestinations: (show: boolean) => void;
  onSelectDestination: (dest: VenueLocation) => void;
  selectedDestination: any;
  onClearDestination: () => void;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({
  destinations,
  showDestinations,
  setShowDestinations,
  onSelectDestination,
  selectedDestination,
  onClearDestination,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => setShowDestinations(!showDestinations)}
        style={styles.cardHeader}
      >
        <Ionicons name="map-outline" size={20} color={theme.colors.primary} />
        <Typography variant="titleMedium" weight="600">
          Select Destination
        </Typography>
        <Ionicons name={showDestinations ? 'chevron-up' : 'chevron-down'} size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      {showDestinations && (
        <View style={styles.destinationGrid}>
          {destinations.map((dest) => (
            <TouchableOpacity
              key={dest.id}
              onPress={() => onSelectDestination(dest)}
              style={styles.destinationItem}
            >
              <View style={styles.destIconBox}>
                <Typography variant="titleMedium">{dest.icon}</Typography>
              </View>
              <Typography variant="labelSmall" style={styles.destName} numberOfLines={1}>
                {dest.name}
              </Typography>
              <Typography variant="labelSmall" color={theme.colors.outline} numberOfLines={1}>
                {dest.description}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedDestination && (
        <View style={styles.selectedDestBox}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
          <Typography variant="bodyMedium" weight="600" style={{ flex: 1 }}>
            ✓ {selectedDestination.description}
          </Typography>
          <TouchableOpacity onPress={onClearDestination}>
            <Ionicons name="close-circle" size={20} color="#FF5252" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  destinationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  destinationItem: {
    width: '48%',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    gap: 4,
  },
  destIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destName: {
    textAlign: 'center',
    fontWeight: '600',
  },
  selectedDestBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
});
