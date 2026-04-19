/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
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
import { theme, TonalCard, Typography, SignatureButton, EditorialHeader } from '@crowza/design-system';
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
      source={require('../../assets/branding/stadium_light.png')}
      style={styles.background}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={28} color={theme.colors.onSurface} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Image source={require('../../assets/branding/crowza_logo.png')} style={styles.miniLogo} />
              <EditorialHeader 
                metadata="STAFF ONBOARDING"
                title="Join our Elite Team"
                subtitle="Create your professional account and start your journey with Crowza."
              />
            </View>

            <View style={styles.formWrapper}>
              <TonalCard variant="highest" style={styles.formCard}>
                <View style={styles.inputLabelRow}>
                   <Ionicons name="person-outline" size={14} color={theme.colors.primary} />
                   <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>FULL NAME</Typography>
                </View>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your Full Name"
                  placeholderTextColor={theme.colors.outline}
                />

                <View style={[styles.inputLabelRow, { marginTop: 24 }]}>
                   <Ionicons name="mail-outline" size={14} color={theme.colors.primary} />
                   <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>STAFF EMAIL</Typography>
                </View>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@crowza.com"
                  placeholderTextColor={theme.colors.outline}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={[styles.inputLabelRow, { marginTop: 24 }]}>
                   <Ionicons name="lock-closed-outline" size={14} color={theme.colors.primary} />
                   <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>SECURE PASSWORD</Typography>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.outline}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={theme.colors.outline} />
                  </TouchableOpacity>
                </View>

                <View style={styles.checklistContainer}>
                   <Typography variant="labelSmall" color={theme.colors.outline} style={{ marginBottom: 12, letterSpacing: 1 }}>SECURITY REQUIREMENTS</Typography>
                   {requirements.map((req, i) => (
                     <View key={i} style={styles.checkItem}>
                        <Ionicons 
                          name={req.met ? "checkmark-circle" : "ellipse-outline"} 
                          size={16} 
                          color={req.met ? theme.colors.primary : theme.colors.outlineVariant} 
                        />
                        <Typography 
                          variant="bodySmall" 
                          color={req.met ? theme.colors.onSurface : theme.colors.outline}
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
                 <Typography variant="bodySmall" color={theme.colors.error} weight="700">Conflict: {error}</Typography>
              </View>
            )}

            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 32 }} />
            ) : (
              <View style={styles.actionSection}>
                <SignatureButton 
                  label="CREATE ACCOUNT" 
                  onPress={handleRegister} 
                  variant="primary" 
                  disabled={!allRequirementsMet}
                />
              </View>
            )}
            
            <View style={styles.footer}>
               <Typography variant="bodySmall" color={theme.colors.outline} style={{ textAlign: 'center' }}>
                  By signing up, you agree to our professional service standards.
               </Typography>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: theme.colors.bgPrimary },
  overlay: { flex: 1, backgroundColor: 'rgba(252, 249, 248, 0.8)' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },
  backButton: { marginBottom: 16, width: 44, height: 44, justifyContent: 'center', marginLeft: -8 },
  header: { marginBottom: 32, alignItems: 'flex-start' },
  miniLogo: { width: 60, height: 60, borderRadius: 16, marginBottom: 20 },
  formWrapper: { alignItems: 'center' },
  formCard: { 
    width: '100%',
    maxWidth: 400,
    padding: 24, 
    borderRadius: 28, 
    backgroundColor: theme.colors.surface,
    ...theme.elevation.high,
  },
  inputLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  label: { letterSpacing: 1, fontWeight: '800', fontSize: 11 },
  input: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    color: theme.colors.onSurface,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  checklistContainer: {
    marginTop: 24,
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorBox: { 
    marginTop: 24, 
    padding: 16, 
    backgroundColor: `${theme.colors.error}10`, 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${theme.colors.error}20`,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionSection: { marginTop: 32, width: '100%', maxWidth: 400, alignSelf: 'center' },
  footer: { marginTop: 40, opacity: 0.8 },
});
