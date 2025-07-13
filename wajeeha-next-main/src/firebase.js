// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQNR6i2Ka4nZCC5LPe5hB9X7YY0xATSNU",
  authDomain: "wajeeha-courture.firebaseapp.com",
  databaseURL: "https://wajeeha-courture-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wajeeha-courture",
  storageBucket: "wajeeha-courture.appspot.com", // <-- FIXED
  messagingSenderId: "519618015875",
  appId: "1:519618015875:web:5adbfa50b51a724224a1b6",
  measurementId: "G-K11ZY6FPXW"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app);

// Set persistent auth state
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
}

// Initialize Analytics only if supported and in a client environment
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  });
}

// Helper functions for working with Firestore
const serverTimestamp = () => {
  const { serverTimestamp } = require("firebase/firestore");
  return serverTimestamp();
};

export { db, auth, storage, analytics, serverTimestamp };
