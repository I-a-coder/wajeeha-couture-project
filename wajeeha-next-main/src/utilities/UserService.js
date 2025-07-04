"use client";

import { db } from '../firebase';
import { 
  doc, 
  collection, 
  getDoc, 
  updateDoc, 
  arrayUnion,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { DataService } from './DataService';

export const UserService = {
  // Fetch user data with full profile information
  getUserProfile: async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return { success: false, error: "User not found" };
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Update user profile information
  updateUserProfile: async (userId, profileData) => {
    try {
      const userRef = doc(db, "users", userId);
      
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Add shipping address to user profile
  addShippingAddress: async (userId, address) => {
    try {
      const userRef = doc(db, "users", userId);
      
      // Add a new address to the addresses array
      await updateDoc(userRef, {
        "addresses": arrayUnion({
          ...address,
          id: Date.now().toString(), // Generate a unique ID for the address
          createdAt: new Date().toISOString()
        }),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error adding shipping address:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Update a specific shipping address
  updateShippingAddress: async (userId, addressId, addressData) => {
    try {
      // First get the user document to find the existing addresses
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return { success: false, error: "User not found" };
      }
      
      const userData = userSnap.data();
      const addresses = userData.addresses || [];
      
      // Find and update the specific address
      const updatedAddresses = addresses.map(addr => {
        if (addr.id === addressId) {
          return { ...addr, ...addressData, updatedAt: new Date().toISOString() };
        }
        return addr;
      });
      
      // Update the user document with the modified addresses array
      await updateDoc(userRef, {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error updating shipping address:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Remove a shipping address
  removeShippingAddress: async (userId, addressId) => {
    try {
      // First get the user document to find the existing addresses
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return { success: false, error: "User not found" };
      }
      
      const userData = userSnap.data();
      const addresses = userData.addresses || [];
      
      // Filter out the address to remove
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      
      // Update the user document with the filtered addresses array
      await updateDoc(userRef, {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error removing shipping address:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Get user order history with detailed information
  getUserOrderHistory: async (userId) => {
    try {
      // Use DataService to get orders
      const ordersResult = await DataService.getUserOrders(userId, 'desc');
      
      if (!ordersResult.success) {
        return ordersResult; // Return the error from DataService
      }
      
      // Process and add additional information to each order
      const enhancedOrders = ordersResult.data.map(order => {
        // Calculate total items
        const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        
        // Format dates
        const dates = {};
        if (order.createdAt) {
          if (typeof order.createdAt.toDate === 'function') {
            dates.createdAt = order.createdAt.toDate();
          } else {
            dates.createdAt = new Date(order.createdAt);
          }
        }
        
        if (order.updatedAt) {
          if (typeof order.updatedAt.toDate === 'function') {
            dates.updatedAt = order.updatedAt.toDate();
          } else {
            dates.updatedAt = new Date(order.updatedAt);
          }
        }
        
        // Determine delivery timeframe based on status
        let estimatedDelivery = null;
        if (order.status === 'processing' || order.status === 'pending') {
          // If processing or pending, estimate 5-7 days from order date
          const orderDate = dates.createdAt || new Date();
          const minDeliveryDate = new Date(orderDate);
          minDeliveryDate.setDate(minDeliveryDate.getDate() + 5);
          
          const maxDeliveryDate = new Date(orderDate);
          maxDeliveryDate.setDate(maxDeliveryDate.getDate() + 7);
          
          estimatedDelivery = {
            min: minDeliveryDate,
            max: maxDeliveryDate
          };
        }
        
        return {
          ...order,
          ...dates,
          totalItems,
          estimatedDelivery
        };
      });
      
      return { success: true, data: enhancedOrders };
    } catch (error) {
      console.error("Error getting user order history:", error);
      return { success: false, error: error.message };
    }
  },
  
  // Get order details with status tracking information
  getOrderDetailsWithTracking: async (orderId) => {
    try {
      const orderResult = await DataService.getOrderById(orderId);
      
      if (!orderResult.success) {
        return orderResult; // Return the error from DataService
      }
      
      const order = orderResult.data;
      
      // Generate tracking timeline based on order status and timestamps
      const timeline = [];
      
      // Order placed - always exists
      timeline.push({
        status: 'Order Placed',
        date: order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt),
        completed: true,
        current: order.status === 'pending'
      });
      
      // Processing
      if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
        timeline.push({
          status: 'Processing',
          date: order.processedAt?.toDate ? order.processedAt.toDate() : 
                 (order.status === 'processing' ? new Date() : null),
          completed: true,
          current: order.status === 'processing'
        });
      } else {
        timeline.push({
          status: 'Processing',
          completed: false,
          current: false
        });
      }
      
      // Shipped
      if (order.status === 'shipped' || order.status === 'delivered') {
        timeline.push({
          status: 'Shipped',
          date: order.shippedAt?.toDate ? order.shippedAt.toDate() : 
                 (order.status === 'shipped' ? new Date() : null),
          trackingNumber: order.trackingNumber,
          carrier: order.carrier,
          completed: true,
          current: order.status === 'shipped'
        });
      } else {
        timeline.push({
          status: 'Shipped',
          completed: false,
          current: false
        });
      }
      
      // Delivered
      if (order.status === 'delivered') {
        timeline.push({
          status: 'Delivered',
          date: order.deliveredAt?.toDate ? order.deliveredAt.toDate() : new Date(),
          completed: true,
          current: order.status === 'delivered'
        });
      } else {
        timeline.push({
          status: 'Delivered',
          completed: false,
          current: false
        });
      }
      
      // Add cancelled status if applicable
      if (order.status === 'cancelled') {
        timeline.push({
          status: 'Cancelled',
          date: order.cancelledAt?.toDate ? order.cancelledAt.toDate() : new Date(),
          reason: order.cancellationReason,
          completed: true,
          current: true
        });
      }
      
      return { 
        success: true, 
        data: {
          ...order,
          timeline
        }
      };
    } catch (error) {
      console.error("Error getting order details with tracking:", error);
      return { success: false, error: error.message };
    }
  }
};

export default UserService;