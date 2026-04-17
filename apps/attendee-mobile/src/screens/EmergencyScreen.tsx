import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

const EMERGENCY_TYPES = [
  { id: 'medical', title: 'Medical Help', icon: 'medical', color: '#E57373', description: 'Immediate medical assistance required.' },
  { id: 'security', title: 'Security Alert', icon: 'shield-checkmark', color: '#64B5F6', description: 'Non-medical security or safety concern.' },
  { id: 'fire', title: 'Fire / Smoke', icon: 'flame', color: '#FFB74D', description: 'Smoke or fire detected in the vicinity.' },
  { id: 'exit', title: 'Urgent Evacuation', icon: 'exit', color: '#F44336', description: 'Guide me to the safest exit route now.' },
];

export default function EmergencySupportScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [alertSent, setAlertSent] = useState(false);

  const handleSendAlert = () => {
    setAlertSent(true);
    // In a real app, this would dispatch to backend and notify security
    setTimeout(() => {
      if (selectedType === 'exit') {
        navigation.navigate('Map', { emergency: true });
      }
    }, 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="700" style={{ marginLeft: 16 }}>Safety Hub</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!alertSent ? (
          <>
            <Typography variant="headlineSmall" weight="800">How can we help?</Typography>
            <Typography variant="bodyMedium" color={theme.colors.outline} style={{ marginTop: 8, marginBottom: 32 }}>
              Our response team is standing by. Select a category for prioritized support.
            </Typography>

            {EMERGENCY_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                activeOpacity={0.8}
              >
                <TonalCard
                  variant={selectedType === type.id ? 'high' : 'low'}
                  style={[
                    styles.typeCard,
                    selectedType === type.id && { borderColor: type.color, borderWidth: 2 }
                  ]}
                >
                  <View style={[styles.iconBox, { backgroundColor: type.color + '20' }]}>
                    <Ionicons name={type.icon as any} size={28} color={type.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <Typography variant="titleMedium" weight="700">{type.title}</Typography>
                    <Typography variant="bodySmall" color={theme.colors.outline}>{type.description}</Typography>
                  </View>
                </TonalCard>
              </TouchableOpacity>
            ))}

            <View style={styles.footer}>
              <SignatureButton
                label="Send Alert"
                variant="primary"
                disabled={!selectedType}
                onPress={handleSendAlert}
                style={{ height: 64 }}
              />
              <Typography variant="labelSmall" color={theme.colors.outline} style={{ textAlign: 'center', marginTop: 16 }}>
                Misuse of this system is subject to venue policy.
              </Typography>
            </View>
          </>
        ) : (
          <View style={styles.successView}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color={theme.colors.primary} />
            </View>
            <Typography variant="headlineMedium" weight="900" style={{ textAlign: 'center', marginTop: 24 }}>Alert Received</Typography>
            <Typography variant="bodyLarge" style={{ textAlign: 'center', marginTop: 12, color: theme.colors.outline }}>
              Our security team has been dispatched to your GPS location. Please stay where you are or follow on-screen exit guides.
            </Typography>
            {selectedType === 'exit' && (
              <SignatureButton
                label="View Exit Route"
                variant="primary"
                onPress={() => navigation.navigate('Map', { emergency: true })}
                style={{ marginTop: 40, width: '100%' }}
              />
            )}
            <SignatureButton
              label="Cancel Alert"
              variant="tonal"
              onPress={() => setAlertSent(false)}
              style={{ marginTop: 12, width: '100%' }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 24,
  },
  successView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
