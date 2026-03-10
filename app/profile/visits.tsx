import { useQuery } from "convex/react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function VisitHistoryScreen() {

  const { user } = useAuth();

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
      <Text style={styles.header}>Visit History</Text>

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
  backgroundColor: "#EEF3FA",
  padding: 24,
},

header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
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