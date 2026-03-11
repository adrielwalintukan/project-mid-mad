import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function AdminMenuScreen() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    // Block access if user is not an admin
    if (!user || user.role !== "admin") {
        return (
            <View style={styles.container}>
                <Text style={styles.unauthorized}>Not authorized</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Manage your application</Text>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => router.push("/admin/setCode")}
            >
                <Text style={styles.menuButtonText}>Set Visit Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => router.push("/admin/users")}
            >
                <Text style={styles.menuButtonText}>View Users</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => router.push("/admin/visits")}
            >
                <Text style={styles.menuButtonText}>View Visits</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => router.push("/admin/points")}
            >
                <Text style={styles.menuButtonText}>View Points</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                    setUser(null);
                    router.replace("/auth/login");
                }}
            >
                <Text style={styles.menuButtonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
        backgroundColor: "#EEF3FA",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 10,
        textAlign: "center",
        color: "#1F2937",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
    menuButton: {
        backgroundColor: "#0066cc",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 14,
        shadowColor: "#0066cc",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    menuButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    logoutButton: {
        backgroundColor: "#EF4444",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#EF4444",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    unauthorized: {
        fontSize: 18,
        color: "#EF4444",
        textAlign: "center",
        marginTop: 40,
        fontWeight: "600",
    },
});
