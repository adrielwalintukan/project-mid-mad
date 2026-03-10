import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
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

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleVisit}
              disabled={isSubmitting || visitCode.trim() === ""}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Visit Library"}
              </Text>
            </TouchableOpacity>
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
    padding: 24,
    backgroundColor: "#EEF3FA",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF3FA",
  },

  welcome: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 5,
    color: "#1F2937",
  },

  points: {
    fontSize: 18,
    color: "#0066cc",
    marginBottom: 25,
    fontWeight: "600",
  },

  visitContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E3E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  visitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#1F2937",
  },

  visitLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E3E8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    textAlign: "center",
    backgroundColor: "#F7F9FC",
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1F2937",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },

  bookItem: {
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

  submitButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#0066cc",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
