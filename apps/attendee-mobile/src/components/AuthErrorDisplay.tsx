/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @typescript-eslint/ban-ts-comment */
/**
 * Auth Error Display Component
 * Shows user-friendly authentication error messages with recovery actions
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme, TonalCard, Typography } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { AuthError } from '../services/firebase/authErrorHandler';

interface AuthErrorDisplayProps {
  error: AuthError | null;
  onDismiss: () => void;
  onRetry?: () => void;
  onSwitchToLogin?: () => void;
  onSwitchToSignup?: () => void;
  onContactSupport?: () => void;
  onRetryLater?: () => void;
}

const AuthErrorDisplay: React.FC<AuthErrorDisplayProps> = ({
  error,
  onDismiss,
  onRetry,
  onSwitchToLogin,
  onSwitchToSignup,
  onContactSupport,
  onRetryLater,
}) => {
  if (!error) {
    return null;
  }

  const severityColors: Record<string, string> = {
    info: theme.colors.info,
    warning: theme.colors.warning,
    error: theme.colors.error,
    critical: theme.colors.error,
  };

  const backgroundColor = {
    info: theme.colors.surfaceVariant,
    warning: `${theme.colors.warning}15`,
    error: `${theme.colors.error}15`,
    critical: `${theme.colors.error}15`,
  }[error.severity];

  const iconMap: Record<string, string> = {
    info: 'information-circle-outline',
    warning: 'alert-outline',
    error: 'alert-circle-outline',
    critical: 'alert-circle',
  };

  const renderActionButtons = () => {
    const buttons = [];

    if (error.recoveryAction === 'retry' && onRetry) {
      buttons.push(
        <TouchableOpacity
          key="retry"
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={onRetry}
        >
          <Ionicons name="refresh" size={16} color="white" />
          <Text style={[styles.actionButtonText, { color: 'white' }]}>Try Again</Text>
        </TouchableOpacity>
      );
    }

    if (error.recoveryAction === 'switch_to_login' && onSwitchToLogin) {
      buttons.push(
        <TouchableOpacity
          key="login"
          style={[styles.actionButton, { backgroundColor: theme.colors.primaryContainer }]}
          onPress={onSwitchToLogin}
        >
          <Ionicons name="log-in-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            Go to Login
          </Text>
        </TouchableOpacity>
      );
    }

    if (error.recoveryAction === 'switch_to_signup' && onSwitchToSignup) {
      buttons.push(
        <TouchableOpacity
          key="signup"
          style={[styles.actionButton, { backgroundColor: theme.colors.primaryContainer }]}
          onPress={onSwitchToSignup}
        >
          <Ionicons name="person-add-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            Create Account
          </Text>
        </TouchableOpacity>
      );
    }

    if (error.recoveryAction === 'contact_support' && onContactSupport) {
      buttons.push(
        <TouchableOpacity
          key="support"
          style={[styles.actionButton, { backgroundColor: theme.colors.primaryContainer }]}
          onPress={onContactSupport}
        >
          <Ionicons name="help-circle-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            Contact Support
          </Text>
        </TouchableOpacity>
      );
    }

    if (error.recoveryAction === 'retry_later' && onRetryLater) {
      buttons.push(
        <TouchableOpacity
          key="retry_later"
          style={[styles.actionButton, { backgroundColor: theme.colors.primaryContainer }]}
          onPress={onRetryLater}
        >
          <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            Try Later
          </Text>
        </TouchableOpacity>
      );
    }

    return buttons;
  };

  return (
    <TonalCard
      variant="medium"
      style={[styles.container, { backgroundColor }]}
    >
      <View style={styles.headerRow}>
        <Ionicons
          name={iconMap[error.severity]}
          size={24}
          color={severityColors[error.severity]}
          style={styles.icon}
        />
        <View style={styles.titleContainer}>
          <Typography variant="titleSmall" weight="700">
            {error.severity === 'info' && 'Notice'}
            {error.severity === 'warning' && 'Warning'}
            {error.severity === 'error' && 'Error'}
            {error.severity === 'critical' && 'Critical Error'}
          </Typography>
        </View>
        <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
          <Ionicons name="close" size={20} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <Typography
        variant="bodySmall"
        color={theme.colors.onSurface}
        style={styles.message}
      >
        {error.userMessage}
      </Typography>

      {renderActionButtons().length > 0 && (
        <View style={styles.buttonContainer}>
          {renderActionButtons()}
        </View>
      )}

      {/* Debug info for development */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Typography variant="labelSmall" color={theme.colors.outline}>
            [DEBUG] Code: {error.code}
          </Typography>
        </View>
      )}
    </TonalCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  message: {
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  debugContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
});

export default AuthErrorDisplay;
