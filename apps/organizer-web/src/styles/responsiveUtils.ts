/* Responsive utilities for inline styles */

export const responsiveStyles = {
  // Container widths
  container: {
    width: '100%',
    padding: '1rem',
    maxWidth: '100%',
    margin: '0 auto',
  },

  // Mobile-first responsive padding
  padding: {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
  },

  // Responsive font sizes
  fontSize: {
    xs: 'clamp(0.75rem, 2vw, 0.875rem)',
    sm: 'clamp(0.875rem, 2.5vw, 1rem)',
    base: 'clamp(1rem, 3vw, 1.125rem)',
    lg: 'clamp(1.125rem, 3.5vw, 1.25rem)',
    xl: 'clamp(1.25rem, 4vw, 1.375rem)',
    '2xl': 'clamp(1.5rem, 5vw, 1.75rem)',
    '3xl': 'clamp(1.875rem, 6vw, 2.25rem)',
    '4xl': 'clamp(2.25rem, 8vw, 3rem)',
  },

  // Grid utilities
  gridResponsive: {
    autoFit: 'repeat(auto-fit, minmax(300px, 1fr))',
    autoFill: 'repeat(auto-fill, minmax(250px, 1fr))',
    twoCol: 'repeat(auto-fit, minmax(250px, 1fr))',
    threeCol: 'repeat(auto-fit, minmax(200px, 1fr))',
  },

  // Button responsive sizes
  button: {
    touchTarget: 'clamp(2.75rem, 10vw, 3rem)', // 44px minimum
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
  },

  // Input responsive sizes
  input: {
    minHeight: '2.75rem', // 44px for touch
    padding: '0.75rem',
    fontSize: '16px', // Prevents iOS zoom
  },

  // Responsive gap/spacing
  gap: {
    sm: 'clamp(0.5rem, 1vw, 0.75rem)',
    md: 'clamp(1rem, 2vw, 1.5rem)',
    lg: 'clamp(1.5rem, 3vw, 2rem)',
    xl: 'clamp(2rem, 4vw, 3rem)',
  },

  // Responsive margins
  margin: {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
  },

  // Card/Box responsive styles
  card: {
    padding: 'clamp(1rem, 3vw, 2rem)',
    borderRadius: 'clamp(0.375rem, 1vw, 0.75rem)',
    width: '100%',
  },

  // Header responsive
  header: {
    padding: 'clamp(1rem, 3vw, 2rem)',
    fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
  },

  // Flex responsive
  flexCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'clamp(1rem, 2vw, 1.5rem)',
  },

  flexRow: (gap = '1rem') => ({
    display: 'flex',
    flexDirection: 'row' as const,
    gap,
    flexWrap: 'wrap' as const,
  }),

  // Responsive image
  image: {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
  },

  // Responsive tab bar
  tabBar: {
    display: 'flex',
    overflowX: 'auto' as const,
    WebkitOverflowScrolling: 'touch',
    gap: '0.5rem',
    padding: '0.5rem',
  },

  // Responsive modal
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    '@media (min-width: 768px)': {
      position: 'fixed' as const,
      maxWidth: '90%',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: 'auto',
      bottom: 'auto',
      right: 'auto',
    },
  },
};

// Helper function for media query styles
export const withMediaQueries = (
  mobileStyle: React.CSSProperties,
  tabletStyle?: React.CSSProperties,
  desktopStyle?: React.CSSProperties
): React.CSSProperties => {
  // Note: This is a placeholder. In practice, use CSS or styled-components
  return mobileStyle;
};

// Breakpoints
export const breakpoints = {
  mobileSm: '320px',
  mobileMd: '375px',
  mobileLg: '425px',
  tablet: '768px',
  desktop: '1024px',
  desktopLg: '1440px',
};

// Media queries as strings
export const mediaQueries = {
  mobileSm: `@media (min-width: ${breakpoints.mobileSm})`,
  mobileMd: `@media (min-width: ${breakpoints.mobileMd})`,
  mobileLg: `@media (min-width: ${breakpoints.mobileLg})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  desktopLg: `@media (min-width: ${breakpoints.desktopLg})`,
  landscape: `@media (orientation: landscape)`,
  portrait: `@media (orientation: portrait)`,
  touch: `@media (hover: none) and (pointer: coarse)`,
  desktop_hover: `@media (hover: hover) and (pointer: fine)`,
};
