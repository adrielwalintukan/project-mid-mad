import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../convex/_generated/api";



export default function BooksScreen() {
    const router = useRouter();
    // Query all books from Convex
    const books = useQuery(api.books.getBooks);

    // If data is still loading (null), show a loading indicator
    if (books === undefined) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading books...</Text>
            </View>
        );
    }

    // Render an individual item for the FlatList
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.bookItem}
            activeOpacity={0.7}
            onPress={() => {
                router.push({
                    pathname: "/books/detail",
                    params: { bookId: item._id }
                });
            }}
        >
            <View style={styles.bookRow}>
                {item.coverUrl ? (
                    <Image source={{ uri: item.coverUrl }} style={styles.coverImage} />
                ) : (
                    <View style={styles.placeholderCover}>
                        <Text style={styles.placeholderText}>No Cover</Text>
                    </View>
                )}

                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.bookAuthor}>By {item.author}</Text>

                    <View style={styles.facultyBadge}>
                        <Text style={styles.facultyText}>{item.faculty}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Library Catalog</Text>

            {books.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No books available.</Text>
                </View>
            ) : (
                <FlatList
                    data={books}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
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
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#888",
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 16,
        color: "#1F2937",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingBottom: 10,
        textAlign: "center",
    },
    listContainer: {
        paddingTop: 12,
        paddingBottom: 20,
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
    bookRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    coverImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
        backgroundColor: "#E5E7EB",
    },
    placeholderCover: {
        width: 80,
        height: 120,
        borderRadius: 8,
        backgroundColor: "#E5E7EB",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        fontSize: 10,
        color: "#9CA3AF",
        textAlign: "center",
    },
    bookInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: "center",
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#1F2937",
    },
    bookAuthor: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 10,
        fontWeight: "500",
    },
    facultyBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#E0F2FE",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    facultyText: {
        fontSize: 12,
        color: "#0369A1",
        fontWeight: "600",
    },
    loadingText: {
        marginTop: 10,
        color: "#666",
    }
});
