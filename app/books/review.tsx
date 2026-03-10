import { useMutation } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
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

            <Text style={styles.label}>Rating (1-5)</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 5"
                value={rating}
                onChangeText={setRating}
                keyboardType="numeric"
                maxLength={1}
            />

            <Text style={styles.label}>Comment</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What did you think about this book?"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
            />

            <Button
                title={isSubmitting ? "Submitting..." : "Submit Review"}
                onPress={handleSubmit}
                disabled={isSubmitting}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#444",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "#fafafa",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
});
