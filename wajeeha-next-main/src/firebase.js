// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTyZJnZwN-Um6ZpVKXSVZTU4rqt620YNg",
  authDomain: "wajeeha-couture.firebaseapp.com",
  projectId: "wajeeha-couture",
  storageBucket: "wajeeha-couture.appspot.com",
  messagingSenderId: "219652552888",
  appId: "1:219652552888:web:dfe66b582cbe7b13729c4d",
  measurementId: "G-HT5BFZ8TJC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics only if supported and in a client environment
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  });
}

export { db, analytics };
