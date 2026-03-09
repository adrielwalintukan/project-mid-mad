import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
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
    const [errorMsg, setErrorMsg] = useState("");

    const handleRegister = async () => {
        try {
            setErrorMsg("");
            await registerUser({
                name,
                nim,
                faculty,
                email,
                password,
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

            <TextInput
                style={styles.input}
                placeholder="NIM"
                value={nim}
                onChangeText={setNim}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Faculty"
                value={faculty}
                onChangeText={setFaculty}
            />

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
    }
});
