import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, SafeAreaView, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function BookDetailScreen() {
    const { bookId } = useLocalSearchParams();
    const router = useRouter();

    // Cast bookId safely to our convex Id type
    const id = bookId as Id<"books">;

    // Query details (skip query if id is undefined/null momentarily)
    const book = useQuery(api.books.getBookById, id ? { bookId: id } : "skip");
    const reviews = useQuery(api.reviews.getReviewsByBook, id ? { bookId: id } : "skip");

    if (book === undefined || reviews === undefined) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading book details...</Text>
            </View>
        );
    }

    if (book === null) {
        return (
            <View style={styles.centerContainer}>
                <Text>Book not found.</Text>
            </View>
        );
    }

    const renderReviewItem = ({ item }: { item: any }) => (
        <View style={styles.reviewItem}>
            <Text style={styles.reviewRating}>⭐ {item.rating}/5</Text>
            <Text style={styles.reviewComment}>{item.comment}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                style={styles.container}
                contentContainerStyle={styles.listContainer}
                data={reviews}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.title}>{book.title}</Text>
                            <Text style={styles.author}>Author: {book.author}</Text>
                            <Text style={styles.faculty}>Faculty: {book.faculty}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>
                            {book.description || "No description provided."}
                        </Text>

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Write Review"
                                onPress={() => {
                                    router.push({
                                        pathname: "/books/review",
                                        params: { bookId: book._id }
                                    });
                                }}
                            />
                        </View>

                        <Text style={styles.sectionTitle}>Reviews</Text>
                        {reviews.length === 0 && (
                            <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
                        )}
                    </View>
                }
                renderItem={renderReviewItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    listContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    author: {
        fontSize: 16,
        color: "#666",
        marginBottom: 4,
        fontWeight: "500",
    },
    faculty: {
        fontSize: 14,
        color: "#0066cc",
        fontWeight: "500",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 8,
        color: "#333",
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: "#444",
        marginBottom: 24,
    },
    reviewItem: {
        padding: 14,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    reviewRating: {
        fontWeight: "bold",
        color: "#f5a623",
        fontSize: 16,
        marginBottom: 6,
    },
    reviewComment: {
        fontSize: 15,
        color: "#333",
        lineHeight: 20,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    },
    noReviews: {
        fontSize: 15,
        color: "#888",
        fontStyle: "italic",
        marginTop: 5,
        marginBottom: 20,
    }
});
