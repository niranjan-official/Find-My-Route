// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBXBwLbuYU4PUfi3tmDH6-51bvbOwAAQc8",
  authDomain: "findmyroute-2156b.firebaseapp.com",
  databaseURL: "https://findmyroute-2156b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "findmyroute-2156b",
  storageBucket: "findmyroute-2156b.firebasestorage.app",
  messagingSenderId: "337767525095",
  appId: "1:337767525095:web:b3df38531da2b587c05042"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);