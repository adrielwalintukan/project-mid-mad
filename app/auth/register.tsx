import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../../convex/_generated/api";

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
    const [submitted, setSubmitted] = useState(false);

    const isAdmin = role === "admin";

    const handleRegister = async () => {
        setSubmitted(true);
        try {
            setErrorMsg("");

            // Check required fields
            const missingFields = !name.trim() || !email.trim() || !password.trim()
                || (!isAdmin && (!nim.trim() || !faculty.trim()));
            if (missingFields) {
                setErrorMsg("Please fill in all required fields.");
                return;
            }

            // Frontend validation: student email domain
            if (role === "student" && !email.endsWith("@student.unklab.ac.id")) {
                setErrorMsg("Please use your student email (@student.unklab.ac.id)");
                return;
            }

            // Frontend validation: admin email domain
            if (role === "admin" && !email.endsWith("@admin.unklab.ac.id")) {
                setErrorMsg("Please use your admin email (@admin.unklab.ac.id)");
                return;
            }

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
                style={[styles.input, submitted && !name.trim() && styles.inputError]}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            {!isAdmin && (
                <TextInput
                    style={[styles.input, submitted && !nim.trim() && styles.inputError]}
                    placeholder="NIM"
                    value={nim}
                    onChangeText={setNim}
                    keyboardType="numeric"
                />
            )}

            {!isAdmin && (
                <TextInput
                    style={[styles.input, submitted && !faculty.trim() && styles.inputError]}
                    placeholder="Faculty"
                    value={faculty}
                    onChangeText={setFaculty}
                />
            )}

            <TextInput
                style={[styles.input, submitted && !email.trim() && styles.inputError]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={[styles.input, submitted && !password.trim() && styles.inputError]}
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

            <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        backgroundColor: "#FFFFFF",
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

    inputError: {
        borderColor: "#EF4444",
        borderWidth: 2,
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

    spacer: {
        height: 18,
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