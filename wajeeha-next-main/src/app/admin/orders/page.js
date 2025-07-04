"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/utilities/Layout";
import { useAuth } from "@/utilities/AuthContext";
import { DataService } from "@/utilities/DataService";
import { EmailService } from "@/utilities/EmailService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const AdminOrdersPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statistics, setStatistics] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal state for status update
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: "",
    trackingNumber: "",
    carrier: "",
    cancellationReason: "",
  });

  // Check if user is admin
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      try {
        const response = await DataService.getUserData(currentUser.uid);
        if (response.success) {
          const userData = response.data;
          if (userData.role === "admin") {
            setIsAdmin(true);
            fetchOrders();
            fetchStatistics();
          } else {
            router.push("/");
            toast.error("Admin access required");
          }
        } else {
          router.push("/");
          toast.error("Failed to verify admin status");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push("/");
      }
    };

    checkIfAdmin();
  }, [currentUser, router]);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await DataService.getAllOrders("desc", 100);
      if (response.success) {
        setOrders(response.data);
        setFilteredOrders(response.data);
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order statistics
  const fetchStatistics = async () => {
    try {
      const response = await DataService.getOrderStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  // Apply status filter
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  // Handle order click
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
    // Set default status to current order status
    setStatusUpdateData({
      ...statusUpdateData,
      status: order.status || "pending"
    });
  };

  // Handle status update
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    try {
      setLoading(true);
      let response;
      
      switch (statusUpdateData.status) {
        case "processing":
          response = await DataService.updateOrderStatus(selectedOrder.id, "processing");
          break;
        case "shipped":
          if (!statusUpdateData.trackingNumber) {
            toast.error("Please enter tracking information");
            setLoading(false);
            return;
          }
          response = await DataService.addTrackingInfo(
            selectedOrder.id, 
            statusUpdateData.trackingNumber, 
            statusUpdateData.carrier || "Not specified"
          );
          break;
        case "delivered":
          response = await DataService.markOrderDelivered(selectedOrder.id);
          break;
        case "cancelled":
          if (!statusUpdateData.cancellationReason) {
            toast.error("Please enter a cancellation reason");
            setLoading(false);
            return;
          }
          response = await DataService.cancelOrder(
            selectedOrder.id, 
            statusUpdateData.cancellationReason
          );
          break;
        default:
          response = await DataService.updateOrderStatus(selectedOrder.id, statusUpdateData.status);
      }
      
      if (response.success) {
        // Try to send email notification
        try {
          await EmailService.sendOrderStatusEmail(selectedOrder.id);
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Continue even if email sending fails
        }
        
        toast.success("Order status updated successfully");
        fetchOrders();
        fetchStatistics();
        setShowOrderModal(false);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("An error occurred while updating order status");
    } finally {
      setLoading(false);
    }
  };

  // If not admin, redirect to login
  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-semibold mb-4 md:mb-0">Order Management</h1>
            <div className="flex items-center space-x-3">
              <label htmlFor="statusFilter" className="text-sm font-medium">Filter by Status:</label>
              <select
                id="statusFilter"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{statistics.total}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <p className="text-sm text-gray-500">Completed Orders</p>
                <p className="text-2xl font-bold">{statistics.delivered || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold">{statistics.pending || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-pink-500">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">Rs. {statistics.totalRevenue || 0}</p>
              </div>
            </div>
          )}

          {loading && !orders.length ? (
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
                <p className="text-gray-500 mb-6">{error}</p>
                <button 
                  onClick={fetchOrders}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Retry</span>
                </button>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-6 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-700 mb-2">No Orders Found</h2>
                <p className="text-gray-500 mb-6">There are no orders matching your current filter.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.shippingDetails?.fullName || 'N/A'}<br />
                          <span className="text-xs">{order.shippingDetails?.email || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Rs. {order.total || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                            {order.status || 'unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleOrderClick(order)}
                            className="text-pink-600 hover:text-pink-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Order #{selectedOrder.id.slice(0, 8)}</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Order Details</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p><span className="font-semibold">Order Date:</span> {selectedOrder.createdAt?.toDate ? selectedOrder.createdAt.toDate().toLocaleDateString() : 'N/A'}</p>
                    <p><span className="font-semibold">Order Status:</span> <span className="capitalize">{selectedOrder.status || 'pending'}</span></p>
                    <p><span className="font-semibold">Payment Method:</span> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                    {selectedOrder.trackingNumber && (
                      <>
                        <p><span className="font-semibold">Tracking Number:</span> {selectedOrder.trackingNumber}</p>
                        <p><span className="font-semibold">Carrier:</span> {selectedOrder.carrier}</p>
                      </>
                    )}
                    {selectedOrder.cancellationReason && (
                      <p><span className="font-semibold">Cancellation Reason:</span> {selectedOrder.cancellationReason}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Customer Details</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p><span className="font-semibold">Name:</span> {selectedOrder.shippingDetails?.fullName || 'N/A'}</p>
                    <p><span className="font-semibold">Email:</span> {selectedOrder.shippingDetails?.email || 'N/A'}</p>
                    <p><span className="font-semibold">Phone:</span> {selectedOrder.shippingDetails?.phone || 'N/A'}</p>
                    <p><span className="font-semibold">Address:</span> {selectedOrder.shippingDetails?.address}, {selectedOrder.shippingDetails?.city}, {selectedOrder.shippingDetails?.state} {selectedOrder.shippingDetails?.zipCode}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-2">Order Items</h3>
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Product</th>
                      <th className="text-center py-2">Price</th>
                      <th className="text-center py-2">Quantity</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-3">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500">Collection: {item.collection}</div>
                        </td>
                        <td className="text-center py-3">
                          Rs. {item.discount
                            ? (item.unstichedPrice
                              ? Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100)
                              : Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100))
                            : (item.unstichedPrice || item.stichedPrice)
                          }
                        </td>
                        <td className="text-center py-3">{item.quantity}</td>
                        <td className="text-right py-3">
                          Rs. {(item.discount
                            ? (item.unstichedPrice
                              ? Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100)
                              : Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100))
                            : (item.unstichedPrice || item.stichedPrice)
                          ) * item.quantity}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3" className="text-right py-3 font-semibold">Total:</td>
                      <td className="text-right py-3 font-semibold">Rs. {selectedOrder.total || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium mb-2">Update Order Status</h3>
              <form onSubmit={handleStatusUpdate} className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={statusUpdateData.status}
                      onChange={(e) => setStatusUpdateData({ ...statusUpdateData, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {statusUpdateData.status === "shipped" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Tracking Number</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={statusUpdateData.trackingNumber}
                        onChange={(e) => setStatusUpdateData({ ...statusUpdateData, trackingNumber: e.target.value })}
                      />
                    </div>
                  )}

                  {statusUpdateData.status === "shipped" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Carrier/Shipping Service</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={statusUpdateData.carrier}
                        onChange={(e) => setStatusUpdateData({ ...statusUpdateData, carrier: e.target.value })}
                      />
                    </div>
                  )}

                  {statusUpdateData.status === "cancelled" && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Cancellation Reason</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows="2"
                        value={statusUpdateData.cancellationReason}
                        onChange={(e) => setStatusUpdateData({ ...statusUpdateData, cancellationReason: e.target.value })}
                      ></textarea>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowOrderModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : "Update Status"}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-right">
                <button
                  onClick={async () => {
                    try {
                      await EmailService.sendOrderStatusEmail(selectedOrder.id);
                      toast.success("Email notification sent");
                    } catch (error) {
                      console.error("Error sending email:", error);
                      toast.error("Failed to send email notification");
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Resend Status Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminOrdersPage; 