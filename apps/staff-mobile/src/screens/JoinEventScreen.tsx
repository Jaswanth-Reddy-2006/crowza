import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  theme, 
  Typography, 
  SignatureButton, 
  TonalCard,
} from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { joinEvent } from '../store/slices/staffAuthSlice';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function JoinEventScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { loading, error, joinedEventId } = useAppSelector((s) => s.staffAuth);
  const [inviteCode, setInviteCode] = useState('');

  React.useEffect(() => {
    if (joinedEventId) {
      navigation.replace('StaffMain');
    }
  }, [joinedEventId]);

  const handleJoin = () => {
    if (!inviteCode.trim()) return;
    dispatch(joinEvent(inviteCode.trim().toUpperCase()));
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/branding/stadium_snow_v2.png')} 
        style={styles.background}
        blurRadius={Platform.OS === 'ios' ? 10 : 5}
      >
        <View style={[styles.overlay, { backgroundColor: 'rgba(5, 10, 20, 0.85)' }]} />
        
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 60 }]} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                 <Typography variant="headlineLarge" color={theme.colors.primary} weight="900" style={styles.neonText}>CROWZA</Typography>
                 <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Typography variant="labelSmall" color="#FFF" weight="800">OPS TERMINAL</Typography>
                 </View>
              </View>
              <Typography variant="headlineMedium" color="#FFF" weight="800" style={styles.title}>Event Authorization</Typography>
              <Typography variant="bodyMedium" color="rgba(255,255,255,0.6)" style={styles.subtitle}>
                Initialize your operational session by entering the unique event access code.
              </Typography>
            </View>

            <TonalCard variant="highest" style={styles.glassCard}>
              <View style={styles.glassEffect} />
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                   <Ionicons name="key-outline" size={14} color={theme.colors.primary} />
                   <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>
                     ACCESS TOKEN
                   </Typography>
                </View>
                <TextInput
                  style={styles.input}
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  placeholder="VENUE-CODE-XXXX"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={16} color={theme.colors.error} />
                  <Typography variant="bodySmall" color={theme.colors.error} weight="700">{error}</Typography>
                </View>
              )}

              <View style={styles.actionRow}>
                {loading ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                ) : (
                  <SignatureButton 
                    label="ACTIVATE SESSION" 
                    onPress={handleJoin} 
                    variant="primary"
                  />
                )}
              </View>
            </TonalCard>

            <TouchableOpacity style={styles.qrButton} activeOpacity={0.7}>
              <View style={styles.qrGlass} />
              <Ionicons name="qr-code-outline" size={24} color={theme.colors.primary} />
              <Typography variant="labelSmall" color="#FFF" weight="800" style={{ marginLeft: 12 }}>
                SCAN COMMANDER QR
              </Typography>
            </TouchableOpacity>

            <View style={styles.infoBox}>
               <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.4)" />
               <Typography variant="bodySmall" color="rgba(255,255,255,0.4)" style={styles.footerText}>
                 Authenticated Personnel Only.
               </Typography>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050A14' },
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  overlay: { ...StyleSheet.absoluteFillObject },
  scroll: { paddingHorizontal: 32, paddingBottom: 60 },
  header: { marginBottom: 40 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  neonText: { letterSpacing: 4, textShadowColor: theme.colors.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.error },
  title: { marginBottom: 8 },
  subtitle: { lineHeight: 22 },
  glassCard: { borderRadius: 32, padding: 32, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  glassEffect: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.02)' },
  inputGroup: { marginBottom: 24 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  label: { letterSpacing: 2, fontWeight: '800' },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    textAlign: 'center',
    letterSpacing: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    borderRadius: 16,
    marginBottom: 20,
  },
  actionRow: { marginTop: 8 },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  qrGlass: { ...StyleSheet.absoluteFillObject },
  infoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40 },
  footerText: { textAlign: 'center' },
});
