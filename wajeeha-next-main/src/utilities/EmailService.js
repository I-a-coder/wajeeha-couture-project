"use client";

import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../firebase';

// Initialize Firebase Functions
const getFirebaseFunctions = () => {
  return getFunctions();
};

// Service for email functionality
export const EmailService = {
  // Manually send order confirmation email (for admins)
  sendOrderConfirmationEmail: async (orderId) => {
    try {
      // Ensure user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Authentication required');
      }
      
      const functions = getFirebaseFunctions();
      const manualSendEmail = httpsCallable(functions, 'manualSendEmail');
      
      const result = await manualSendEmail({
        orderId,
        emailType: 'confirmation'
      });
      
      return result.data;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  },
  
  // Manually send order status update email (for admins)
  sendOrderStatusEmail: async (orderId) => {
    try {
      // Ensure user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Authentication required');
      }
      
      const functions = getFirebaseFunctions();
      const manualSendEmail = httpsCallable(functions, 'manualSendEmail');
      
      const result = await manualSendEmail({
        orderId,
        emailType: 'status'
      });
      
      return result.data;
    } catch (error) {
      console.error('Error sending order status email:', error);
      throw error;
    }
  }
};

export default EmailService; 