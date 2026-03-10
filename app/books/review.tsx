import { useMutation } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function ReviewScreen() {
    const router = useRouter();
    const { bookId } = useLocalSearchParams<{ bookId: string }>();
    const { user, setUser } = useAuth(); // We need setUser to update local session points

    const addReview = useMutation(api.reviews.addReview);
    const addPoints = useMutation(api.users.addPoints);

    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        // Basic validation
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

            // 1. Save the review to the database
            await addReview({
                bookId: bookId as Id<"books">,
                userId: user._id,
                rating: ratingNum,
                comment: comment.trim(),
            });

            // 2. Award 10 points to the user for the activity
            await addPoints({
                userId: user._id,
                amount: 10,
                activity: "review",
            });

            // Update the local context so UI reflects the extra points immediately
            setUser({ ...user, points: user.points + 10 });

            // 3. Return to the previous screen (Book Detail)
            router.back();

        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to submit the review.");
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Write a Review</Text>

            <View style={styles.card}>
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
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#EEF3FA",
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 16,
        color: "#1F2937",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: 10,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E3E8F0",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
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
});
