import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function HomeScreen() {
    const { user, setUser } = useAuth();
    const [visitCode, setVisitCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addVisit = useMutation(api.visits.addVisit);
    const addPoints = useMutation(api.users.addPoints);

    // Check if the user already visited today (reactive query)
    const todayVisit = useQuery(
        api.visits.getTodayVisit,
        user ? { userId: user._id } : "skip"
    );

    // Fetch current active visit code from the database
    const visitCodeFromServer = useQuery(api.visitCodes.getVisitCode);

    const handleVisit = async () => {
        if (!user) return;

        // Validate against the active code in the database
        if (visitCodeFromServer === undefined) {
            Alert.alert("Please wait", "Loading visit code, try again shortly.");
            return;
        }

        if (!visitCodeFromServer) {
            Alert.alert("No code set", "The admin has not set a visit code yet.");
            return;
        }

        if (
            visitCode.trim().toUpperCase() !==
            visitCodeFromServer.code.toUpperCase()
        ) {
            Alert.alert("Invalid code", "The code you entered is incorrect.");
            return;
        }

        try {
            setIsSubmitting(true);

            // Check if user has already visited today
            // Only block if todayVisit is explicitly not null (a visit record exists)
            // Allow when null (no visit today) or undefined (still loading)
            // Check if query still loading
            if (todayVisit === undefined) {
                Alert.alert("Please wait", "Checking visit status...");
                return;
            }

            // Block if already visited
            if (todayVisit !== null) {
                Alert.alert("Already Visited", "You already visited today. Come back tomorrow!");
                return;
            }

            // Call addVisit and addPoints as requested
            await addVisit({ userId: user._id });
            await addPoints({
                userId: user._id,
                amount: 5,
                activity: "visit"
            });

            // Update the context state to reflect the 5 added points
            setUser({ ...user, points: user.points + 5 });
            Alert.alert("Success", "Visit logged! You earned 5 points.");
            setVisitCode(""); // Clear the input field
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to log visit.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                Welcome, {user?.name || "Guest"}!
            </Text>
            <Text style={styles.points}>
                Your Points: {user?.points || 0}
            </Text>

            <View style={styles.visitContainer}>
                <Text style={styles.visitTitle}>Visit Library</Text>
                <Text style={styles.visitLabel}>Enter the library code to mark your visit and earn points:</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter code"
                    value={visitCode}
                    onChangeText={setVisitCode}
                    autoCapitalize="characters"
                />

                <Button
                    title={isSubmitting ? "Submitting..." : "Visit Library"}
                    onPress={handleVisit}
                    disabled={isSubmitting || visitCode.trim() === ""}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    welcome: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    points: {
        fontSize: 18,
        color: "#666",
        marginBottom: 30, // Space between points and the new visit container
    },
    visitContainer: {
        width: "100%",
        backgroundColor: "#f9f9f9",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    visitTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
        textAlign: "center",
    },
    visitLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "#fff",
        textAlign: "center",
    },
});
