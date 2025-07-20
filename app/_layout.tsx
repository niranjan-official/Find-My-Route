import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Text, View } from "react-native";
import { useAuth } from "@/src/auth";
import Loading from "@/components/home/Loading";
import Login from "@/app/Login";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    const User = useAuth();

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    if (User === undefined) {
        return <Loading />; // Keep showing Loading while checking auth
    }

    if (!User) {
        return <Login />; // Show login if user is not authenticated
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="MapScreen"
                    options={{
                        headerTitle: () => (
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                    Bus No: 3
                                </Text>
                                <Text style={{ fontSize: 14, color: "gray" }}>
                                    CHRY ↔ TVLA ↔ CGNR
                                </Text>
                            </View>
                        ),
                    }}
                />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
