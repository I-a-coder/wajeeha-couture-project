"use client";

import Layout from "@/utilities/Layout";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const ChangePassword = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      return;
    }
    
    // Password validation
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Change password
      await updatePassword(currentUser, newPassword);
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setMessage("Password changed successfully!");
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      console.error("Error changing password:", err);
      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect");
      } else {
        setError("Failed to change password. " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Please log in to change your password</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4">
        <div className="max-w-lg mx-auto">
          <div className="mb-4">
            <Link 
              href="/profile" 
              className="flex items-center text-gray-700 hover:text-pink-600 transition-colors py-2 px-4 bg-white shadow-sm border rounded-md inline-block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg border">
            <h1 className="text-2xl font-semibold mb-6">Change Password</h1>
            
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {message}
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {loading ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword; 