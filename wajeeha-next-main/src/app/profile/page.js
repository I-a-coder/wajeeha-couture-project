"use client";

import Layout from "@/utilities/Layout";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { UserService } from "@/utilities/UserService";

const Profile = () => {
  const { currentUser, logout, uploadProfilePicture } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [orderHistory, setOrderHistory] = useState({ recent: [], total: 0 });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const fileInputRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    // Fetch recent orders if user is logged in
    const fetchRecentOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await UserService.getUserOrderHistory(currentUser.uid);
        if (response.success && response.data) {
          // Get only the most recent 3 orders
          setOrderHistory({
            recent: response.data.slice(0, 3),
            total: response.data.length
          });
        }
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchRecentOrders();
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

  // Format date function
  const formatDate = (date) => {
    if (!date) return "N/A";
    
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                  <Link href="/profile/addresses" className="text-pink-600 hover:text-pink-800">
                    Manage Addresses
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
        
        {/* Recent Orders Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg border mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          
          {loadingOrders ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
            </div>
          ) : orderHistory.recent.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Order #</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-right py-2">Total</th>
                      <th className="text-right py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.recent.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-3">#{order.id.slice(0, 8)}</td>
                        <td className="py-3">{formatDate(order.createdAt)}</td>
                        <td className="py-3 capitalize">{order.status || "pending"}</td>
                        <td className="py-3 text-right">Rs. {order.total}</td>
                        <td className="py-3 text-right">
                          <Link 
                            href={`/orders/order-detail?id=${order.id}`}
                            className="text-pink-600 hover:text-pink-800"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-right">
                <Link href="/orders" className="text-pink-600 hover:text-pink-800">
                  View All Orders ({orderHistory.total})
                </Link>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Link href="/collections" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors inline-block">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
        
        {/* Shipping Addresses Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Shipping Addresses</h2>
            <Link href="/profile/addresses" className="text-pink-600 hover:text-pink-800 text-sm">
              Manage Addresses
            </Link>
          </div>
          <p className="text-gray-600">Manage your shipping addresses for faster checkout.</p>
          <div className="mt-4">
            <Link href="/profile/addresses" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors inline-block">
              View Addresses
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 