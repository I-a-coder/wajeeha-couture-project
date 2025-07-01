"use client";

import Layout from "@/utilities/Layout";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProfile, updateEmail } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import Image from "next/image";

const UpdateProfile = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setDisplayName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      setPhotoURL(currentUser.photoURL || "");
    }
  }, [currentUser, router]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.includes("image/")) {
        setError("Please select an image file");
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }
      
      setPhotoFile(file);
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoURL(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!photoFile) return photoURL;
    
    const fileExtension = photoFile.name.split('.').pop();
    const fileName = `profile_${currentUser.uid}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile_photos/${fileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, photoFile);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      return;
    }
    
    setLoading(true);
    setMessage("");
    setError("");

    try {
      let updatedPhotoURL = photoURL;
      
      // Upload photo if a new one is selected
      if (photoFile) {
        updatedPhotoURL = await uploadProfilePhoto();
      }
      
      // Update profile in Firebase Auth
      await updateProfile(currentUser, { 
        displayName,
        photoURL: updatedPhotoURL
      });
      
      // Update email if changed
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }
      
      setMessage("Profile updated successfully!");
      
      // Refresh page after 1.5 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. " + err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Please log in to update your profile</p>
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
            <h1 className="text-2xl font-semibold mb-6">Update Your Profile</h1>
            
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
            
            {/* Profile Photo Section */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                {photoURL ? (
                  <Image 
                    src={photoURL} 
                    alt="Profile" 
                    fill
                    className="object-cover rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              
              <button 
                type="button" 
                onClick={triggerFileInput}
                className="bg-gray-100 text-gray-700 py-1 px-3 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                {photoURL ? "Change Photo" : "Upload Photo"}
              </button>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">{Math.round(uploadProgress)}% Uploaded</p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProfile; 