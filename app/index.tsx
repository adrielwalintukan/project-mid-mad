import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function IndexScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [isReady, setIsReady] = useState(false);

    // Simulate a small loading phase (e.g. while fonts load or fetching session)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        if (user) {
            router.replace("/(tabs)");
        } else {
            router.replace("/auth/login");
        }
    }, [user, isReady, router]);

    // Show a loading spinner while redirecting / getting ready
    if (!isReady) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});