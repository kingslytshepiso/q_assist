// Theme configuration for consistent styling across the app

// Color palette - Updated to complement the Q logo design
// Logo features: vibrant green background, white Q with cyan/magenta anaglyph effects
export const colors = {
  // Primary colors - Based on the vibrant green from the logo
  primary: {
    main: "#00D400", // Vibrant green from logo background
    light: "#4DFF4D", // Lighter vibrant green
    dark: "#00A800", // Darker vibrant green
    contrast: "#FFFFFF", // White for contrast
  },

  // Secondary colors - Based on the cyan anaglyph effect
  secondary: {
    main: "#00E5FF", // Cyan from logo anaglyph effect
    light: "#4DFFFF", // Lighter cyan
    dark: "#00B8CC", // Darker cyan
    contrast: "#FFFFFF", // White for contrast
  },

  // Accent colors - Based on the magenta anaglyph effect
  accent: {
    main: "#FF00FF", // Magenta from logo anaglyph effect
    light: "#FF4DFF", // Lighter magenta
    dark: "#CC00CC", // Darker magenta
    contrast: "#FFFFFF", // White for contrast
  },

  // Status colors - Updated to complement the logo theme
  status: {
    success: "#00D400", // Using the vibrant green
    warning: "#FF9500", // Keep orange for warning
    error: "#FF3B30", // Keep red for error
    info: "#00E5FF", // Using the cyan
  },

  // Neutral colors - Updated with green undertones
  neutral: {
    white: "#FFFFFF",
    black: "#000000",
    gray: {
      50: "#F8FFF8", // Very light green tint
      100: "#F0FFF0", // Light green tint
      200: "#E8FFE8", // Slightly green tinted
      300: "#D0FFD0", // Light green tinted
      400: "#B8FFB8", // Medium light green tinted
      500: "#9E9E9E", // Neutral gray
      600: "#757575", // Neutral gray
      700: "#616161", // Neutral gray
      800: "#424242", // Neutral gray
      900: "#212121", // Neutral gray
    },
  },

  // Background colors - Updated with green theme
  background: {
    primary: "#F0FFF0", // Very light green tint
    secondary: "#FFFFFF", // Pure white
    tertiary: "#E8FFE8", // Light green tint
  },

  // Text colors - Updated for better contrast with green theme
  text: {
    primary: "#1A1A1A", // Darker for better contrast
    secondary: "#4A4A4A", // Medium dark
    tertiary: "#6B6B6B", // Medium
    disabled: "#BDBDBD", // Light gray
    inverse: "#FFFFFF", // White
  },

  // Border colors - Updated with green undertones
  border: {
    light: "#E8FFE8", // Light green tint
    medium: "#D0FFD0", // Medium light green tint
    dark: "#B8FFB8", // Medium green tint
  },

  // Shadow colors - Updated with green tint
  shadow: {
    light: "rgba(0, 212, 0, 0.1)", // Green tinted shadow
    medium: "rgba(0, 212, 0, 0.15)", // Medium green tinted shadow
    dark: "rgba(0, 212, 0, 0.25)", // Dark green tinted shadow
  },
} as const;

// Typography scale
export const typography = {
  // Font sizes
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
    "3xl": 24,
    "4xl": 32,
    "5xl": 40,
  },

  // Font weights
  weight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

// Spacing scale
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
} as const;

// Shadows
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// Layout constants
export const layout = {
  // Screen padding
  screenPadding: spacing[4],

  // Header height
  headerHeight: 56,

  // Tab bar height
  tabBarHeight: 60,

  // Button heights
  buttonHeight: {
    sm: 32,
    base: 44,
    lg: 56,
  },

  // Input heights
  inputHeight: {
    sm: 36,
    base: 44,
    lg: 52,
  },

  // Card padding
  cardPadding: spacing[4],

  // List item spacing
  listItemSpacing: spacing[3],
} as const;

// Common style presets
export const presets = {
  // Text presets
  text: {
    h1: {
      fontSize: typography.size["4xl"],
      fontWeight: typography.weight.bold,
      color: colors.text.primary,
      lineHeight: typography.size["4xl"] * typography.lineHeight.tight,
    },
    h2: {
      fontSize: typography.size["3xl"],
      fontWeight: typography.weight.bold,
      color: colors.text.primary,
      lineHeight: typography.size["3xl"] * typography.lineHeight.tight,
    },
    h3: {
      fontSize: typography.size["2xl"],
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
      lineHeight: typography.size["2xl"] * typography.lineHeight.tight,
    },
    h4: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
      lineHeight: typography.size.xl * typography.lineHeight.tight,
    },
    body: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.normal,
      color: colors.text.primary,
      lineHeight: typography.size.base * typography.lineHeight.normal,
    },
    bodySmall: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.normal,
      color: colors.text.secondary,
      lineHeight: typography.size.sm * typography.lineHeight.normal,
    },
    caption: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.normal,
      color: colors.text.tertiary,
      lineHeight: typography.size.xs * typography.lineHeight.normal,
    },
    button: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.semibold,
      color: colors.text.inverse,
      lineHeight: typography.size.base * typography.lineHeight.tight,
    },
  },

  // Button presets
  button: {
    primary: {
      backgroundColor: colors.primary.main,
      borderRadius: borderRadius.base,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      alignItems: "center" as const,
      justifyContent: "center" as const,
      minHeight: layout.buttonHeight.base,
    },
    secondary: {
      backgroundColor: colors.secondary.main,
      borderRadius: borderRadius.base,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      alignItems: "center" as const,
      justifyContent: "center" as const,
      minHeight: layout.buttonHeight.base,
    },
    accent: {
      backgroundColor: colors.accent.main,
      borderRadius: borderRadius.base,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      alignItems: "center" as const,
      justifyContent: "center" as const,
      minHeight: layout.buttonHeight.base,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.primary.main,
      borderRadius: borderRadius.base,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      alignItems: "center" as const,
      justifyContent: "center" as const,
      minHeight: layout.buttonHeight.base,
    },
    text: {
      backgroundColor: "transparent",
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[3],
      alignItems: "center" as const,
      justifyContent: "center" as const,
    },
  },

  // Input presets
  input: {
    base: {
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.medium,
      borderRadius: borderRadius.base,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      fontSize: typography.size.base,
      color: colors.text.primary,
      minHeight: layout.inputHeight.base,
    },
    focused: {
      borderColor: colors.primary.main,
    },
    error: {
      borderColor: colors.status.error,
    },
    success: {
      borderColor: colors.status.success,
    },
  },

  // Card presets
  card: {
    base: {
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.md,
      padding: layout.cardPadding,
      ...shadows.base,
    },
    elevated: {
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.md,
      padding: layout.cardPadding,
      ...shadows.md,
    },
  },

  // Container presets
  container: {
    base: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    padded: {
      flex: 1,
      backgroundColor: colors.background.primary,
      paddingHorizontal: layout.screenPadding,
    },
  },
} as const;

// Helper functions
export const themeUtils = {
  // Get status color
  getStatusColor: (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "completed":
      case "accepted":
        return colors.status.success;
      case "warning":
      case "pending":
      case "in_progress":
        return colors.status.warning;
      case "error":
      case "rejected":
      case "cancelled":
        return colors.status.error;
      case "info":
      case "open":
        return colors.status.info;
      default:
        return colors.text.tertiary;
    }
  },

  // Get text color for background
  getContrastText: (backgroundColor: string) => {
    // Simple contrast calculation - in a real app, you might want a more sophisticated algorithm
    const isLight =
      backgroundColor === colors.background.secondary ||
      backgroundColor === colors.background.primary ||
      backgroundColor === colors.neutral.white;
    return isLight ? colors.text.primary : colors.text.inverse;
  },

  // Create spacing array
  spacing: (...values: (keyof typeof spacing)[]) =>
    values.map((value) => spacing[value]),

  // Create responsive spacing
  responsiveSpacing: (
    mobile: keyof typeof spacing,
    tablet: keyof typeof spacing,
    desktop: keyof typeof spacing
  ) => ({
    mobile: spacing[mobile],
    tablet: spacing[tablet],
    desktop: spacing[desktop],
  }),
} as const;

// Export theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  presets,
  utils: themeUtils,
} as const;

export default theme;
