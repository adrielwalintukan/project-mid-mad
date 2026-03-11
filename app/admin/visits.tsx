import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function AdminVisitsScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const visits = useQuery(api.visits.getAllVisits);
    const allUsers = useQuery(api.users.getAllUsers);

    // Build a lookup map: userId -> name
    const userMap = new Map<string, string>();
    allUsers?.forEach((u) => userMap.set(u._id, u.name));

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
                <Text style={styles.headerTitle}>All Visits</Text>
            </View>
            <Text style={styles.subtitle}>
                {visits ? `${visits.length} visits recorded` : "Loading..."}
            </Text>

            <FlatList
                data={visits ?? []}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardDetail}>Name: {userMap.get(item.userId) ?? item.userId}</Text>
                        <Text style={styles.cardDetail}>
                            Date: {new Date(item.date).toLocaleString()}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    visits ? <Text style={styles.empty}>No visits found.</Text> : null
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
