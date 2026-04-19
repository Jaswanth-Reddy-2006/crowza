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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, EditorialHeader, TonalCard, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { signupWithEmail, clearError, resetRetryCount } from '../store/slices/authSlice';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../selectors';
import AuthErrorDisplay from '../components/AuthErrorDisplay';
import { validatePasswordStrength } from '../services/firebase/authErrorHandler';

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);

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

  // Real-time password strength feedback
  useEffect(() => {
    if (password) {
      const validation = validatePasswordStrength(password);
      setPasswordFeedback(validation.feedback);
    } else {
      setPasswordFeedback([]);
    }
  }, [password]);

  const handleSignup = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill in all details.');
      return;
    }

    dispatch(signupWithEmail({ name: name.trim(), email: email.trim(), password }));
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  const handleSwitchToLogin = () => {
    dispatch(clearError());
    dispatch(resetRetryCount());
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.logoContainer}>
              <Ionicons name="star" size={48} color={theme.colors.primary} />
              <Typography variant="displaySmall" weight="700" style={styles.logoText}>CROWZA</Typography>
            </View>

            <EditorialHeader
              metadata="WELCOME"
              title="Join Us"
              subtitle="Create your profile to start your venue experience."
              style={styles.header}
            />

            {/* Error Display */}
            {authError && (
              <AuthErrorDisplay
                error={authError}
                onDismiss={handleDismissError}
                onRetry={handleSignup}
                onSwitchToLogin={handleSwitchToLogin}
              />
            )}

            <View style={styles.content}>
              <View style={styles.formSection}>
                <TonalCard variant="medium" style={styles.formContainer}>
                   <Typography variant="labelSmall" color={theme.colors.primary} style={styles.inputLabel}>
                    FULL NAME
                  </Typography>
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor={theme.colors.outline}
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                  />

                  <Typography variant="labelSmall" color={theme.colors.primary} style={[styles.inputLabel, { marginTop: 24 }]}>
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
                    editable={!loading}
                  />

                  <Typography variant="labelSmall" color={theme.colors.primary} style={[styles.inputLabel, { marginTop: 24 }]}>
                    PASSWORD
                  </Typography>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter a secure password"
                      placeholderTextColor={theme.colors.outline}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIconContainer}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={24}
                        color={theme.colors.outline}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Password Strength Feedback */}
                  {passwordFeedback.length > 0 && (
                    <View style={styles.feedbackContainer}>
                      {passwordFeedback.map((feedback, index) => (
                        <View key={index} style={styles.feedbackItem}>
                          <Ionicons name="alert-circle-outline" size={14} color={theme.colors.warning} />
                          <Typography variant="labelSmall" color={theme.colors.warning} style={styles.feedbackText}>
                            {feedback}
                          </Typography>
                        </View>
                      ))}
                    </View>
                  )}

                  {password && passwordFeedback.length === 0 && (
                    <View style={styles.successContainer}>
                      <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                      <Typography variant="labelSmall" color={theme.colors.primary} style={styles.successText}>
                        Password meets security requirements
                      </Typography>
                    </View>
                  )}
                </TonalCard>

                {loading ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} style={styles.spinner} />
                ) : (
                  <SignatureButton
                    label="CREATE ACCOUNT"
                    onPress={handleSignup}
                    variant="primary"
                  />
                )}

                <TouchableOpacity 
                  onPress={handleSwitchToLogin}
                  style={styles.loginLink}
                  disabled={loading}
                >
                  <Typography variant="labelSmall" color={theme.colors.outline}>
                    ALREADY HAVE AN ACCOUNT? <Typography color={theme.colors.primary} weight="700">LOGIN</Typography>
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  formSection: {
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
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Regular',
  },
  eyeIconContainer: {
    padding: 8,
  },
  feedbackContainer: {
    marginTop: 12,
    gap: 8,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  feedbackText: {
    flex: 1,
    marginTop: 2,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  successText: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  spinner: {
    marginBottom: 24,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
});
