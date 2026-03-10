import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: true }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
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

            <Tabs.Screen
                name="points"
                options={{
                    title: "Points",
                }}
            />

            <Tabs.Screen
                name="visits"
                options={{
                    title: "Visits",
                }}
            />

            <Tabs.Screen
                name="notifications"
                options={{
                    title: "Notifications",
                }}
            />
        </Tabs>
    );
}