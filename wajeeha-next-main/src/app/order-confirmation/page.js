"use client";

import Layout from "@/utilities/Layout";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/utilities/AuthContext";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID not found");
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          
          // Verify that this order belongs to the current user
          if (currentUser && orderData.userId === currentUser.uid) {
            setOrder({ id: orderSnap.id, ...orderData });
          } else {
            setError("You do not have permission to view this order");
          }
        } else {
          setError("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, currentUser]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
              <h1 className="text-2xl font-semibold mb-4">Error</h1>
              <p className="text-red-600 mb-6">{error}</p>
              <Link href="/" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
              <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
              <Link href="/" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg border text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">Thank you for your order. We've received your request and will process it shortly.</p>
            <p className="font-medium">Order ID: {order.id}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Order Date:</span> {order.createdAt?.toDate().toLocaleDateString()}</p>
                  <p><span className="font-medium">Payment Method:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                  <p><span className="font-medium">Order Status:</span> <span className="capitalize">{order.status}</span></p>
                </div>
                <div>
                  <p><span className="font-medium">Total Amount:</span> Rs. {order.total}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border mb-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Name:</span> {order.shippingDetails.fullName}</p>
                <p><span className="font-medium">Email:</span> {order.shippingDetails.email}</p>
                <p><span className="font-medium">Phone:</span> {order.shippingDetails.phone}</p>
              </div>
              <div>
                <p><span className="font-medium">Address:</span> {order.shippingDetails.address}</p>
                <p><span className="font-medium">City:</span> {order.shippingDetails.city}</p>
                <p><span className="font-medium">State:</span> {order.shippingDetails.state}</p>
                <p><span className="font-medium">Postal Code:</span> {order.shippingDetails.zipCode}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">Collection: {item.collection}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p>Rs. {item.discount ? 
                      (item.unstichedPrice ? 
                        Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100) :
                        Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100)) :
                      (item.unstichedPrice || item.stichedPrice)} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Link href="/" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
              Continue Shopping
            </Link>
            <Link href="/profile" className="border border-pink-600 text-pink-600 py-2 px-4 rounded-md hover:bg-pink-50 transition-colors">
              View My Account
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation; 