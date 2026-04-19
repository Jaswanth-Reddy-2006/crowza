import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Typography, theme, SignatureButton } from '@crowza/design-system';

interface ZoneDetailsSheetProps {
  selectedZone: any;
  selectedOccupancy: any;
  onClose: () => void;
  onRouteMe: () => void;
  translateY: Animated.AnimatedInterpolation<number>;
}

export const ZoneDetailsSheet: React.FC<ZoneDetailsSheetProps> = ({
  selectedZone,
  selectedOccupancy,
  onClose,
  onRouteMe,
  translateY,
}) => {
  if (!selectedZone) return null;

  return (
    <>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <Animated.View
        style={[
          styles.bottomSheet,
          { transform: [{ translateY }] },
        ]}
      >
        <View style={styles.sheetHandle} />
        <View style={styles.sheetContent}>
          <View style={styles.sheetInfo}>
            <Typography variant="headlineSmall" color={theme.colors.onSurfaceVariant}>
              {selectedZone.name}
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.outline}>
              Current occupancy is {selectedOccupancy?.occupancyPercent ?? 0}%
            </Typography>
          </View>
          <View style={styles.sheetActions}>
            <SignatureButton
              label="Route Me Inside"
              onPress={onRouteMe}
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 150,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 160,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  sheetContent: {
    padding: 24,
  },
  sheetInfo: {
    marginBottom: 24,
  },
  sheetActions: {
    flexDirection: 'row',
  },
});
