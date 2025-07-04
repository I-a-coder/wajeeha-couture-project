"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/utilities/Layout";
import { useAuth } from "@/utilities/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UserService } from "@/utilities/UserService";
import { EmailService } from "@/utilities/EmailService";
import toast from "react-hot-toast";

const OrderDetailPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      if (!orderId) {
        setError("Order ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await UserService.getOrderDetailsWithTracking(orderId);
        
        if (response.success) {
          // Verify this order belongs to the current user
          if (response.data.userId === currentUser.uid) {
            setOrder(response.data);
          } else {
            setError("You do not have permission to view this order");
          }
        } else {
          setError(response.error || "Failed to load order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("An error occurred while loading order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [currentUser, orderId, router]);

  // Format date function
  const formatDate = (date) => {
    if (!date) return "N/A";
    
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
              <Link href="/orders" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
                Return to Orders
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
              <Link href="/orders" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
                Return to Orders
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/orders" className="flex items-center text-gray-700 hover:text-pink-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Orders
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg border overflow-hidden mb-6">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs capitalize font-medium 
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : 
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status || 'pending'}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>

            {/* Order Tracking Timeline */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium mb-4">Order Status</h2>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-3 ml-px top-5 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* Timeline Items */}
                <div className="space-y-6 relative z-10">
                  {order.timeline?.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center mt-0.5
                        ${item.current ? 'bg-pink-600' : 
                          item.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        {item.completed && (
                          <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="font-medium">{item.status}</div>
                        {item.date && (
                          <div className="text-sm text-gray-500">
                            {formatDate(item.date)}
                          </div>
                        )}
                        {item.trackingNumber && (
                          <div className="text-sm mt-1">
                            <span className="font-medium">Tracking:</span> {item.trackingNumber}
                            {item.carrier && <span className="ml-1">({item.carrier})</span>}
                          </div>
                        )}
                        {item.reason && (
                          <div className="text-sm text-gray-700 mt-1 p-2 bg-red-50 rounded">
                            {item.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
              <div>
                <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">{order.shippingDetails?.fullName}</p>
                  <p>{order.shippingDetails?.address}</p>
                  <p>{order.shippingDetails?.city}, {order.shippingDetails?.state} {order.shippingDetails?.zipCode}</p>
                  <p>{order.shippingDetails?.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Payment Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="font-medium">Method:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                  <p><span className="font-medium">Total:</span> Rs. {order.total}</p>
                  {order.paymentReceipt && (
                    <div className="mt-2">
                      <a 
                        href={order.paymentReceipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Payment Receipt
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="mb-2 sm:mb-0">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                      )}
                    </div>
                    <p className="text-gray-800">
                      Rs. {item.discount
                        ? (item.unstichedPrice
                          ? Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100)
                          : Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100))
                        : (item.unstichedPrice || item.stichedPrice)
                      } x {item.quantity}
                    </p>
                  </div>
                ))}
                
                <div className="flex justify-between pt-4 border-t">
                  <p className="font-medium">Total</p>
                  <p className="font-medium">Rs. {order.total}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <button
                onClick={async () => {
                  try {
                    // Implement cancel order functionality
                    toast.error("Order cancellation is currently disabled");
                    // In a real implementation, you would call a service to cancel the order
                  } catch (error) {
                    console.error("Error cancelling order:", error);
                    toast.error("Failed to cancel order");
                  }
                }}
                className="border border-red-500 text-red-500 py-2 px-4 rounded-md hover:bg-red-50 transition-colors mr-4"
              >
                Cancel Order
              </button>
            )}
            
            <Link href="/orders" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetailPage; 