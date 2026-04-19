import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, theme } from '@crowza/design-system';

interface MapHeaderProps {
  onBack: () => void;
  title?: string;
}

export const MapHeader: React.FC<MapHeaderProps> = ({ onBack, title = 'Map & Navigation' }) => {
  return (
    <View style={styles.topHeader}>
      <TouchableOpacity 
        onPress={onBack} 
        style={styles.backButtonCircle}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
      </TouchableOpacity>
      <Typography variant="titleLarge" weight="900">{title}</Typography>
      <View style={{ width: 44 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
