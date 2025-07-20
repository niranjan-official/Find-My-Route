import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth"; // Import User type

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // Explicitly define type

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {

      if (user) {
        console.log("User Found");
        setUser(user);

        // Store user in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        console.log("No user found.");
        setUser(null);

        // Remove user data from AsyncStorage
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("userData");
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
};
