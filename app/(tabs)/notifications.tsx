import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No notifications received yet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF3FA",
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#888",
    textAlign: "center",
  },
});