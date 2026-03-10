import { useMutation } from "convex/react";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function SetCodeScreen() {
    const { user } = useAuth();
    const [code, setCode] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const setVisitCode = useMutation(api.visitCodes.setVisitCode);

    // Block access if user is not an admin
    if (!user || user.role !== "admin") {
        return (
            <View style={styles.container}>
                <Text style={styles.unauthorized}>Not authorized</Text>
            </View>
        );
    }

    const handleSave = async () => {
        if (!code.trim()) {
            Alert.alert("Error", "Please enter a code.");
            return;
        }

        try {
            setIsSaving(true);
            await setVisitCode({ code: code.trim().toUpperCase() });
            Alert.alert("Success", `Visit code "${code.trim().toUpperCase()}" has been saved.`);
            setCode("");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to save code.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Set Visit Code</Text>
            <Text style={styles.subtitle}>Enter the code users will use to log their library visit.</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter new code (e.g. LIB123)"
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
            />

            <TouchableOpacity
                style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}
                onPress={handleSave}
                disabled={isSaving || code.trim() === ""}
            >
                <Text style={styles.submitButtonText}>
                    {isSaving ? "Saving..." : "Save Code"}
                </Text>
            </TouchableOpacity>
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
        marginBottom: 10,
        textAlign: "center",
        color: "#1F2937",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E3E8F0",
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "#F7F9FC",
        textAlign: "center",
    },
    unauthorized: {
        fontSize: 18,
        color: "#EF4444",
        textAlign: "center",
        marginTop: 40,
        fontWeight: "600",
    },
    submitButton: {
        backgroundColor: "#0066cc",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#0066cc",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: "#9CA3AF",
        shadowOpacity: 0.1,
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
});
