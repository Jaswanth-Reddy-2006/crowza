import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme, Typography } from '@crowza/design-system';

interface Sensor {
  id: string;
  name: string;
  status: string;
  density: string;
}

interface SectorSensorListProps {
  sensors: Sensor[];
}

export const SectorSensorList: React.FC<SectorSensorListProps> = ({ sensors }) => {
  return (
    <ScrollView 
       horizontal 
       showsHorizontalScrollIndicator={false} 
       style={{ marginTop: 24 }} 
       contentContainerStyle={{ paddingBottom: 10 }}
    >
      {sensors.map(s => (
        <View key={s.id} style={styles.sensorCard}>
          <View style={[styles.sensorStatus, { backgroundColor: s.status === 'critical' ? '#EF4444' : '#10B981' }]} />
          <Typography variant="labelSmall" weight="900">{s.name}</Typography>
          <Typography variant="bodySmall" color={theme.colors.outline}>{s.density} Traffic</Typography>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sensorCard: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 20, marginRight: 12, minWidth: 120, borderWidth: 1, borderColor: '#F1F5F9' },
  sensorStatus: { width: 4, height: 4, borderRadius: 2, marginBottom: 8 },
});
