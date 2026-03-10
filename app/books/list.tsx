import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../convex/_generated/api";

export default function BooksListScreen() {
    const router = useRouter();
    // Query all books from Convex
    const books = useQuery(api.books.getBooks);

    // If data is still loading (null), show a loading indicator
    if (books === undefined) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading books...</Text>
            </View>
        );
    }

    // Render an individual item for the FlatList
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.bookItem}
            activeOpacity={0.7}
            onPress={() => {
                router.push({
                    pathname: "/books/detail",
                    params: { bookId: item._id }
                });
            }}
        >
            <View style={styles.bookRow}>
                <View style={styles.bookMeta}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                    <Text style={styles.bookDetails}>Author: {item.author}</Text>
                    <Text style={styles.bookDetails}>Faculty: {item.faculty}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#4B5563" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Library Catalog</Text>

            {books.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No books available.</Text>
                </View>
            ) : (
                <FlatList
                    data={books}
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
    listContainer: {
        paddingTop: 12,
        paddingBottom: 20,
    },
    bookItem: {
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
    bookRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    bookMeta: {
        flex: 1,
        marginRight: 12,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#333",
    },
    bookDetails: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    }
});
