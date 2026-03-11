import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function AdminEventsScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const events = useQuery(api.events.getEvents);

    if (!user || user.role !== "admin") {
        return (
            <View style={styles.center}>
                <Text style={styles.unauthorized}>Unauthorized</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backArrow}>◀</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Events</Text>
            </View>
            <Text style={styles.subtitle}>
                {events ? `${events.length} events` : "Loading..."}
            </Text>

            <FlatList
                data={events ?? []}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            router.push({
                                pathname: "/admin/eventDetail",
                                params: { eventId: item._id },
                            })
                        }
                    >
                        <Text style={styles.cardName}>{item.title}</Text>
                        <Text style={styles.cardDetail}>
                            📅 {new Date(item.date).toLocaleDateString()}
                        </Text>
                        <Text style={styles.cardDetail}>{item.description}</Text>
                        <Text style={styles.tapHint}>Tap to view participants →</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    events ? <Text style={styles.empty}>No events found.</Text> : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: 50,
        backgroundColor: "#EEF3FA",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    unauthorized: {
        fontSize: 18,
        color: "#EF4444",
        fontWeight: "600",
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
        color: "#6B7280",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E3E8F0",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    cardName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 4,
    },
    cardDetail: {
        fontSize: 14,
        color: "#4B5563",
        marginBottom: 2,
    },
    tapHint: {
        fontSize: 13,
        color: "#0066cc",
        marginTop: 8,
        fontWeight: "500",
    },
    empty: {
        fontSize: 14,
        color: "#9CA3AF",
        textAlign: "center",
        marginTop: 20,
    },
});
