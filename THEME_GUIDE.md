# Theme System Guide

This document explains how to use the centralized theming system in the Assist app.

## Overview

The theme system is located in `src/lib/theme.ts` and provides a consistent design language across the entire application. It includes colors, typography, spacing, shadows, and reusable style presets.

## Structure

### Colors

```typescript
import { theme } from "../lib/theme";

// Primary colors
theme.colors.primary.main; // #007AFF
theme.colors.primary.light; // #4DA3FF
theme.colors.primary.dark; // #0056CC

// Secondary colors
theme.colors.secondary.main; // #34C759
theme.colors.secondary.light; // #5CDB7B
theme.colors.secondary.dark; // #28A745

// Status colors
theme.colors.status.success; // #34C759
theme.colors.status.warning; // #FF9500
theme.colors.status.error; // #FF3B30
theme.colors.status.info; // #007AFF

// Text colors
theme.colors.text.primary; // #333333
theme.colors.text.secondary; // #666666
theme.colors.text.tertiary; // #999999
theme.colors.text.inverse; // #FFFFFF

// Background colors
theme.colors.background.primary; // #F5F5F5
theme.colors.background.secondary; // #FFFFFF
theme.colors.background.tertiary; // #F8F8F8
```

### Typography

```typescript
// Font sizes
theme.typography.size.xs; // 10
theme.typography.size.sm; // 12
theme.typography.size.base; // 14
theme.typography.size.lg; // 16
theme.typography.size.xl; // 18
theme.typography.size["2xl"]; // 20
theme.typography.size["3xl"]; // 24
theme.typography.size["4xl"]; // 32

// Font weights
theme.typography.weight.light; // "300"
theme.typography.weight.normal; // "400"
theme.typography.weight.medium; // "500"
theme.typography.weight.semibold; // "600"
theme.typography.weight.bold; // "700"
```

### Spacing

```typescript
// Spacing scale (4px base unit)
theme.spacing[0]; // 0
theme.spacing[1]; // 4px
theme.spacing[2]; // 8px
theme.spacing[3]; // 12px
theme.spacing[4]; // 16px
theme.spacing[5]; // 20px
theme.spacing[6]; // 24px
theme.spacing[8]; // 32px
theme.spacing[10]; // 40px
theme.spacing[12]; // 48px
```

### Border Radius

```typescript
theme.borderRadius.none; // 0
theme.borderRadius.sm; // 4px
theme.borderRadius.base; // 8px
theme.borderRadius.md; // 12px
theme.borderRadius.lg; // 16px
theme.borderRadius.xl; // 20px
```

## Style Presets

### Text Presets

```typescript
// Use predefined text styles
const styles = StyleSheet.create({
  title: {
    ...theme.presets.text.h1, // Large title
  },
  subtitle: {
    ...theme.presets.text.h2, // Section title
  },
  heading: {
    ...theme.presets.text.h3, // Subsection
  },
  body: {
    ...theme.presets.text.body, // Regular text
  },
  caption: {
    ...theme.presets.text.caption, // Small text
  },
});
```

### Button Presets

```typescript
const styles = StyleSheet.create({
  primaryButton: {
    ...theme.presets.button.primary, // Blue background
  },
  secondaryButton: {
    ...theme.presets.button.secondary, // White with border
  },
  outlineButton: {
    ...theme.presets.button.outline, // Transparent with border
  },
  textButton: {
    ...theme.presets.button.text, // Text only
  },
});
```

### Card Presets

```typescript
const styles = StyleSheet.create({
  card: {
    ...theme.presets.card.base, // Basic card
  },
  elevatedCard: {
    ...theme.presets.card.elevated, // Card with more shadow
  },
});
```

### Container Presets

```typescript
const styles = StyleSheet.create({
  container: {
    ...theme.presets.container.base, // Full screen container
  },
  paddedContainer: {
    ...theme.presets.container.padded, // Container with horizontal padding
  },
});
```

## Usage Examples

### Basic Component Styling

```typescript
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../lib/theme";

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Title</Text>
      <Text style={styles.body}>Some content here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.presets.container.padded,
    paddingTop: theme.spacing[4],
  },
  title: {
    ...theme.presets.text.h2,
    marginBottom: theme.spacing[3],
  },
  body: {
    ...theme.presets.text.body,
    color: theme.colors.text.secondary,
  },
});
```

### Status-Based Styling

```typescript
import { theme } from "../lib/theme";

// Get status color dynamically
const getStatusColor = (status: string) => {
  return theme.utils.getStatusColor(status);
};

// Usage
const statusColor = getStatusColor("success"); // Returns #34C759
const warningColor = getStatusColor("pending"); // Returns #FF9500
```

### Custom Button Component

```typescript
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../lib/theme";

interface ButtonProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  onPress: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  onPress,
}) => {
  const buttonStyle = theme.presets.button[variant];
  const textStyle =
    variant === "primary"
      ? theme.presets.text.button
      : {
          ...theme.presets.text.body,
          fontWeight: theme.typography.weight.semibold,
        };

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
```

## Best Practices

### 1. Use Presets When Possible

```typescript
// ✅ Good - Use presets
const styles = StyleSheet.create({
  title: {
    ...theme.presets.text.h2,
  },
});

// ❌ Avoid - Hard-coded values
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
```

### 2. Use Theme Colors Instead of Hex Values

```typescript
// ✅ Good - Use theme colors
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
  },
});

// ❌ Avoid - Hard-coded colors
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
  },
});
```

### 3. Use Consistent Spacing

```typescript
// ✅ Good - Use theme spacing
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
});

// ❌ Avoid - Inconsistent spacing
const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 12,
  },
});
```

### 4. Use Status Colors for Dynamic Content

```typescript
// ✅ Good - Use utility function
const getStatusStyle = (status: string) => ({
  backgroundColor: theme.utils.getStatusColor(status),
});

// ❌ Avoid - Manual mapping
const getStatusStyle = (status: string) => {
  switch (status) {
    case "success":
      return { backgroundColor: "#34C759" };
    case "error":
      return { backgroundColor: "#FF3B30" };
    // ...
  }
};
```

## Extending the Theme

### Adding New Colors

```typescript
// In theme.ts
export const colors = {
  // ... existing colors
  custom: {
    brand: "#FF6B35",
    accent: "#4ECDC4",
  },
} as const;
```

### Adding New Typography Styles

```typescript
// In theme.ts
export const typography = {
  // ... existing typography
  custom: {
    display: {
      fontSize: 48,
      fontWeight: "800",
      lineHeight: 56,
    },
  },
} as const;
```

### Adding New Presets

```typescript
// In theme.ts
export const presets = {
  // ... existing presets
  custom: {
    hero: {
      ...theme.presets.text.h1,
      color: theme.colors.custom.brand,
      textAlign: "center",
    },
  },
} as const;
```

## Migration Guide

When updating existing components to use the theme system:

1. **Import the theme**: `import { theme } from '../lib/theme';`
2. **Replace hard-coded colors** with theme colors
3. **Replace hard-coded spacing** with theme spacing
4. **Use text presets** instead of manual typography
5. **Use button/card presets** for common UI elements
6. **Test the component** to ensure it looks correct

## Example Migration

### Before

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});
```

### After

```typescript
const styles = StyleSheet.create({
  container: {
    ...theme.presets.container.padded,
    padding: theme.spacing[5],
  },
  title: {
    ...theme.presets.text.h2,
    marginBottom: theme.spacing[4],
  },
  button: {
    ...theme.presets.button.primary,
  },
});
```

This theming system ensures consistency, maintainability, and a professional look across the entire application.
