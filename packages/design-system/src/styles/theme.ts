export const theme = {
  colors: {
    primary: '#F98000', // Vibrant Orange
    primaryLight: '#FFEFD4',
    primaryDark: '#C46600',
    primaryHover: '#E67E00',
    primaryGlow: 'rgba(249, 128, 0, 0.2)',
    primaryContainer: '#FFEFD4',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#554434',
    secondary: '#554434', // Secondary text color used as secondary/contrast
    secondaryContainer: '#F7F2F1',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#1C1B1B',
    tertiary: '#887361', // Tertiary/Muted color
    tertiaryContainer: '#F3EDEC',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#1C1B1B',
    background: '#FCF9F8',
    surface: '#F7F2F1',
    surfaceVariant: '#F3EDEC',
    onSurface: '#1C1B1B',
    onSurfaceVariant: '#554434',
    outline: '#887361',
    outlineVariant: '#E5E2E1',
    inverseSurface: '#313030',
    inverseOnSurface: '#F3F0EF',
    // Semantic Success - Re-branded to Orange to match web identity
    success: '#F98000',
    onSuccess: '#FFFFFF',
    successContainer: '#FFEFD4',
    onSuccessContainer: '#C2410C',
    error: '#EF4444',
    bgPrimary: '#FCF9F8',
    bgSecondary: '#F7F2F1',
    bgTertiary: '#F3EDEC',
    // Text Colors
    textPrimary: '#1C1B1B',
    textSecondary: '#554434',
    textTertiary: '#887361',
    textInverse: '#FFFFFF',
    // Surface containers
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F7F2F1',
    surfaceContainer: '#F3EDEC',
    surfaceContainerHigh: '#EEE8E6',
    surfaceContainerHighest: '#E8E2E1',
    // Custom Gradients
    primaryGradient: ['#F98000', '#E67E00'] as [string, string],
  },
  typography: {
    displayLarge: {
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 57,
      letterSpacing: -1.14,
    },
    displayMedium: {
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 45,
      letterSpacing: 0,
    },
    displaySmall: {
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 36,
      letterSpacing: 0,
    },
    headlineLarge: {
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 32,
      letterSpacing: 0,
    },
    headlineMedium: {
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 28,
      letterSpacing: 0,
    },
    headlineSmall: {
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 24,
      letterSpacing: 0,
    },
    titleLarge: {
      fontFamily: 'PlusJakartaSans-Bold',
      fontSize: 22,
      letterSpacing: 0,
    },
    titleMedium: {
      fontFamily: 'PlusJakartaSans-Medium',
      fontSize: 16,
      letterSpacing: 0.15,
    },
    titleSmall: {
      fontFamily: 'PlusJakartaSans-Medium',
      fontSize: 14,
      letterSpacing: 0.1,
    },
    bodyLarge: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      letterSpacing: 0.15,
    },
    bodyMedium: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      letterSpacing: 0.25,
    },
    bodySmall: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      letterSpacing: 0.4,
    },
    labelLarge: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontFamily: 'Inter-Medium',
      fontSize: 11,
      letterSpacing: 0.55,
      textTransform: 'uppercase' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: 8,
  elevation: {
    low: {
      shadowColor: '#1C1B1B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#1C1B1B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 4,
    },
    high: {
      shadowColor: '#1C1B1B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 6,
    },
    highest: {
      shadowColor: '#1C1B1B',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.1,
      shadowRadius: 32,
      elevation: 8,
    },
    ambient: {
      shadowColor: '#1C1B1B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 4,
    },
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
  }
};
