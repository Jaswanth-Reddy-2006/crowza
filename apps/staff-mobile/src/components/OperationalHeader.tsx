import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme, EditorialHeader, Typography } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface OperationalHeaderProps {
  title: string;
  subtitle?: string;
  metadata?: string;
  dark?: boolean;
}

export const OperationalHeader: React.FC<OperationalHeaderProps> = ({
  title,
  subtitle,
  metadata,
  dark,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={dark ? 'white' : theme.colors.onSurface} />
        </TouchableOpacity>
        {metadata && (
          <View style={styles.metadataBadge}>
             <Typography variant="labelSmall" color={theme.colors.primary} weight="900">{metadata}</Typography>
          </View>
        )}
      </View>
      <EditorialHeader
        title={title}
        subtitle={subtitle}
        dark={dark}
        style={styles.editorial}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: -10,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metadataBadge: {
    backgroundColor: theme.colors.primaryContainer + '40',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editorial: {
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
});
