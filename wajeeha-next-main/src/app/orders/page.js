"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/utilities/Layout";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        // Add a small delay to ensure Firebase is fully initialized
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("Fetching orders for user:", currentUser.uid);
        
        const ordersRef = collection(db, "orders");
      
        // Create a query against the collection - without orderBy to avoid index issues
        const q = query(
          ordersRef, 
          where("userId", "==", currentUser.uid)
        );
      
        const querySnapshot = await getDocs(q);
        
        const ordersList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Order found:", doc.id);
          
          // Handle potential timestamp issues
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

        // Sort orders manually by createdAt
        ordersList.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        console.log("Total orders found:", ordersList.length);
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleRetry = () => {
    if (currentUser) {
      setLoading(true);
      setError("");
      
      const fetchOrdersAgain = async () => {
        try {
          // Add a small delay to ensure Firebase is fully initialized
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const ordersRef = collection(db, "orders");
          const q = query(
            ordersRef, 
            where("userId", "==", currentUser.uid)
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

          // Sort orders manually by createdAt
          ordersList.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          setOrders(ordersList);
        } catch (error) {
          console.error("Error retrying order fetch:", error);
          setError("Failed to load your orders. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrdersAgain();
    }
  };

  // If user is not logged in, redirect to login page
  if (!currentUser && !loading) {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-4">Login Required</h1>
            <p className="mb-4">Please login to view your orders.</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
            </div>
          ) : error ? (
            <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-6 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-700 mb-2">Unable to Load Orders</h2>
                <p className="text-gray-500 mb-6 max-w-md">We encountered an issue while loading your orders. Please try again.</p>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleRetry}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Retry</span>
                  </button>
                  <Link href="/collections" className="border border-pink-600 text-pink-600 hover:bg-pink-50 font-medium py-3 px-6 rounded-md transition-colors duration-300 inline-flex items-center">
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-6 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-700 mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-6 max-w-md">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                <Link href="/collections" className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 inline-flex items-center">
                  <span>Start Shopping</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg border overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="px-3 py-1 rounded-full text-xs capitalize font-medium bg-blue-100 text-blue-800">
                        {order.status || "processing"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 last:border-b-0 last:pb-0">
                          <div className="mb-2 sm:mb-0">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
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
                    </div>
                  
                    <div className="mt-4 flex flex-col sm:flex-row justify-between border-t pt-3">
                      <div>
                        <p><span className="font-medium">Payment:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                        <p><span className="font-medium">Shipping:</span> Free</p>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="font-medium">Total: Rs. {order.total}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-right">
                      <Link
                        href={`/order-confirmation?orderId=${order.id}`}
                        className="text-pink-600 hover:underline"
                      >
                        View Order Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage; 