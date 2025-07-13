"use client";

import Layout from "@/utilities/Layout";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import toast from "react-hot-toast";

const Profile = () => {
  const { currentUser, logout, uploadProfilePicture } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else {
      fetchRecentOrders();
    }
  }, [currentUser, router]);

  const fetchRecentOrders = async () => {
    if (!currentUser) return;

    try {
      setOrdersLoading(true);
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);
      const ordersList = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let createdAt = data.createdAt;
        if (createdAt && typeof createdAt.toDate === 'function') {
          createdAt = createdAt.toDate();
        } else if (!createdAt) {
          createdAt = new Date();
        }
        
        ordersList.push({ 
          id: doc.id,
          ...data,
          createdAt: createdAt
        });
      });
      
      setRecentOrders(ordersList);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="min-h-screen p-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-1">
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
                
                <p className="text-sm text-gray-500 mb-4 text-center md:text-left">
                  {uploadingPicture 
                    ? "Uploading image... Please wait." 
                    : "Click on the image to update your profile picture"}
                </p>
                
                <h2 className="text-lg font-medium mb-3">Account Information</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {currentUser.displayName || "Not set"}</p>
                  <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                  <p><span className="font-medium">Account created:</span> {new Date(currentUser.metadata.creationTime).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border">
              <h2 className="text-lg font-medium mb-3">Account Actions</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/update-profile" className="text-pink-600 hover:text-pink-800 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Update Profile
                  </Link>
                </li>
                <li>
                  <Link href="/change-password" className="text-pink-600 hover:text-pink-800 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Change Password
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="text-pink-600 hover:text-pink-800 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12m-8-8h12M8 16h8m-8-8a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-lg border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link href="/orders" className="text-pink-600 hover:text-pink-800 text-sm">
                  View All Orders →
                </Link>
              </div>
              
              {ordersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <Link href="/collections" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {order.items.length} item(s) • Rs. {order.total}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                        </span>
                        <Link
                          href={`/order-confirmation?orderId=${order.id}`}
                          className="text-pink-600 hover:text-pink-800 text-sm"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-8 rounded-lg shadow-lg border mt-6">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/collections" className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div>
                      <h3 className="font-medium">Shop Collections</h3>
                      <p className="text-sm opacity-90">Browse our latest collections</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/contact" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="font-medium">Contact Support</h3>
                      <p className="text-sm opacity-90">Get help with your orders</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 