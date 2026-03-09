import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function LeaderboardScreen() {
    // Query top users sorted by points from Convex
    const leaderboardUsers = useQuery(api.users.getLeaderboard);

    if (leaderboardUsers === undefined) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading leaderboard...</Text>
            </View>
        );
    }

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <View style={styles.userItem}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userPoints}>{item.points} pts</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Leaderboard</Text>

            {leaderboardUsers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text>No users available yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={leaderboardUsers}
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
        padding: 20,
        backgroundColor: "#fff",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
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
    rank: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0066cc",
        width: 40,
        textAlign: "center",
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    userPoints: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    }
});
