import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

function BackButton() {
    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.replace("/(tabs)/books")}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
    );
}

export default function BooksLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="detail"
                options={{
                    title: "Book Status",
                    headerShown: true,
                    headerLeft: () => <BackButton />,
                }}
            />
            <Stack.Screen
                name="review"
                options={{
                    title: "Book Review",
                    headerShown: true
                }}
            />
        </Stack>
    );
}
