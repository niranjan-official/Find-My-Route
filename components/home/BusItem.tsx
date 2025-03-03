import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Bus } from "@/types";
import { RootStackParamList } from "@/navigation/types";
import { useRouter } from "expo-router";

type NavigationProp = StackNavigationProp<RootStackParamList, "MapScreen">;

const BusItem = ({ bus }: { bus: Bus }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/MapScreen?busId=${bus.id}`)} 
    >
      <Text style={styles.busNumber}>{bus.bus_no}</Text>
      <Text style={styles.route}>{bus.route}</Text>
      <Ionicons name="chevron-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0C9FF",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  busNumber: {
    fontWeight: "bold",
    marginRight: 10,
  },
  route: {
    flex: 1,
  },
});

export default BusItem;
