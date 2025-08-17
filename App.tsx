import { StatusBar } from "expo-status-bar";
import React from "react";
import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "./src/contexts/AuthContext";
import { RequestProvider } from "./src/contexts/RequestContext";
import { theme } from "./src/lib/theme";
import { RootNavigator } from "./src/navigation/RootNavigator";

// Create a custom theme for React Native Paper based on MD3LightTheme
const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: theme.colors.primary.main,
    onPrimary: theme.colors.primary.contrast,
    primaryContainer: theme.colors.primary.light,
    onPrimaryContainer: theme.colors.primary.dark,
    secondary: theme.colors.secondary.main,
    onSecondary: theme.colors.secondary.contrast,
    secondaryContainer: theme.colors.secondary.light,
    onSecondaryContainer: theme.colors.secondary.dark,
    tertiary: theme.colors.accent.main,
    onTertiary: theme.colors.accent.contrast,
    tertiaryContainer: theme.colors.accent.light,
    onTertiaryContainer: theme.colors.accent.dark,
    surface: theme.colors.background.secondary,
    onSurface: theme.colors.text.primary,
    surfaceVariant: theme.colors.background.tertiary,
    onSurfaceVariant: theme.colors.text.secondary,
    background: theme.colors.background.primary,
    onBackground: theme.colors.text.primary,
    error: theme.colors.status.error,
    onError: theme.colors.text.inverse,
    errorContainer: theme.colors.status.error,
    onErrorContainer: theme.colors.text.inverse,
    outline: theme.colors.border.medium,
    outlineVariant: theme.colors.border.light,
    shadow: theme.colors.shadow.medium,
    scrim: theme.colors.shadow.dark,
    inverseSurface: theme.colors.text.primary,
    inverseOnSurface: theme.colors.background.primary,
    inversePrimary: theme.colors.primary.light,
    elevation: {
      level0: "transparent",
      level1: theme.colors.shadow.light,
      level2: theme.colors.shadow.medium,
      level3: theme.colors.shadow.dark,
      level4: theme.colors.shadow.dark,
      level5: theme.colors.shadow.dark,
    },
  },
  roundness: theme.borderRadius.base,
};

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <RequestProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </RequestProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
