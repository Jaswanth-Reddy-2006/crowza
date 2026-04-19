/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, EditorialHeader, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { loginWithEmail, clearError, resetRetryCount } from '../store/slices/authSlice';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../selectors';
import AuthErrorDisplay from '../components/AuthErrorDisplay';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: Platform.OS !== 'web' 
    }).start();
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Main');
    }
  }, [isAuthenticated, navigation]);

  const handleEmailLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Credentials', 'Please enter both email and password.');
      return;
    }
    dispatch(loginWithEmail({ email: email.trim(), password }));
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  const handleSwitchToSignup = () => {
    dispatch(clearError());
    dispatch(resetRetryCount());
    navigation.navigate('Signup');
  };

  return (
    <ImageBackground 
      source={require('../../assets/branding/stadium_light.png')}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.logoContainer}>
              <Ionicons name="star" size={48} color={theme.colors.primary} />
              <Typography variant="displaySmall" weight="700" style={styles.logoText}>CROWZA</Typography>
            </View>
            
            <EditorialHeader
              metadata="WELCOME BACK"
              title="Sign In"
              subtitle="Enter your credentials to access the venue experience."
              style={styles.header}
            />

            {authError && (
              <AuthErrorDisplay
                error={authError}
                onDismiss={handleDismissError}
                onRetry={handleEmailLogin}
                onSwitchToSignup={handleSwitchToSignup}
              />
            )}

            <View style={styles.content}>
              <View style={styles.emailSection}>
                <TonalCard variant="medium" style={styles.formContainer}>
                  <Typography variant="labelSmall" color={theme.colors.primary} style={styles.inputLabel}>
                    EMAIL ADDRESS
                  </Typography>
                  <TextInput
                    style={styles.input}
                    placeholder="example@domain.com"
                    placeholderTextColor={theme.colors.outline}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Typography variant="labelSmall" color={theme.colors.primary} style={[styles.inputLabel, { marginTop: 24 }]}>
                    PASSWORD
                  </Typography>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      placeholderTextColor={theme.colors.outline}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIconContainer}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={24}
                        color={theme.colors.outline}
                      />
                    </TouchableOpacity>
                  </View>
                </TonalCard>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.forgotBtn}>
                    <Typography variant="labelSmall" color={theme.colors.primary}>
                      Forgot Password?
                    </Typography>
                  </TouchableOpacity>
                </View>

                {loading ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
                ) : (
                  <SignatureButton
                    label="LOGIN"
                    onPress={handleEmailLogin}
                    variant="primary"
                  />
                )}

                <TouchableOpacity 
                  onPress={handleSwitchToSignup}
                  style={styles.signupLink}
                >
                  <Typography variant="labelSmall" color={theme.colors.outline}>
                    NEW TO CROWZA? <Typography color={theme.colors.primary} weight="700">CREATE ACCOUNT</Typography>
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <Typography variant="labelSmall" color={theme.colors.outline}>
            POWERED BY CROWZA KINETIC
          </Typography>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(252, 249, 248, 0.7)',
    zIndex: 0,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logoText: {
    color: theme.colors.primary,
    marginTop: 8,
    letterSpacing: 2,
  },
  header: {
    marginBottom: 32,
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 16,
  },
  emailSection: {
    width: '100%',
  },
  formContainer: {
    padding: 24,
    marginBottom: 24,
    borderRadius: 24,
  },
  inputLabel: {
    marginBottom: 8,
    letterSpacing: 1.2,
  },
  input: {
    fontSize: 18,
    color: theme.colors.onSurface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    paddingVertical: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  passwordInput: {
    flex: 1,
    fontSize: 18,
    color: theme.colors.onSurface,
    paddingVertical: 8,
  },
  eyeIconContainer: {
    padding: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
  forgotBtn: {
    padding: 4,
  },
  spinner: {
    marginBottom: 24,
  },
  signupLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
  },
});
