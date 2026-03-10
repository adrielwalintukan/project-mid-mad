import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

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

            {/* ===== MENU FITUR PROFILE ===== */}

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => router.push("/profile/points")}
            >
                <View style={styles.menuRow}>
                    <Text style={styles.menuText}>Points History</Text>
                    <Ionicons name="chevron-forward" size={20} color="#4B5563" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => router.push("/profile/visits")}
            >
                <View style={styles.menuRow}>
                    <Text style={styles.menuText}>Visit History</Text>
                    <Ionicons name="chevron-forward" size={20} color="#4B5563" />
                </View>
            </TouchableOpacity>


            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <View style={styles.logoutRow}>
                    <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#EEF3FA",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEF3FA",
        padding: 24,
    },

    profileCard: {
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E3E8F0",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        marginBottom: 20,
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

    /* MENU STYLE */

    menuButton: {
        backgroundColor: "#F7F9FC",
        padding: 15,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    menuText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#4B5563",
    },

    menuRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },

    logoutButton: {
        backgroundColor: "#EF4444",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#EF4444",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 20,
        marginBottom: 20,
    },

    logoutRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },

    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

    loadingText: {
        marginTop: 10,
        color: "#666",
    },
});