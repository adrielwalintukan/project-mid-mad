import { useQuery } from "convex/react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function VisitsScreen() {
  const { user } = useAuth();

  const visits = useQuery(
    api.visits.getVisitsByUser,
    user ? { userId: user._id } : "skip"
  );

  if (!visits) {
    return (
      <View style={styles.center}>
        <Text>Loading visits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visit History</Text>

      <Text style={styles.total}>
        Total Visits: {visits.length}
      </Text>

      {visits.length === 0 ? (
        <Text style={styles.empty}>No visits yet</Text>
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleString()}
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
    marginBottom: 10,
  },

  total: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },

  date: {
    fontSize: 16,
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