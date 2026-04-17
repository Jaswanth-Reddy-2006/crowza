import React from 'react';
import { Text as RNText, TextProps, StyleSheet, TextStyle } from 'react-native';
import { theme } from '../styles/theme';

interface TypographyProps extends TextProps {
  variant?: keyof typeof theme.typography;
  color?: string;
  opacity?: number;
  weight?: TextStyle['fontWeight'];
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyLarge',
  color = theme.colors.onSurface,
  opacity,
  weight,
  style,
  children,
  ...props
}) => {
  const variantStyle = theme.typography[variant];

  return (
    <RNText
      style={[
        {
          color,
          opacity,
          fontFamily: (variantStyle as any).fontFamily,
          fontSize: (variantStyle as any).fontSize,
          fontWeight: weight || (variantStyle as any).fontWeight,
          letterSpacing: (variantStyle as any).letterSpacing,
          textTransform: (variantStyle as any).textTransform,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
