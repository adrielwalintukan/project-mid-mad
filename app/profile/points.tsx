import { useQuery } from "convex/react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function PointsScreen() {
  const { user } = useAuth();

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
      <Text style={styles.header}>Points History</Text>

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
    backgroundColor: "#EEF3FA",
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1F2937",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
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