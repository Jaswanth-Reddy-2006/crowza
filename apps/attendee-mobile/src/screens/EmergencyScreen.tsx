/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EMERGENCY_TYPES = [
  { id: 'medical', title: 'Medical Help', icon: 'medkit', color: '#EF4444', description: 'Immediate medical assistance required' },
  { id: 'security', title: 'Security Alert', icon: 'shield-checkmark', color: '#3B82F6', description: 'Harassment or safety concern' },
  { id: 'fire', title: 'Fire / Smoke', icon: 'flame', color: '#F59E0B', description: 'Hazard detection in vicinity' },
  { id: 'exit', title: 'Urgent Evacuation', icon: 'exit', color: '#DC2626', description: 'Need guidance to nearest exit' },
];

export default function EmergencySupportScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [alertSent, setAlertSent] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState('NOTIFYING SECURITY...');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (alertSent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();

      const timer1 = setTimeout(() => setDispatchStatus('SECURITY DISPATCHED'), 2000);
      const timer2 = setTimeout(() => setDispatchStatus('ETA: 2 MINUTES'), 4000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [alertSent]);

  const handleSendAlert = () => {
    setAlertSent(true);
  };

  const renderActiveResponse = () => (
    <View style={styles.responseContainer}>
      <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.innerCircle}>
          <Ionicons name="shield-checkmark" size={60} color="#FFF" />
        </View>
      </Animated.View>

      <Typography variant="headlineMedium" weight="900" style={{ marginTop: 40 }}>HELP IS COMING</Typography>
      <TonalCard variant="high" style={styles.statusCard}>
         <Typography variant="labelLarge" color={theme.colors.primary} weight="900">{dispatchStatus}</Typography>
      </TonalCard>

      <Typography variant="bodyMedium" style={styles.instructionText}>
        Stay exactly where you are. Our team is using your GPS to reach you. Keep your phone screen on.
      </Typography>

      <View style={styles.actionColumn}>
        <SignatureButton
          label="Open Live Support Chat"
          variant="secondary"
          onPress={() => {}}
          style={{ width: '100%' }}
        />
        
        {selectedType === 'exit' && (
          <SignatureButton
            label="Start Evacuation Guide"
            variant="primary"
            onPress={() => navigation.navigate('Map', { emergency: true })}
            style={{ width: '100%', marginTop: 12 }}
          />
        )}

        <TouchableOpacity 
          style={styles.cancelBtn} 
          onPress={() => {
            setAlertSent(false);
            setDispatchStatus('NOTIFYING SECURITY...');
          }}
        >
          <Typography variant="labelLarge" color="#EF4444" weight="800">CANCEL ALERT</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={alertSent ? ['#FEF2F2', '#FFFFFF'] : ['#FFF', '#FFF']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Typography variant="titleLarge" weight="900">SAFETY HUB</Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {!alertSent ? (
          <View style={styles.selectionView}>
            <Typography variant="displaySmall" weight="900" style={styles.mainTitle}>Immediate assistance?</Typography>
            <Typography variant="bodyLarge" color={theme.colors.outline} style={styles.subtitle}>
              Select the situation for prioritized venue security response and location tracking.
            </Typography>

            <View style={styles.typesGrid}>
               {EMERGENCY_TYPES.map((type) => (
                 <TouchableOpacity
                   key={type.id}
                   onPress={() => setSelectedType(type.id)}
                   style={[styles.typeItem, selectedType === type.id && { borderColor: type.color, borderWidth: 2 }]}
                 >
                   <TonalCard variant={selectedType === type.id ? 'high' : 'low'} style={styles.typeInner}>
                      <View style={[styles.iconBox, { backgroundColor: type.color + '20' }]}>
                        <Ionicons name={type.icon as any} size={32} color={type.color} />
                      </View>
                      <Typography variant="titleMedium" weight="800" style={{ marginTop: 16 }}>{type.title}</Typography>
                      <Typography variant="bodySmall" color={theme.colors.outline} style={{ textAlign: 'center', marginTop: 4 }}>
                        {type.description}
                      </Typography>
                   </TonalCard>
                 </TouchableOpacity>
               ))}
            </View>

            <View style={styles.footer}>
               <SignatureButton
                 label="ACTIVATE EMERGENCY ALERT"
                 variant="primary"
                 disabled={!selectedType}
                 onPress={handleSendAlert}
                 style={styles.sosBtn}
               />
               <View style={styles.safetyInfo}>
                 <Ionicons name="lock-closed" size={14} color={theme.colors.outline} />
                 <Typography variant="labelSmall" color={theme.colors.outline}>ENCRYPTED DIRECT CHANNEL TO SECURITY</Typography>
               </View>
            </View>
          </View>
        ) : renderActiveResponse()}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  scroll: {
    flexGrow: 1,
  },
  selectionView: {
    padding: 24,
  },
  mainTitle: {
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 12,
    marginBottom: 32,
    lineHeight: 24,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeItem: {
    width: (SCREEN_WIDTH - 48 - 12) / 2,
    borderRadius: 24,
  },
  typeInner: {
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    height: 180,
    justifyContent: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 40,
  },
  sosBtn: {
    height: 72,
    backgroundColor: '#EF4444',
  },
  safetyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  responseContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  statusCard: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    marginTop: 16,
  },
  instructionText: {
    textAlign: 'center',
    marginTop: 24,
    color: theme.colors.outline,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  actionColumn: {
    width: '100%',
    marginTop: 40,
    gap: 12,
  },
  cancelBtn: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 12,
  },
});
