/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
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
import { loginStaff, clearError } from '../store/slices/staffAuthSlice';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { isAuthenticated, loading, error } = useAppSelector((s) => s.staffAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(clearError());
    Animated.timing(fadeAnim, { 
      toValue: 1, 
      duration: 1000, 
      useNativeDriver: Platform.OS !== 'web' 
    }).start();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('StaffMain');
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      return;
    }
    dispatch(loginStaff({ email: email.trim(), password }));
  };

  return (
    <ImageBackground 
      source={require('../../assets/branding/stadium_light.png')}
      style={styles.background}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.headerWrapper}>
                <Image 
                  source={require('../../assets/branding/crowza_logo.png')} 
                  style={styles.logoImage}
                />
                <EditorialHeader 
                  metadata="STAFF SUITE"
                  title="Excellence in Every Event"
                  subtitle="Access your professional portal and manage venue operations with precision."
                />
              </View>

              <View style={styles.formWrapper}>
                <TonalCard variant="highest" style={styles.formCard}>
                  <View style={styles.inputLabelRow}>
                    <Ionicons name="mail-outline" size={14} color={theme.colors.primary} />
                    <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>PROFESSIONAL EMAIL</Typography>
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

                  <View style={[styles.inputLabelRow, { marginTop: 20 }]}>
                    <Ionicons name="lock-closed-outline" size={14} color={theme.colors.primary} />
                    <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>PASSWORD</Typography>
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
                </TonalCard>
              </View>

              {error && (
                <View style={styles.errorBox}>
                   <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                   <Typography variant="bodySmall" color={theme.colors.error} weight="700">Login failed. Please check your credentials.</Typography>
                </View>
              )}

              {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
              ) : (
                <View style={styles.actionContainer}>
                  <SignatureButton label="SIGN IN" onPress={handleLogin} variant="primary" />
                  <SignatureButton label="CREATE STAFF ACCOUNT" onPress={() => navigation.navigate('StaffRegister')} variant="secondary" />
                </View>
              )}

              <View style={styles.footerContainer}>
                 <Typography variant="labelSmall" weight="700" color={theme.colors.primary} style={styles.footerBrand}>CROWZA STAFF</Typography>
                 <Typography variant="bodySmall" color={theme.colors.outline} style={styles.footerText}>
                    Empowering venue teams worldwide.
                 </Typography>
              </View>
            </Animated.View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: theme.colors.bgPrimary },
  overlay: { flex: 1, backgroundColor: 'rgba(252, 249, 248, 0.7)' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 60, justifyContent: 'center' },
  headerWrapper: {
    alignItems: 'flex-start',
    marginBottom: 40,
    marginTop: 20,
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: 24,
    borderRadius: 16,
  },
  formWrapper: {
    alignItems: 'center',
  },
  formCard: { 
    width: '100%',
    maxWidth: 400,
    padding: 24, 
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    ...theme.elevation.high,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  label: { 
    letterSpacing: 1,
    fontWeight: '800',
    fontSize: 11,
  },
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
  spinner: { marginVertical: 32 },
  actionContainer: {
    marginTop: 32,
    gap: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  footerContainer: {
    marginTop: 60,
    alignItems: 'center',
    gap: 4,
  },
  footerBrand: { letterSpacing: 2 },
  footerText: { opacity: 0.7, textAlign: 'center' },
});
