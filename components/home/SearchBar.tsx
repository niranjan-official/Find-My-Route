import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="bus-outline" size={20} color="black" />
      <TextInput style={styles.input} placeholder="Bus No. / Bus Name" />
      <Ionicons name="search" size={20} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default SearchBar;
