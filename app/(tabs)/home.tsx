import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function HomeScreen() {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                Welcome, {user?.name || "Guest"}!
            </Text>
            <Text style={styles.points}>
                Your Points: {user?.points || 0}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    welcome: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    points: {
        fontSize: 18,
        color: "#666",
    },
});
