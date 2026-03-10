import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../convex/_generated/api";

export default function HomeScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [visitCode, setVisitCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addVisit = useMutation(api.visits.addVisit);
  const addPoints = useMutation(api.users.addPoints);

  const books = useQuery(api.books.getBooks);

  const todayVisit = useQuery(
    api.visits.getTodayVisit,
    user ? { userId: user._id } : "skip"
  );

  const visitCodeFromServer = useQuery(api.visitCodes.getVisitCode);

  const handleVisit = async () => {
    if (!user) return;

    if (visitCodeFromServer === undefined) {
      Alert.alert("Please wait", "Loading visit code...");
      return;
    }

    if (!visitCodeFromServer) {
      Alert.alert("No code set", "Admin has not set a visit code.");
      return;
    }

    if (
      visitCode.trim().toUpperCase() !==
      visitCodeFromServer.code.toUpperCase()
    ) {
      Alert.alert("Invalid code", "The code you entered is incorrect.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (todayVisit !== null) {
        Alert.alert(
          "Already Visited",
          "You already visited today. Come back tomorrow!"
        );
        return;
      }

      await addVisit({ userId: user._id });

      await addPoints({
        userId: user._id,
        amount: 5,
        activity: "visit",
      });

      setUser({
        ...user,
        points: user.points + 5,
      });

      Alert.alert("Success", "Visit logged! You earned 5 points.");
      setVisitCode("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to log visit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBook = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() =>
        router.push({
          pathname: "/books/detail",
          params: { bookId: item._id },
        })
      }
    >
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookDetails}>Author: {item.author}</Text>
      <Text style={styles.bookDetails}>Faculty: {item.faculty}</Text>
    </TouchableOpacity>
  );

  if (books === undefined) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={books.slice(0, 5)}
      keyExtractor={(item) => item._id}
      renderItem={renderBook}
      ListHeaderComponent={
        <View>
          {/* WELCOME */}
          <Text style={styles.welcome}>
            Welcome, {user?.name || "Guest"}!
          </Text>

          <Text style={styles.points}>
            Your Points: {user?.points || 0}
          </Text>

          {/* VISIT LIBRARY */}
          <View style={styles.visitContainer}>
            <Text style={styles.visitTitle}>Visit Library</Text>

            <Text style={styles.visitLabel}>
              Enter the library code to mark your visit and earn points
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter code"
              value={visitCode}
              onChangeText={setVisitCode}
              autoCapitalize="characters"
            />

            <Button
              title={isSubmitting ? "Submitting..." : "Visit Library"}
              onPress={handleVisit}
              disabled={isSubmitting || visitCode.trim() === ""}
            />
          </View>

          {/* RECOMMENDED BOOKS */}
          <Text style={styles.sectionTitle}>Recommended Books</Text>
        </View>
      }
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },

  points: {
    fontSize: 18,
    color: "#666",
    marginBottom: 25,
  },

  visitContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },

  visitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },

  visitLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  bookItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },

  bookDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});