import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        // Clear user session state
        setUser(null);
        // Redirect to login screen
        router.replace("/auth/login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Profile</Text>

            {user ? (
                <View style={styles.card}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{user.name}</Text>

                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{user.email}</Text>

                    {user.nim && (
                        <>
                            <Text style={styles.label}>NIM:</Text>
                            <Text style={styles.value}>{user.nim}</Text>
                        </>
                    )}

                    {user.faculty && (
                        <>
                            <Text style={styles.label}>Faculty:</Text>
                            <Text style={styles.value}>{user.faculty}</Text>
                        </>
                    )}

                    <Text style={styles.label}>Total Points:</Text>
                    <Text style={styles.pointsValue}>{user.points} pts</Text>
                </View>
            ) : (
                <Text style={styles.guestText}>No user logged in.</Text>
            )}

            <View style={styles.logoutContainer}>
                <Button title="Logout" onPress={handleLogout} color="#d9534f" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginTop: 10,
    },
    value: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginTop: 2,
        marginBottom: 5,
    },
    pointsValue: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#0066cc",
        marginTop: 4,
    },
    guestText: {
        textAlign: "center",
        fontSize: 16,
        color: "#888",
        marginBottom: 30,
    },
    logoutContainer: {
        marginTop: "auto",
        marginBottom: 20,
    },
});
