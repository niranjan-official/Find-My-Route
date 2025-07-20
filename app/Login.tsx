import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/src/firebaseConfig";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            Alert.alert("Login Failed", errorMessage);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>Sign in</Text>
            
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ width: "100%", padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 }}
            />
            
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ width: "100%", padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 20 }}
            />
            
            <TouchableOpacity 
                style={{ backgroundColor: "#4285F4", padding: 12, borderRadius: 8, width: "100%", alignItems: "center" }}
                onPress={handleLogin}
            >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Sign in</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;