"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import AdminLayout from "../layout";

const AdminSetupPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCollections: 0,
    totalUsers: 0
  });
  const [emailSettings, setEmailSettings] = useState({
    orderNotifications: true,
    statusUpdates: true,
    marketingEmails: false
  });

  // Check if user is admin
  const isAdmin = currentUser?.email === "admin@wajeehacouture.com" || 
                  currentUser?.email === "wajeehahashmi1995@gmail.com" || 
                  currentUser?.email === "hamnashafeeq10@gmail.com";

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (!isAdmin) {
      router.push("/");
      return;
    }

    fetchStats();
  }, [currentUser, isAdmin, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch orders count
      const ordersRef = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersRef);
      
      // Fetch products count (you'll need to implement this based on your product structure)
      const productsRef = collection(db, "products");
      const productsSnapshot = await getDocs(productsRef);
      
      // Fetch collections count
      const collectionsRef = collection(db, "collections");
      const collectionsSnapshot = await getDocs(collectionsRef);
      
      setStats({
        totalOrders: ordersSnapshot.size,
        totalProducts: productsSnapshot.size,
        totalCollections: collectionsSnapshot.size,
        totalUsers: 0 // You can implement user counting if needed
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSettingChange = (setting, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveEmailSettings = async () => {
    try {
      setLoading(true);
      
      // Save email settings to Firestore
      const settingsRef = collection(db, "settings");
      await addDoc(settingsRef, {
        type: "email",
        settings: emailSettings,
        updatedBy: currentUser.uid,
        updatedAt: new Date()
      });
      
      toast.success("Email settings saved successfully!");
    } catch (error) {
      console.error("Error saving email settings:", error);
      toast.error("Failed to save email settings");
    } finally {
      setLoading(false);
    }
  };

  const exportOrdersData = async () => {
    try {
      setLoading(true);
      
      const ordersRef = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersRef);
      
      const ordersData = [];
      ordersSnapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: doc.id,
          customerName: data.shippingDetails?.fullName || "N/A",
          customerEmail: data.shippingDetails?.email || "N/A",
          total: data.total || 0,
          status: data.status || "pending",
          createdAt: data.createdAt?.toDate?.() || new Date(),
          paymentMethod: data.paymentMethod || "N/A"
        });
      });
      
      // Create CSV content
      const csvContent = [
        "Order ID,Customer Name,Customer Email,Total,Status,Date,Payment Method",
        ...ordersData.map(order => 
          `${order.id},${order.customerName},${order.customerEmail},${order.total},${order.status},${order.createdAt.toLocaleDateString()},${order.paymentMethod}`
        )
      ].join('\n');
      
      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Orders data exported successfully!");
    } catch (error) {
      console.error("Error exporting orders data:", error);
      toast.error("Failed to export orders data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* System Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Statistics</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900">Total Orders</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">Total Products</h3>
                <p className="text-2xl font-bold text-green-600">{stats.totalProducts}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900">Total Collections</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCollections}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900">Total Users</h3>
                <p className="text-2xl font-bold text-yellow-600">{stats.totalUsers}</p>
              </div>
            </div>
          )}
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Order Notifications</h3>
                <p className="text-sm text-gray-500">Send confirmation emails when orders are placed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.orderNotifications}
                  onChange={(e) => handleEmailSettingChange('orderNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Status Updates</h3>
                <p className="text-sm text-gray-500">Send emails when order status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.statusUpdates}
                  onChange={(e) => handleEmailSettingChange('statusUpdates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Marketing Emails</h3>
                <p className="text-sm text-gray-500">Send promotional and marketing emails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailSettings.marketingEmails}
                  onChange={(e) => handleEmailSettingChange('marketingEmails', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
            
            <div className="pt-4">
              <button
                onClick={saveEmailSettings}
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Email Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Export</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Export Orders Data</h3>
              <p className="text-sm text-gray-500 mb-4">Download all orders data as a CSV file</p>
              <button
                onClick={exportOrdersData}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Exporting..." : "Export Orders CSV"}
              </button>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Environment</h3>
              <p className="text-sm text-gray-600">Production</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Database</h3>
              <p className="text-sm text-gray-600">Firebase Firestore</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Service</h3>
              <p className="text-sm text-gray-600">Nodemailer (Gmail)</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Storage</h3>
              <p className="text-sm text-gray-600">Firebase Storage</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSetupPage; 