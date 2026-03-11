import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function BookDetailScreen() {
    const { bookId } = useLocalSearchParams();
    const router = useRouter();
    const { user, setUser } = useAuth();

    // Cast bookId safely to our convex Id type
    const id = bookId as Id<"books">;

    // Query details (skip query if id is undefined/null momentarily)
    const book = useQuery(api.books.getBookById, id ? { bookId: id } : "skip");
    const reviews = useQuery(api.reviews.getReviewsByBook, id ? { bookId: id } : "skip");
    const allUsers = useQuery(api.users.getAllUsers);

    // Build a lookup map: userId -> name
    const userMap = new Map<string, string>();
    allUsers?.forEach((u) => userMap.set(u._id, u.name));

    // Review form state
    const addReview = useMutation(api.reviews.addReview);
    const addPoints = useMutation(api.users.addPoints);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitReview = async () => {
        if (!user) {
            Alert.alert("Error", "You must be logged in to review a book.");
            return;
        }

        const ratingNum = parseInt(rating, 10);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            Alert.alert("Invalid input", "Please enter a rating between 1 and 5.");
            return;
        }

        if (!comment.trim()) {
            Alert.alert("Invalid input", "Please enter a comment.");
            return;
        }

        try {
            setIsSubmitting(true);

            await addReview({
                bookId: id,
                userId: user._id,
                rating: ratingNum,
                comment: comment.trim(),
            });

            await addPoints({
                userId: user._id,
                amount: 10,
                activity: "review",
            });

            setUser({ ...user, points: user.points + 10 });

            Alert.alert("Success", "Review submitted! You earned 10 points.");
            setRating("");
            setComment("");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to submit the review.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
            <Text style={styles.reviewerName}>{userMap.get(item.userId) || "Unknown"}</Text>
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

                        {/* Write Review Form */}
                        <Text style={styles.sectionTitle}>Write a Review</Text>
                        <View style={styles.reviewFormCard}>
                            <Text style={styles.label}>Rating (1-5)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 5"
                                placeholderTextColor="#999"
                                value={rating}
                                onChangeText={setRating}
                                keyboardType="numeric"
                                maxLength={1}
                            />

                            <Text style={styles.label}>Comment</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="What did you think about this book?"
                                placeholderTextColor="#999"
                                value={comment}
                                onChangeText={setComment}
                                multiline
                                numberOfLines={4}
                            />

                            <Pressable
                                style={({ pressed }) => [
                                    styles.submitButton,
                                    pressed && styles.submitButtonPressed,
                                    isSubmitting && styles.submitButtonDisabled,
                                ]}
                                onPress={handleSubmitReview}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.submitButtonText}>
                                    {isSubmitting ? "Submitting..." : "Submit Review"}
                                </Text>
                            </Pressable>
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
    reviewFormCard: {
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
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#444",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E3E8F0",
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "#F5F7FB",
        color: "#222",
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
    reviewItem: {
        padding: 14,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E3E8F0",
    },
    reviewerName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 4,
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
        marginTop: 8,
        backgroundColor: "#0066cc",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    submitButtonPressed: {
        backgroundColor: "#004f99",
    },
    submitButtonDisabled: {
        backgroundColor: "#a0bfff",
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
