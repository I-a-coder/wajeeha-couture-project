"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase";

// Create the authentication context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Update user profile
  function updateUserProfile(user, data) {
    return updateProfile(user, data);
  }

  // Upload profile picture and update user profile using Base64
  async function uploadProfilePicture(file) {
    if (!currentUser) {
      throw new Error("No user logged in");
    }
    
    try {
      console.log("Starting profile picture upload process");
      
      // Convert the file to a base64 string
      const base64String = await convertFileToBase64(file);
      
      // Update the user profile with the base64 string as photoURL
      // Note: Firebase auth has a size limit, so we'll use a smaller image
      // We'll resize the image first to ensure it's not too large
      const resizedBase64 = await resizeImage(base64String, 200, 200);
      
      console.log("Updating user profile with base64 image...");
      await updateProfile(currentUser, { photoURL: resizedBase64 });
      console.log("User profile updated successfully");
      
      // Force refresh the current user to get the updated profile
      const user = auth.currentUser;
      if (user) {
        // Update local user state to reflect changes
        setCurrentUser({ ...user });
        console.log("Local user state updated with refreshed user data");
      }
      
      return resizedBase64;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  }

  // Helper function to convert a file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Helper function to resize an image
  const resizeImage = (base64, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get the resized base64 image
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality
        resolve(resizedBase64);
      };
    });
  };

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Password reset function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Effect to handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    uploadProfilePicture
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 