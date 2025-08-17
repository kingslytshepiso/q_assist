import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../lib/theme";

export const MyRequestsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Requests Screen</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.presets.container.base,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    ...theme.presets.text.h2,
    marginBottom: theme.spacing[2],
  },
  subtext: {
    ...theme.presets.text.body,
    color: theme.colors.text.secondary,
  },
});
