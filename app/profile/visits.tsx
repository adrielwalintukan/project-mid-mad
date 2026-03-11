import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function VisitHistoryScreen() {

  const { user } = useAuth();
  const router = useRouter();

  const visits = useQuery(
    api.visits.getVisitsByUser,
    user ? { userId: user._id } : "skip"
  );

  if (visits === undefined) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit History</Text>
      </View>

      {visits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No visit history yet.</Text>
        </View>
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>
                Visit Date: {new Date(item._creationTime).toLocaleDateString()}
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

  date: {
    fontSize: 16,
    color: "#333",
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
