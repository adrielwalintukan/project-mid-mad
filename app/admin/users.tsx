import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function AdminUsersScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const allUsers = useQuery(api.users.getAllUsers);
    const users = allUsers?.filter((u) => u.role === "student");

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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backArrow}>◀</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Users</Text>
            </View>
            <Text style={styles.subtitle}>
                {users ? `${users.length} users found` : "Loading..."}
            </Text>

            <FlatList
                data={users ?? []}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardName}>{item.name}</Text>
                        <Text style={styles.cardDetail}>Email: {item.email}</Text>
                        <Text style={styles.cardDetail}>Role: {item.role}</Text>
                        <Text style={styles.cardDetail}>Points: {item.points}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    users ? <Text style={styles.empty}>No users found.</Text> : null
                }
            />
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    backArrow: {
        fontSize: 22,
        color: "#0066cc",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1F2937",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E3E8F0",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardName: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 6,
    },
    cardDetail: {
        fontSize: 14,
        color: "#4B5563",
        marginBottom: 2,
    },
    empty: {
        fontSize: 14,
        color: "#9CA3AF",
        textAlign: "center",
        marginTop: 20,
    },
    unauthorized: {
        fontSize: 18,
        color: "#EF4444",
        textAlign: "center",
        marginTop: 40,
        fontWeight: "600",
    },
});
