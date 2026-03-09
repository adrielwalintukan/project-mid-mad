import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: true }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    // tabBarIcon options can be added later
                }}
            />
            <Tabs.Screen
                name="books"
                options={{
                    title: "Books",
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: "Events",
                }}
            />
            <Tabs.Screen
                name="leaderboard"
                options={{
                    title: "Leaderboard",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                }}
            />
        </Tabs>
    );
}