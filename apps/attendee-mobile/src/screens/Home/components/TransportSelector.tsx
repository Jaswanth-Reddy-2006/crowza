import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography, theme } from '@crowza/design-system';
import { NavigationOption } from '../../../data/venueData';

interface TransportSelectorProps {
  options: NavigationOption[];
  showOptions: boolean;
  setShowOptions: (show: boolean) => void;
  onSelect: (option: NavigationOption) => void;
}

export const TransportSelector: React.FC<TransportSelectorProps> = ({
  options,
  showOptions,
  setShowOptions,
  onSelect,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => setShowOptions(!showOptions)}
        style={styles.cardHeader}
      >
        <MaterialCommunityIcons name="routes" size={20} color={theme.colors.primary} />
        <Typography variant="titleMedium" weight="600">
          Choose Transport
        </Typography>
        <Ionicons name={showOptions ? 'chevron-up' : 'chevron-down'} size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.transportGrid}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => onSelect(option)}
              style={[styles.transportOption, { borderLeftColor: option.color }]}
            >
              <View style={styles.transportIconBox}>
                <MaterialCommunityIcons name={option.icon as any} size={24} color={option.color} />
              </View>
              <View style={styles.transportInfo}>
                <Typography variant="titleSmall" weight="600">
                  {option.name}
                </Typography>
                <Typography variant="labelSmall" color={theme.colors.outline}>
                  ⏱️ {option.estimatedTime} min • 📏 {option.distance} km
                </Typography>
                {option.cost && (
                  <Typography variant="labelSmall" color={theme.colors.primary}>
                    💰 ${option.cost}
                  </Typography>
                )}
              </View>
            </TouchableOpacity>
          ))}
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
  transportGrid: {
    gap: 8,
    marginBottom: 12,
  },
  transportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.surfaceVariant,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  transportIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transportInfo: {
    flex: 1,
  },
});
