import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const Loading = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
        </View>
    );
};

export default Loading;