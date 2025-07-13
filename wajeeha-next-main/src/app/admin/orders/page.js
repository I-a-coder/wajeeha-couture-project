"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { collection, query, getDocs, doc, updateDoc, orderBy } from "firebase/firestore";
import { sendOrderStatusUpdate, sendOrderShipped, sendOrderDelivered } from "@/utilities/EmailService";
import toast from "react-hot-toast";
import AdminLayout from "../layout";

const AdminOrdersPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Check if user is admin (you can implement your own admin check logic)
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

    fetchOrders();
  }, [currentUser, isAdmin, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));
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
      
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      
      // Update order status in Firestore
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      // Get updated order data
      const updatedOrder = orders.find(order => order.id === orderId);
      const orderWithNewStatus = { ...updatedOrder, status: newStatus };
      
      // Send email notification based on status
      try {
        if (newStatus === "shipped") {
          await sendOrderShipped(orderWithNewStatus);
        } else if (newStatus === "delivered") {
          await sendOrderDelivered(orderWithNewStatus);
        } else {
          await sendOrderStatusUpdate(orderWithNewStatus);
        }
        toast.success("Status updated and email sent successfully!");
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        toast.error("Status updated but email failed to send");
      }
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      setShowOrderModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
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

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders Management</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === "pending").length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Shipped</h3>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === "shipped").length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900">Delivered</h3>
            <p className="text-2xl font-bold text-purple-600">
              {orders.filter(o => o.status === "delivered").length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{order.shippingDetails.fullName}</div>
                        <div className="text-gray-500">{order.shippingDetails.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.items.length} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rs. {order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openOrderModal(order)}
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
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details - #{selectedOrder.id.slice(0, 8)}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Customer Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Name:</strong> {selectedOrder.shippingDetails.fullName}</p>
                    <p><strong>Email:</strong> {selectedOrder.shippingDetails.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.shippingDetails.phone}</p>
                    <p><strong>Address:</strong> {selectedOrder.shippingDetails.address}</p>
                    <p><strong>City:</strong> {selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.state}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p><strong>{item.title}</strong></p>
                        <p>Quantity: {item.quantity}</p>
                        {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                        <p>Price: Rs. {item.discount ? 
                          (item.unstichedPrice ? 
                            Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100) :
                            Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100)) :
                          (item.unstichedPrice || item.stichedPrice)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Total:</strong> Rs. {selectedOrder.total}</p>
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span></p>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                        disabled={updatingStatus || selectedOrder.status === status}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          selectedOrder.status === status
                            ? "bg-pink-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } disabled:opacity-50`}
                      >
                        {updatingStatus ? "Updating..." : status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersPage; 