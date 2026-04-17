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
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
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
      source={require('../../assets/branding/stadium_snow_v2.png')}
      style={styles.background}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/branding/crowza_neon.png')} 
                  style={styles.logoImage}
                />
                <View style={styles.brandingTextContainer}>
                   <Typography variant="headlineLarge" color="#FFF" weight="900" style={styles.logoText}>CROWZA</Typography>
                   <Typography variant="labelSmall" color={theme.colors.primary} style={styles.subLogoText}>COMMAND CENTER 2.0</Typography>
                   <View style={styles.brandingUnderline} />
                </View>
              </View>

              <View style={styles.formWrapper}>
                <TonalCard variant="highest" style={styles.formCard}>
                  <Typography variant="labelSmall" color={theme.colors.primary} style={styles.label}>OPERATIONAL IDENTITY</Typography>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="commander@crowza.com"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <Typography variant="labelSmall" color={theme.colors.primary} style={[styles.label, { marginTop: 24 }]}>SECURE ACCESS CODE</Typography>
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
                </TonalCard>
              </View>

              {error && (
                <View style={styles.errorBox}>
                   <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                   <Typography variant="bodySmall" color={theme.colors.error}>Unauthorized: Verification Failed</Typography>
                </View>
              )}

              {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
              ) : (
                <View style={styles.actionContainer}>
                  <SignatureButton label="COMMENCE LOGIN" onPress={handleLogin} variant="primary" />
                  <SignatureButton label="CREATE ACCOUNT" onPress={() => navigation.navigate('StaffRegister')} variant="secondary" />
                </View>
              )}

              <View style={styles.footerContainer}>
                 <Typography variant="labelSmall" weight="700" color={theme.colors.primary} style={styles.footerBrand}>CROWZA OPS</Typography>
                 <Typography variant="bodySmall" color={theme.colors.outline} style={styles.footerText}>
                    Authorized Personnel Only. Secure Terminal.
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
  background: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 32, paddingBottom: 60, justifyContent: 'center' },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,152,0,0.3)',
  },
  brandingTextContainer: {
    alignItems: 'center',
  },
  logoText: {
    letterSpacing: 10,
    fontSize: 32,
    marginBottom: 4,
  },
  subLogoText: {
    letterSpacing: 4,
    fontWeight: '700',
    opacity: 0.9,
  },
  brandingUnderline: {
    width: 60,
    height: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 12,
    borderRadius: 1,
    boxShadow: `0 0 10px ${theme.colors.primary}`,
  },
  formWrapper: {
    alignItems: 'center',
  },
  formCard: { 
    width: '100%',
    maxWidth: 400,
    padding: 32, 
    borderRadius: 32,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  label: { 
    marginBottom: 8,
    letterSpacing: 2,
    fontWeight: '800',
    fontSize: 10,
  },
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
  spinner: { marginVertical: 32 },
  actionContainer: {
    marginTop: 32,
    gap: 16,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  footerContainer: {
    marginTop: 60,
    alignItems: 'center',
    gap: 4,
  },
  footerBrand: { letterSpacing: 3 },
  footerText: { opacity: 0.5, textAlign: 'center' },
});
