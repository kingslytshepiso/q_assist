import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: "#666",
  },
});
