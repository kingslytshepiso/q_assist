import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../lib/theme";

export const ThemeExample: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Typography Examples</Text>
        <Text style={styles.h1}>Heading 1 - Large Title</Text>
        <Text style={styles.h2}>Heading 2 - Section Title</Text>
        <Text style={styles.h3}>Heading 3 - Subsection</Text>
        <Text style={styles.body}>Body text - Regular content</Text>
        <Text style={styles.bodySmall}>Small body text - Secondary info</Text>
        <Text style={styles.caption}>Caption text - Meta information</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Examples</Text>
        <View style={styles.colorRow}>
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.primary.main },
            ]}
          >
            <Text style={styles.colorLabel}>Primary</Text>
          </View>
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.secondary.main },
            ]}
          >
            <Text style={styles.colorLabel}>Secondary</Text>
          </View>
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.status.success },
            ]}
          >
            <Text style={styles.colorLabel}>Success</Text>
          </View>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.status.warning },
            ]}
          >
            <Text style={styles.colorLabel}>Warning</Text>
          </View>
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.status.error },
            ]}
          >
            <Text style={styles.colorLabel}>Error</Text>
          </View>
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.status.info },
            ]}
          >
            <Text style={styles.colorLabel}>Info</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button Examples</Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Primary Button</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Secondary Button</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>Outline Button</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Examples</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Card Title</Text>
          <Text style={styles.cardContent}>
            This is a card with some content inside it.
          </Text>
        </View>
        <View style={styles.elevatedCard}>
          <Text style={styles.cardTitle}>Elevated Card</Text>
          <Text style={styles.cardContent}>
            This card has more shadow for emphasis.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spacing Examples</Text>
        <View style={styles.spacingExample}>
          <View style={[styles.spacingBox, { marginBottom: theme.spacing[1] }]}>
            <Text style={styles.spacingLabel}>Spacing 1 (4px)</Text>
          </View>
          <View style={[styles.spacingBox, { marginBottom: theme.spacing[2] }]}>
            <Text style={styles.spacingLabel}>Spacing 2 (8px)</Text>
          </View>
          <View style={[styles.spacingBox, { marginBottom: theme.spacing[4] }]}>
            <Text style={styles.spacingLabel}>Spacing 4 (16px)</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.presets.container.padded,
    paddingTop: theme.spacing[4],
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    ...theme.presets.text.h3,
    marginBottom: theme.spacing[3],
  },
  h1: {
    ...theme.presets.text.h1,
    marginBottom: theme.spacing[2],
  },
  h2: {
    ...theme.presets.text.h2,
    marginBottom: theme.spacing[2],
  },
  h3: {
    ...theme.presets.text.h3,
    marginBottom: theme.spacing[2],
  },
  body: {
    ...theme.presets.text.body,
    marginBottom: theme.spacing[1],
  },
  bodySmall: {
    ...theme.presets.text.bodySmall,
    marginBottom: theme.spacing[1],
  },
  caption: {
    ...theme.presets.text.caption,
    marginBottom: theme.spacing[1],
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing[2],
  },
  colorSwatch: {
    flex: 1,
    height: 60,
    borderRadius: theme.borderRadius.base,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing[1],
  },
  colorLabel: {
    ...theme.presets.text.caption,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weight.semibold,
  },
  primaryButton: {
    ...theme.presets.button.primary,
    marginBottom: theme.spacing[2],
  },
  primaryButtonText: {
    ...theme.presets.text.button,
  },
  secondaryButton: {
    ...theme.presets.button.secondary,
    marginBottom: theme.spacing[2],
  },
  secondaryButtonText: {
    ...theme.presets.text.body,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weight.semibold,
  },
  outlineButton: {
    ...theme.presets.button.outline,
    marginBottom: theme.spacing[2],
  },
  outlineButtonText: {
    ...theme.presets.text.body,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.weight.semibold,
  },
  card: {
    ...theme.presets.card.base,
    marginBottom: theme.spacing[3],
  },
  elevatedCard: {
    ...theme.presets.card.elevated,
    marginBottom: theme.spacing[3],
  },
  cardTitle: {
    ...theme.presets.text.h4,
    marginBottom: theme.spacing[2],
  },
  cardContent: {
    ...theme.presets.text.body,
    color: theme.colors.text.secondary,
  },
  spacingExample: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.base,
  },
  spacingBox: {
    backgroundColor: theme.colors.primary.light,
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
  },
  spacingLabel: {
    ...theme.presets.text.bodySmall,
    color: theme.colors.text.inverse,
    textAlign: "center",
  },
});
