import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";

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

            <Button
                title={isSaving ? "Saving..." : "Save Code"}
                onPress={handleSave}
                disabled={isSaving || code.trim() === ""}
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
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: "#fafafa",
        textAlign: "center",
    },
    unauthorized: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
        marginTop: 40,
    },
});
