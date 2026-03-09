import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
    const router = useRouter();
    const { setUser } = useAuth();
    const loginUser = useMutation(api.users.loginUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async () => {
        try {
            setErrorMsg("");
            const user = await loginUser({ email, password, role });
            if (user) {
                // Set the session user
                setUser(user);
                // Route based on role
                if (user.role === "admin") {
                    router.replace("/admin/setCode");
                } else {
                    router.replace("/(tabs)/home");
                }
            }
        } catch (error: any) {
            // Show error message if login fails
            setErrorMsg(error.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

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

            <Button title="Login" onPress={handleLogin} />

            <View style={{ height: 15 }} />

            <Button
                title="Go to register"
                onPress={() => router.push("/auth/register")}
                color="#888"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
