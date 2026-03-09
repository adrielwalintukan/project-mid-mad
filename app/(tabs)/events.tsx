import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function EventsScreen() {
    // Query upcoming events from Convex
    const events = useQuery(api.events.getUpcomingEvents);

    if (events === undefined) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading upcoming events...</Text>
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
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Upcoming Events</Text>

            {events.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text>No upcoming events currently scheduled.</Text>
                </View>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        margin: 16,
        textAlign: "center",
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    eventItem: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    }
});
