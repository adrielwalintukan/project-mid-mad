import { useMutation, useQuery } from "convex/react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function NotificationsScreen() {
  const { user } = useAuth();

  const notifications = useQuery(
    api.notifications.getNotificationsByUser,
    user ? { userId: user._id } : "skip"
  );

  const markAsRead = useMutation(api.notifications.markAsRead);

  if (!notifications) {
    return (
      <View style={styles.center}>
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  const handleRead = async (id: any, isRead: boolean) => {
    if (!isRead) {
      await markAsRead({ notificationId: id });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                !item.isRead && styles.unread
              ]}
              onPress={() => handleRead(item._id, item.isRead)}
            >
              <Text style={styles.message}>{item.message}</Text>

              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>

              <Text style={styles.status}>
                {item.isRead ? "Read" : "Unread"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },

  unread: {
    backgroundColor: "#e8f0fe",
  },

  message: {
    fontSize: 16,
    marginBottom: 5,
  },

  date: {
    fontSize: 13,
    color: "#666",
  },

  status: {
    fontSize: 12,
    marginTop: 5,
    color: "#444",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});