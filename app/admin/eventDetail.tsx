import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function EventDetailScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { eventId } = useLocalSearchParams();

    const id = eventId as Id<"events">;
    const event = useQuery(api.events.getEventById, id ? { eventId: id } : "skip");
    const participants = useQuery(
        api.events.getParticipantsByEvent,
        id ? { eventId: id } : "skip"
    );

    if (!user || user.role !== "admin") {
        return (
            <View style={styles.center}>
                <Text style={styles.unauthorized}>Unauthorized</Text>
            </View>
        );
    }

    if (event === undefined || participants === undefined) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backArrow}>◀</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Event Participants</Text>
            </View>

            {/* Event Info */}
            <View style={styles.eventCard}>
                <Text style={styles.eventTitle}>{event?.title}</Text>
                <Text style={styles.eventDate}>
                    📅 {event ? new Date(event.date).toLocaleDateString() : ""}
                </Text>
                <Text style={styles.eventDesc}>{event?.description}</Text>
            </View>

            <Text style={styles.sectionTitle}>
                Participants ({participants.length})
            </Text>

            {participants.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.empty}>No participants yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={participants}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardName}>{item.userName}</Text>
                            <Text style={styles.cardDetail}>{item.userEmail}</Text>
                            <Text style={styles.cardDate}>
                                Joined: {new Date(item.joinedAt).toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                />
            )}
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
    eventCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E3E8F0",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        marginBottom: 20,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 4,
    },
    eventDate: {
        fontSize: 14,
        color: "#0066cc",
        fontWeight: "500",
        marginBottom: 6,
    },
    eventDesc: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 12,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    empty: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E3E8F0",
    },
    cardName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 2,
    },
    cardDetail: {
        fontSize: 14,
        color: "#4B5563",
        marginBottom: 2,
    },
    cardDate: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 4,
    },
});
