"use client";

import Layout from "@/utilities/Layout";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const Profile = () => {
  const { currentUser, logout, uploadProfilePicture } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleLogout = async () => {
    try {
      setError("");
      setLoading(true);
      await logout();
      router.push("/");
    } catch (error) {
      setError("Failed to log out");
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureClick = () => {
    if (uploadingPicture) return; // Prevent clicking while uploading
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    try {
      setUploadingPicture(true);
      setError("");
      toast.loading("Uploading profile picture...");
      
      await uploadProfilePicture(file);
      toast.dismiss();
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.dismiss();
      setError("Failed to update profile picture");
      toast.error("Failed to update profile picture. Please try again.");
    } finally {
      setUploadingPicture(false);
    }
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Please log in to view your profile</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg border mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-semibold">My Account</h1>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="mt-4 md:mt-0 bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center md:items-start">
              {/* Profile Photo */}
              <div className="relative w-32 h-32 mb-4 group cursor-pointer" onClick={handleProfilePictureClick}>
                {currentUser.photoURL ? (
                  <>
                    <div 
                      className="w-32 h-32 rounded-full border-2 border-gray-200 bg-cover bg-center"
                      style={{ backgroundImage: `url(${currentUser.photoURL})` }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs text-center px-2">
                        {uploadingPicture ? "Uploading..." : "Change Photo"}
                      </p>
                    </div>
                    {uploadingPicture && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                    {uploadingPicture ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs text-center px-2">Upload Photo</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
              />
              
              <p className="text-sm text-gray-500 mb-4">
                {uploadingPicture 
                  ? "Uploading image... Please wait." 
                  : "Click on the image to update your profile picture"}
              </p>
              
              <h2 className="text-lg font-medium mb-3">Account Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {currentUser.displayName || "Not set"}</p>
                <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                <p><span className="font-medium">Account created:</span> {currentUser.metadata.creationTime}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-3">Account Actions</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/update-profile" className="text-pink-600 hover:text-pink-800">
                    Update Profile
                  </Link>
                </li>
                <li>
                  <Link href="/change-password" className="text-pink-600 hover:text-pink-800">
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="text-pink-600 hover:text-pink-800">
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <p className="text-gray-600 mb-4">View your complete order history and track your purchases.</p>
          <Link href="/orders" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors inline-block">
            View All Orders
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 