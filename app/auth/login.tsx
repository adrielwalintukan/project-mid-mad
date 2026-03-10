import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

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

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            
            <View style={{ height: 15 }} />

            <TouchableOpacity onPress={() => router.push("/auth/register")}> 
                <Text style={styles.linkText}>Dont have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#EEF3FA",
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 30,
        textAlign: "center",
        color: "#2C6EBA",
        letterSpacing: 1,
    },

    input: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#E3E8F0",
        padding: 16,
        marginBottom: 18,
        borderRadius: 16,
        fontSize: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },

    error: {
        backgroundColor: "#FFEAEA",
        color: "#C62828",
        marginBottom: 18,
        padding: 12,
        borderRadius: 12,
        textAlign: "center",
        fontWeight: "500",
    },

    roleLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 10,
    },

    roleContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 22,
    },

    roleButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },

    roleButtonActive: {
        backgroundColor: "#E5E7EB",
        borderColor: "#D1D5DB",
    },

    roleButtonText: {
        fontSize: 15,
        color: "#4B5563",
        fontWeight: "500",
    },

    roleButtonTextActive: {
        color: "#1F2937",
        fontWeight: "700",
    },
    linkText: {
        textAlign: "center",
        color: "#4b6cb7",
        textDecorationLine: "underline",
        fontSize: 15,
        marginTop: 14,
    },
    loginButton: {
    backgroundColor: "#2C6EBA",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#2C6EBA",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 6,
    },
    loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
    },
});