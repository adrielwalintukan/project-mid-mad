import useTheme from '@/hooks/useTheme';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function Index(){
  const {toggleDarkMode} = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.content}> This is Homepage</Text>
      <TouchableOpacity onPress={toggleDarkMode}>
        <Text>Toggle the mode</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center",
        alignItems: "center",
        gap:10,
    },
    content:{
        fontSize: 22,
    }
});
