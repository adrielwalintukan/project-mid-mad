import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Tabs, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

function NotificationIcon() {

  const router = useRouter();
  const { user } = useAuth();

  const notifications = useQuery(
    api.notifications.getNotificationsByUser,
    user ? { userId: user._id } : "skip"
  );

  const count = notifications?.length || 0;

  return (
    <Pressable
      onPress={() => router.push("/notifications")}
      style={{ marginRight: 15 }}
    >
      <View>

        <Ionicons name="notifications-outline" size={24} color="black" />

        {count > 0 && (
          <View
            style={{
              position: "absolute",
              right: -5,
              top: -5,
              backgroundColor: "red",
              borderRadius: 10,
              minWidth: 16,
              height: 16,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "white", fontSize: 10 }}>
              {count}
            </Text>
          </View>
        )}

      </View>
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerRight: () => <NotificationIcon />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="books"
        options={{ 
          title: "Books",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="events"
        options={{ 
          title: "Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="leaderboard"
        options={{ 
          title: "Leaderboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden from tabs */}
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          title: "Notifications"
        }}
      />

    </Tabs>
  );
}
