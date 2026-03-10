import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
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
            <Text style={{ fontSize: 12, color: "#777", marginTop: 5 }}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
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
                        <Text style={styles.headerTitle}>Book Details</Text>

                        <View style={styles.headerCard}>
                            <Text style={styles.bookTitle}>{book.title}</Text>
                            <Text style={styles.author}>Author: {book.author}</Text>
                            <Text style={styles.faculty}>Faculty: {book.faculty}</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>
                            {book.description || "No description provided."}
                        </Text>

                        <Pressable
                            style={({ pressed }) => [
                                styles.submitButton,
                                pressed && styles.submitButtonPressed,
                            ]}
                            onPress={() => {
                                router.push({
                                    pathname: "/books/review",
                                    params: { bookId: book._id }
                                });
                            }}
                        >
                            <Text style={styles.submitButtonText}>Write Review</Text>
                        </Pressable>

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
        padding: 24,
        backgroundColor: "#EEF3FA",
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    listContainer: {
        padding: 0,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerCard: {
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
    bookTitle: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 8,
        color: "#1F2937",
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
        fontWeight: "700",
        marginTop: 10,
        marginBottom: 8,
        color: "#1F2937",
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: "#444",
        marginBottom: 24,
    },
    reviewItem: {
        padding: 14,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E3E8F0",
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
    submitButton: {
        marginBottom: 20,
        backgroundColor: "#0066cc",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    submitButtonPressed: {
        backgroundColor: "#004f99",
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
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
