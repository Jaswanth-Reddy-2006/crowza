import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { theme, Typography, SignatureButton } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { joinEvent } from '../store/slices/staffAuthSlice';

// Asset Imports
import stadiumBg from '../../assets/branding/stadium_snow_v2.png';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type RootStackParamList = {
  StaffMain: undefined;
};

export default function JoinEventScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const { loading, error, joinedEventId } = useAppSelector((s) => s.staffAuth);
  
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);
  
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (joinedEventId) {
      // @ts-expect-error - replace is available on stack navigators but not in generic NavigationProp
      navigation.replace('StaffMain');
    }
  }, [joinedEventId, navigation]);

  const handleJoin = () => {
    if (code.trim().length === 0) {
      triggerShake();
      return;
    }
    dispatch(joinEvent(code.trim()));
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={stadiumBg} 
        style={styles.background}
      >
        <LinearGradient
          colors={['transparent', '#050A14']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.darkOverlay} />
        
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 40 }]} 
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
               <Typography variant="labelSmall" color={theme.colors.primary} weight="900" style={styles.terminalLabel}>STAFF CORE • ACCESS V3</Typography>
               <Typography variant="headlineLarge" color="#FFF" weight="900" style={styles.title}>Activate Session</Typography>
               <Typography variant="bodyMedium" color="rgba(255,255,255,0.5)" style={styles.subtitle}>
                 Personnel must enter the active mission code provided by the venue commander.
               </Typography>
            </View>

            <Animated.View style={[styles.inputWrapper, { transform: [{ translateX: shakeAnim }] }]}>
               <View style={[styles.dynamicInputBox, code !== '' && styles.inputBoxActive]}>
                  <TextInput
                    ref={inputRef}
                    style={styles.terminalInput}
                    value={code}
                    onChangeText={(t) => setCode(t.toUpperCase())}
                    placeholder="ENTER COMMAND CODE..."
                    placeholderTextColor="rgba(255,255,255,0.1)"
                    keyboardType="default"
                    autoCapitalize="characters"
                    selectionColor={theme.colors.primary}
                    autoFocus
                  />
                  <Ionicons name="key" size={20} color={code ? theme.colors.primary : "rgba(255,255,255,0.1)"} style={{ marginRight: 20 }} />
               </View>
               <Typography variant="labelSmall" color="rgba(255,255,255,0.3)" style={{ marginTop: 12, textAlign: 'center' }}>
                  E.G., EVENT-ALPHA-01 OR ZULU-CODE-2026
               </Typography>
            </Animated.View>

            {error && (
               <View style={styles.errorBanner}>
                 <Ionicons name="alert-circle" size={18} color={theme.colors.error} />
                 <Typography variant="bodySmall" color={theme.colors.error} weight="800" style={{ marginLeft: 8 }}>AUTHORIZATION FAILED: {error}</Typography>
               </View>
            )}

            <View style={styles.actionSpace}>
              {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              ) : (
                <SignatureButton 
                  label="INITIALIZE MISSION" 
                  onPress={() => handleJoin()} 
                  variant="primary"
                />
              )}
            </View>

            <View style={styles.footer}>
               <View style={styles.divider} />
               <TouchableOpacity style={styles.scanBtn}>
                  <Ionicons name="scan-circle" size={32} color={theme.colors.primary} />
                  <Typography variant="labelLarge" color="#FFF" weight="900" style={{ marginLeft: 12 }}>SCAN COMMANDER CODE</Typography>
               </TouchableOpacity>
               <Typography variant="labelSmall" color="rgba(255,255,255,0.3)" style={{ marginTop: 24, textAlign: 'center' }}>
                 SECURE TERMINAL • AES-256 ENCRYPTED
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
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5, 10, 20, 0.7)' },
  scroll: { paddingHorizontal: 30, paddingBottom: 60 },
  header: { marginBottom: 50 },
  terminalLabel: { letterSpacing: 3, marginBottom: 8 },
  title: { fontSize: 36, letterSpacing: -1, marginBottom: 12 },
  subtitle: { lineHeight: 22 },
  inputWrapper: { marginBottom: 40 },
  dynamicInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingLeft: 24,
  },
  inputBoxActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(249, 128, 0, 0.05)',
  },
  terminalInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  errorBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  actionSpace: { marginBottom: 32 },
  footer: { marginTop: 20 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 32 },
  scanBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)' 
  },
});
