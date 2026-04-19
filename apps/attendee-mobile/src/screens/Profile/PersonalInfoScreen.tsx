/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, TonalCard, SignatureButton, EditorialHeader } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@example.com');
  const [phone, setPhone] = useState('+1 (555) 0123 4567');
  const [bio, setBio] = useState('Passionate about music, tech summits, and immersive stadium experiences.');

  const handleSave = () => {
    Alert.alert('Success', 'Your profile information has been updated.');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Typography variant="titleLarge" weight="800">Personal Info</Typography>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <EditorialHeader
            metadata="PROFILE SETTINGS"
            title="Your Identity"
            subtitle="Manage your personal details and how you appear in the Crowza community."
          />

          <View style={styles.form}>
            <TonalCard variant="low" style={styles.inputGroup}>
              <Typography variant="labelSmall" color={theme.colors.primary} weight="800" style={styles.label}>
                FULL NAME
              </Typography>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.outline}
              />
            </TonalCard>

            <TonalCard variant="low" style={styles.inputGroup}>
              <Typography variant="labelSmall" color={theme.colors.primary} weight="800" style={styles.label}>
                EMAIL ADDRESS
              </Typography>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </TonalCard>

            <TonalCard variant="low" style={styles.inputGroup}>
              <Typography variant="labelSmall" color={theme.colors.primary} weight="800" style={styles.label}>
                PHONE NUMBER
              </Typography>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </TonalCard>

            <TonalCard variant="low" style={styles.inputGroup}>
              <Typography variant="labelSmall" color={theme.colors.primary} weight="800" style={styles.label}>
                BIO
              </Typography>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
              />
            </TonalCard>
          </View>

          <SignatureButton
            label="SAVE CHANGES"
            variant="primary"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  form: {
    marginTop: 24,
    gap: 16,
  },
  inputGroup: {
    padding: 16,
    borderRadius: 20,
  },
  label: {
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontWeight: '600',
    padding: 0,
  },
  saveBtn: {
    marginTop: 32,
  },
});
