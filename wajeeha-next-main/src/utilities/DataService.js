"use client";

import { db } from '../firebase';
import { 
  doc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';

export const DataService = {
  // User related methods
  createUser: async (uid, userData) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error };
    }
  },
  
  updateUserProfile: async (uid, userData) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error };
    }
  },
  
  getUserData: async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return { success: false, error: "User not found" };
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      return { success: false, error };
    }
  },
  
  // Order related methods
  createOrder: async (orderData) => {
    try {
      // Add server timestamp
      const orderWithTimestamp = {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "pending"
      };
      
      const orderRef = await addDoc(collection(db, "orders"), orderWithTimestamp);
      return { success: true, orderId: orderRef.id };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, error };
    }
  },
  
  getOrderById: async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (orderSnap.exists()) {
        return { 
          success: true, 
          data: { 
            id: orderSnap.id, 
            ...orderSnap.data() 
          } 
        };
      } else {
        return { success: false, error: "Order not found" };
      }
    } catch (error) {
      console.error("Error getting order:", error);
      return { success: false, error };
    }
  },
  
  getUserOrders: async (userId, sortDirection = 'desc') => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", userId),
        orderBy("createdAt", sortDirection)
      );
      
      const querySnapshot = await getDocs(q);
      
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: orders };
    } catch (error) {
      console.error("Error getting user orders:", error);
      return { success: false, error };
    }
  },
  
  // New order management methods
  getAllOrders: async (sortDirection = 'desc', limitCount = 50, statusFilter = null) => {
    try {
      const ordersRef = collection(db, "orders");
      
      // Build query based on filters
      let queryConstraints = [orderBy("createdAt", sortDirection)];
      
      if (statusFilter) {
        queryConstraints.unshift(where("status", "==", statusFilter));
      }
      
      if (limitCount > 0) {
        queryConstraints.push(limit(limitCount));
      }
      
      const q = query(ordersRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: orders };
    } catch (error) {
      console.error("Error getting all orders:", error);
      return { success: false, error };
    }
  },
  
  updateOrderStatus: async (orderId, status, additionalData = {}) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      
      // Update the order with new status and any additional data
      await updateDoc(orderRef, {
        status,
        ...additionalData,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error updating order status:", error);
      return { success: false, error };
    }
  },
  
  addTrackingInfo: async (orderId, trackingNumber, carrier) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      
      // Update the order with tracking information
      await updateDoc(orderRef, {
        trackingNumber,
        carrier,
        status: "shipped",
        shippedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error adding tracking info:", error);
      return { success: false, error };
    }
  },
  
  markOrderDelivered: async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      
      // Update order as delivered
      await updateDoc(orderRef, {
        status: "delivered",
        deliveredAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error marking order as delivered:", error);
      return { success: false, error };
    }
  },
  
  cancelOrder: async (orderId, reason) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      
      // Update order as cancelled
      await updateDoc(orderRef, {
        status: "cancelled",
        cancellationReason: reason,
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error cancelling order:", error);
      return { success: false, error };
    }
  },
  
  // Admin order statistics
  getOrderStatistics: async () => {
    try {
      // Get all orders
      const ordersRef = collection(db, "orders");
      const querySnapshot = await getDocs(ordersRef);
      
      // Initialize stats
      const stats = {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
        completedRevenue: 0
      };
      
      // Process each order
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        stats.total++;
        
        // Count by status
        if (order.status) {
          stats[order.status] = (stats[order.status] || 0) + 1;
        }
        
        // Calculate revenue
        if (order.total) {
          stats.totalRevenue += order.total;
          
          // Only count completed orders for completed revenue
          if (order.status === 'delivered') {
            stats.completedRevenue += order.total;
          }
        }
      });
      
      return { success: true, data: stats };
    } catch (error) {
      console.error("Error getting order statistics:", error);
      return { success: false, error };
    }
  }
};

export default DataService;