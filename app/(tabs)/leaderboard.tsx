import { useQuery } from "convex/react";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
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
            <Text style={styles.header}>Leaderboard</Text>

            {leaderboardUsers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No users available yet.</Text>
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
        padding: 24,
        backgroundColor: "#EEF3FA",
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
    emptyText: {
        color: "#888",
    },
    header: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 16,
        color: "#1F2937",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: 10,
        textAlign: "center",
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
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
