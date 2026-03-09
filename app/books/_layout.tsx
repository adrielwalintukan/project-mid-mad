import React from "react";
import { Stack } from "expo-router";

export default function BooksLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="detail"
                options={{
                    title: "Book Status",
                    headerShown: true
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
