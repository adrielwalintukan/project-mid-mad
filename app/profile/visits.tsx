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

      {/* HEADER */}
      <Text style={styles.header}>Visit History</Text>

      {visits.length === 0 ? (
        <Text style={styles.empty}>No visit history yet.</Text>
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

container:{
flex:1,
backgroundColor:"#fff",
padding:20
},

header:{
fontSize:24,
fontWeight:"bold",
marginBottom:20
},

card:{
backgroundColor:"#f5f5f5",
padding:15,
borderRadius:10,
marginBottom:10
},

date:{
fontSize:16
},

empty:{
textAlign:"center",
marginTop:30,
color:"#666"
},

center:{
flex:1,
justifyContent:"center",
alignItems:"center"
}

});