import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "expo-router";

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
            onPress={() => {
                router.push({
                    pathname: "/books/detail",
                    params: { bookId: item._id }
                });
            }}
        >
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookDetails}>Author: {item.author}</Text>
            <Text style={styles.bookDetails}>Faculty: {item.faculty}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Library Catalog</Text>

            {books.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text>No books available.</Text>
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
    bookItem: {
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
