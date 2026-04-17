import React, { useState, useEffect } from 'react';
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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { registerStaff, clearError } from '../store/slices/staffAuthSlice';

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { loading, error } = useAppSelector((s) => s.staffAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Requirement Checklist State
  const requirements = [
    { label: 'Minimum 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
  ];

  const allRequirementsMet = requirements.every(r => r.met) && name.trim() && email.includes('@');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleRegister = async () => {
    if (!allRequirementsMet) return;

    await dispatch(registerStaff({ 
      displayName: name.trim(), 
      email: email.trim(), 
      password 
    }));
  };

  return (
    <ImageBackground 
      source={require('../../assets/branding/stadium_snow_v2.png')}
      style={styles.background}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={28} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.brandingRow}>
                <Image source={require('../../assets/branding/crowza_neon.png')} style={styles.miniLogo} />
                <Typography variant="headlineMedium" weight="900" style={styles.logoText}>CROWZA</Typography>
              </View>
              <Typography variant="titleLarge" weight="800" color="#FFF" style={{ marginTop: 24 }}>Generate Identity</Typography>
              <Typography variant="labelSmall" color={theme.colors.primary} style={styles.protocolText}>PROTOCOL: ALPHA-9-SECURE</Typography>
            </View>

            <View style={styles.formWrapper}>
              <TonalCard variant="highest" style={styles.formCard}>
                <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>FULL NAME</Typography>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Operational Handle"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />

                <Typography variant="labelSmall" color={theme.colors.primary} style={[styles.label, { marginTop: 20 }]}>STAFF EMAIL</Typography>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="commander@crowza.com"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Typography variant="labelSmall" color={theme.colors.primary} style={[styles.label, { marginTop: 20 }]}>SECURE ACCESS CODE</Typography>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={theme.colors.outline} />
                  </TouchableOpacity>
                </View>

                <View style={styles.checklistContainer}>
                   <Typography variant="labelSmall" color="rgba(255,255,255,0.5)" style={{ marginBottom: 12, letterSpacing: 1 }}>MANDATORY REQUIREMENTS</Typography>
                   {requirements.map((req, i) => (
                     <View key={i} style={styles.checkItem}>
                        <Ionicons 
                          name={req.met ? "checkmark-circle" : "ellipse-outline"} 
                          size={16} 
                          color={req.met ? theme.colors.primary : "rgba(255,255,255,0.2)"} 
                        />
                        <Typography 
                          variant="bodySmall" 
                          color={req.met ? "#FFF" : "rgba(255,255,255,0.4)"}
                          style={{ marginLeft: 8 }}
                        >
                          {req.label}
                        </Typography>
                     </View>
                   ))}
                </View>
              </TonalCard>
            </View>

            {error && (
              <View style={styles.errorBox}>
                 <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                 <Typography variant="bodySmall" color={theme.colors.error}>Conflict: {error}</Typography>
              </View>
            )}

            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 32 }} />
            ) : (
              <View style={styles.actionSection}>
                <SignatureButton 
                  label="INITIALIZE ASSIGNMENT" 
                  onPress={handleRegister} 
                  variant="primary" 
                  disabled={!allRequirementsMet}
                />
              </View>
            )}
            
            <View style={styles.footer}>
               <Typography variant="bodySmall" color="rgba(255,255,255,0.3)" style={{ textAlign: 'center' }}>
                  By initializing, you agree to the Crowza Operational protocols.
               </Typography>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  scrollContent: { padding: 32, paddingBottom: 60 },
  backButton: { marginBottom: 16, width: 44, height: 44, justifyContent: 'center', marginLeft: -8 },
  header: { marginBottom: 32 },
  brandingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  miniLogo: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,152,0,0.3)' },
  logoText: { letterSpacing: 6, color: '#FFF' },
  protocolText: { marginTop: 4, letterSpacing: 2, opacity: 0.8 },
  formWrapper: { alignItems: 'center' },
  formCard: { 
    width: '100%',
    maxWidth: 400,
    padding: 24, 
    borderRadius: 32, 
    backgroundColor: 'rgba(25,25,25,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  label: { marginBottom: 8, letterSpacing: 1.5, fontWeight: '800', fontSize: 10 },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
  },
  checklistContainer: {
    marginTop: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    borderRadius: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorBox: { 
    marginTop: 24, 
    padding: 12, 
    backgroundColor: `${theme.colors.error}15`, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${theme.colors.error}30`,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionSection: { marginTop: 32, width: '100%', maxWidth: 400, alignSelf: 'center' },
  footer: { marginTop: 40, opacity: 0.6 },
});
