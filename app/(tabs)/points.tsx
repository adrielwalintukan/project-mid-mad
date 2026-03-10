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
      <Text style={styles.title}>Points History</Text>

      {points.length === 0 ? (
        <Text style={styles.empty}>No point activity yet</Text>
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
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
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