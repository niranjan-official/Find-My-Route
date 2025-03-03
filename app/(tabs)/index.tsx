import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import Home from "@/components/home/Home";
import { Header } from "react-native-elements";

export default function HomeScreen() {
  return (
    <>
      {/* Set the status bar text/icons to white */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#121619"
        translucent={false}
      />

      <Header
        placement="left"
        leftComponent={{ icon: "menu", color: "#fff" }}
        centerComponent={{
          text: "Find My Route",
          style: { color: "#fff", fontSize: 20 },
        }}
        rightComponent={{ icon: "home", color: "#fff" }}
        containerStyle={{
          backgroundColor: "#121619",
          alignItems: "center",
          paddingVertical: 15, // Increase vertical padding
        }}
        statusBarProps={{
          barStyle: "light-content", // Ensures status bar icons are white
          backgroundColor: "#121619",
        }}
      />
      <Home />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
