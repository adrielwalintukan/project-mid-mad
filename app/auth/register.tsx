import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const router = useRouter();
    const registerUser = useMutation(api.users.registerUser);

    const [name, setName] = useState("");
    const [nim, setNim] = useState("");
    const [faculty, setFaculty] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [errorMsg, setErrorMsg] = useState("");

    const isAdmin = role === "admin";

    const handleRegister = async () => {
        try {
            setErrorMsg("");
            await registerUser({
                name,
                nim,
                faculty,
                email,
                password,
                role,
            });
            // On success, navigate to the login screen
            router.replace("/auth/login");
        } catch (error: any) {
            setErrorMsg(error.message || "Registration failed. Please try again.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Register</Text>

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            {!isAdmin && (
                <TextInput
                    style={styles.input}
                    placeholder="NIM"
                    value={nim}
                    onChangeText={setNim}
                    keyboardType="numeric"
                />
            )}

            {!isAdmin && (
                <TextInput
                    style={styles.input}
                    placeholder="Faculty"
                    value={faculty}
                    onChangeText={setFaculty}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Text style={styles.roleLabel}>Role</Text>
            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[styles.roleButton, role === "student" && styles.roleButtonActive]}
                    onPress={() => setRole("student")}
                >
                    <Text style={[styles.roleButtonText, role === "student" && styles.roleButtonTextActive]}>
                        Student
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.roleButton, role === "admin" && styles.roleButtonActive]}
                    onPress={() => setRole("admin")}
                >
                    <Text style={[styles.roleButtonText, role === "admin" && styles.roleButtonTextActive]}>
                        Admin
                    </Text>
                </TouchableOpacity>
            </View>

            <Button title="Register" onPress={handleRegister} />

            <View style={styles.spacer} />

            <Button
                title="Already have an account? Login here"
                onPress={() => router.replace("/auth/login")}
                color="#888"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 16,
    },
    error: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
    },
    spacer: {
        height: 15,
    },
    roleLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#444",
        marginBottom: 10,
    },
    roleContainer: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    roleButtonActive: {
        backgroundColor: "#0066cc",
        borderColor: "#0066cc",
    },
    roleButtonText: {
        fontSize: 15,
        color: "#555",
        fontWeight: "500",
    },
    roleButtonTextActive: {
        color: "#fff",
        fontWeight: "bold",
    },
});
