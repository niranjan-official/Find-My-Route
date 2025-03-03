import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BusItem from "./BusItem";
import { Bus } from "@/types";

const BusList = ({ buses }:{buses: Bus[]}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AVAILABLE BUSES</Text>
      {buses?.map((bus: Bus) => (
        <BusItem key={bus.id} bus={bus} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default BusList;
