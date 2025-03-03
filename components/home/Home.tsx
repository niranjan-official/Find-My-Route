import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BusList from "./BusList";
import SearchBar from "./SearchBar";
import { Bus } from "@/types";

const Home = () => {

  const buses: Bus[] = [
    { id: "device_1", bus_no: 3, route: "CGNR → TVLA → CHRY" },
    { id: "device_2", bus_no: 4, route: "MVLK → KYLM → OCR" },
    { id: "device_3", bus_no: 5, route: "CHNR → KYLM → OCR" },
    { id: "device_4", bus_no: 6, route: "MVLK → KYLM → CHRY" },
  ];

  return (
    <View style={styles.container}>
      <SearchBar />
      <BusList buses={buses} />
      {/* <BottomNavigation />y */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    backgroundColor: "#111",
    color: "white",
    fontSize: 20,
    padding: 15,
    fontWeight: "bold",
  },
});

export default Home;
