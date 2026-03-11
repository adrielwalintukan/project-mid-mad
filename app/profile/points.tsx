import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function PointsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const points = useQuery(
    api.points.getPointsByUser,
    user ? { userId: user._id } : "skip"
  );

  if (!points) {
    return (
      <View style={styles.center}>
        <Text>Loading points...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Points History</Text>
      </View>

      {points.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No point activity yet</Text>
        </View>
      ) : (
        <FlatList
          data={points}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.activity}>{item.activity}</Text>

              <Text style={styles.amount}>+{item.amount} pts</Text>

              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#EEF3FA",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    padding: 4,
    marginRight: 12,
  },

  backArrow: {
    fontSize: 22,
    color: "#0066cc",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E3E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  activity: {
    fontSize: 16,
    fontWeight: "600",
  },

  amount: {
    fontSize: 16,
    color: "#2e7d32",
    marginTop: 5,
  },

  date: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  empty: {
    textAlign: "center",
    color: "#888",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
