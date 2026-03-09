import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        setUser(null);
        router.replace("/auth/login");
    };

    if (!user) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>No profile data available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>My Profile</Text>

            <View style={styles.profileCard}>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{user.name}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{user.email}</Text>
                </View>

                {user.nim && (
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>NIM</Text>
                        <Text style={styles.value}>{user.nim}</Text>
                    </View>
                )}

                {user.faculty && (
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Faculty</Text>
                        <Text style={styles.value}>{user.faculty}</Text>
                    </View>
                )}

                <View style={[styles.detailRow, styles.lastRow]}>
                    <Text style={styles.label}>Points Earned</Text>
                    <Text style={styles.pointValue}>{user.points} pts</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Logout" color="#d9534f" onPress={handleLogout} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    profileCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 30,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    label: {
        fontSize: 16,
        color: "#666",
        fontWeight: "500",
    },
    value: {
        fontSize: 16,
        color: "#333",
        fontWeight: "bold",
    },
    pointValue: {
        fontSize: 16,
        color: "#0066cc",
        fontWeight: "bold",
    },
    buttonContainer: {
        marginTop: "auto",
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    }
});
