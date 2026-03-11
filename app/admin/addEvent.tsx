import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function AddEventScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const addEvent = useMutation(api.events.addEvent);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user || user.role !== "admin") {
        return (
            <View style={styles.center}>
                <Text style={styles.unauthorized}>Unauthorized</Text>
            </View>
        );
    }

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please enter an event title.");
            return;
        }
        if (!description.trim()) {
            Alert.alert("Error", "Please enter a description.");
            return;
        }
        if (!date.trim()) {
            Alert.alert("Error", "Please enter a date (YYYY-MM-DD).");
            return;
        }

        const parsed = new Date(date.trim());
        if (isNaN(parsed.getTime())) {
            Alert.alert("Error", "Invalid date format. Use YYYY-MM-DD.");
            return;
        }

        try {
            setIsSubmitting(true);
            await addEvent({
                title: title.trim(),
                description: description.trim(),
                date: parsed.getTime(),
            });
            Alert.alert("Success", "Event created successfully!");
            router.back();
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to create event.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backArrow}>◀</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Event</Text>
            </View>

            <Text style={styles.subtitle}>Create a new event for students.</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Event title"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Event description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 2026-04-15"
                value={date}
                onChangeText={setDate}
            />

            <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <Text style={styles.submitText}>
                    {isSubmitting ? "Creating..." : "Create Event"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: 50,
        backgroundColor: "#EEF3FA",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    unauthorized: {
        fontSize: 18,
        color: "#EF4444",
        fontWeight: "600",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    backArrow: {
        fontSize: 22,
        color: "#0066cc",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1F2937",
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#444",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E3E8F0",
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "#FFFFFF",
        color: "#222",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#0066cc",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    submitButtonDisabled: {
        backgroundColor: "#a0bfff",
    },
    submitText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
