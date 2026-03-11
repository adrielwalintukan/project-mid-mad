import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

function JoinButton({ eventId, userId }: { eventId: Id<"events">; userId: Id<"users"> }) {
    const hasJoined = useQuery(api.events.hasJoinedEvent, { userId, eventId });
    const joinEvent = useMutation(api.events.joinEvent);
    const [isJoining, setIsJoining] = useState(false);

    const handleJoin = async () => {
        try {
            setIsJoining(true);
            await joinEvent({ userId, eventId });
            Alert.alert("Success", "You joined the event! +10 points earned.");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to join event.");
        } finally {
            setIsJoining(false);
        }
    };

    if (hasJoined === undefined) return null;

    if (hasJoined) {
        return (
            <View style={styles.joinedButton}>
                <Text style={styles.joinedText}>✓ Joined</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.joinButton, isJoining && styles.joinButtonDisabled]}
            onPress={handleJoin}
            disabled={isJoining}
        >
            <Text style={styles.joinButtonText}>
                {isJoining ? "Joining..." : "Join Event"}
            </Text>
        </TouchableOpacity>
    );
}

export default function EventsScreen() {
    const { user } = useAuth();
    // Query all events from Convex
    const events = useQuery(api.events.getEvents);

    if (events === undefined) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading events...</Text>
            </View>
        );
    }

    // Format Unix timestamp to human readable local string
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>📅 {formatDate(item.date)}</Text>
            <Text style={styles.eventDesc}>{item.description}</Text>
            {user && (
                <JoinButton eventId={item._id} userId={user._id} />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Upcoming Events</Text>

            {events.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No events currently scheduled.</Text>
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                />
            )}
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
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#888",
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 16,
        color: "#1F2937",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: 10,
        textAlign: "center",
    },
    eventItem: {
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
    eventTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#333",
    },
    eventDate: {
        fontSize: 14,
        color: "#0066cc",
        marginBottom: 8,
        fontWeight: "500",
    },
    eventDesc: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 12,
    },
    joinButton: {
        backgroundColor: "#0066cc",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    joinButtonDisabled: {
        backgroundColor: "#a0bfff",
    },
    joinButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    joinedButton: {
        backgroundColor: "#e8f5e9",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    joinedText: {
        color: "#2e7d32",
        fontWeight: "700",
        fontSize: 14,
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    }
});
