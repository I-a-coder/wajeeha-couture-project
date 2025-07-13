"use client";

import Layout from "@/utilities/Layout";
import React, { useState, useRef } from "react";
import { useCart } from "@/utilities/CartContext";
import { useAuth } from "@/utilities/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { db, storage } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { sendOrderConfirmation } from "@/utilities/EmailService";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, calculateTotal } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart, shipping, payment, confirmation
  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "cod",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (productId, collection, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, collection, newQuantity);
  };

  const handleRemoveItem = (productId, collection) => {
    removeFromCart(productId, collection);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      router.push("/login");
      return;
    }
    
    setCheckoutStep("shipping");
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep("payment");
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep("confirmation");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setReceiptPreview(previewUrl);
    setPaymentReceipt(file);
    
    console.log("Payment receipt selected:", file.name);
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    
    // Validate payment receipt if bank transfer is selected
    if (formData.paymentMethod === "bank" && !paymentReceipt) {
      toast.error("Please upload your payment receipt");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // Upload payment receipt if bank transfer selected
      let receiptURL = null;
      if (formData.paymentMethod === "bank" && paymentReceipt) {
        try {
          console.log("Starting payment receipt upload...");
          
          // Create storage reference
          const storageRef = ref(storage, `payments/${currentUser.uid}/${Date.now()}-${paymentReceipt.name}`);
          
          // Upload file
          const uploadResult = await uploadBytes(storageRef, paymentReceipt);
          console.log("Payment receipt uploaded successfully:", uploadResult.metadata.name);
          
          // Get download URL
          receiptURL = await getDownloadURL(storageRef);
          console.log("Payment receipt URL generated:", receiptURL);
        } catch (uploadError) {
          console.error("Error uploading receipt:", uploadError);
          setError("Failed to upload payment receipt. Please try again.");
          setLoading(false);
          return;
        }
      }
      
      // Create order data
      const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: cart,
        shippingDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod,
        paymentReceipt: receiptURL,
        notes: formData.notes,
        status: "pending",
        total: calculateTotal(),
        createdAt: serverTimestamp()
      };
      
      console.log("Creating order with data:", { 
        userId: orderData.userId,
        items: orderData.items.length,
        paymentMethod: orderData.paymentMethod,
        hasReceipt: !!orderData.paymentReceipt
      });
      
      try {
        // Add order to Firestore
        const orderRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Order created with ID:", orderRef.id);
        
        // Send order confirmation email
        try {
          const orderWithId = { ...orderData, id: orderRef.id };
          await sendOrderConfirmation(orderWithId);
          console.log("Order confirmation email sent successfully");
        } catch (emailError) {
          console.error("Failed to send order confirmation email:", emailError);
          // Don't fail the order if email fails
        }
        
        // If successful, clear cart and redirect
        clearCart();
        router.push(`/order-confirmation?orderId=${orderRef.id}`);
      } catch (dbError) {
        console.error("Database error:", dbError);
        setError("Failed to save your order. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Overall error:", error);
      setError("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  // Display empty cart message
  if (cart.length === 0 && checkoutStep === "cart") {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <Link href="/" className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Cart Items Display
  if (checkoutStep === "cart") {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-700 hover:text-pink-600 transition-colors py-2 px-4 bg-white shadow-sm border rounded-md inline-block"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
            
            <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg border p-6">
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
                      {cart.map((item) => {
                        // Calculate price based on discount if present
                        let price;
                        if (item.discount) {
                          price = item.unstichedPrice ? 
                            Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100) :
                            Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100);
                        } else {
                          price = item.unstichedPrice || item.stichedPrice;
                        }
                        
                        const itemTotal = price * item.quantity;
                        
                        return (
                          <tr key={`${item.id}-${item.collection}`} className="border-b">
                            <td className="py-4">
                              <div className="flex items-center">
                                <div className="w-16 h-16 relative mr-4">
                                  <Image
                                    src={`https://static.wajeehacouture.com/assets${item.image}`}
                                    alt={item.title}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-medium">{item.title}</h3>
                                  <p className="text-sm text-gray-600">Collection: {item.collection}</p>
                                  <button 
                                    onClick={() => handleRemoveItem(item.id, item.collection)}
                                    className="text-xs text-red-500 mt-1 hover:underline"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center">Rs. {price}</td>
                            <td className="py-4">
                              <div className="flex items-center justify-center">
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.collection, item.quantity - 1)}
                                  className="w-8 h-8 border rounded-l-md flex items-center justify-center hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="w-10 h-8 border-t border-b flex items-center justify-center">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.collection, item.quantity + 1)}
                                  className="w-8 h-8 border rounded-r-md flex items-center justify-center hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-4 text-right">Rs. {itemTotal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg border p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs. {calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-2 font-semibold flex justify-between">
                      <span>Total</span>
                      <span>Rs. {calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Shipping Information Form
  if (checkoutStep === "shipping") {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Shipping Information</h1>
            
            <div className="bg-white rounded-lg shadow-lg border p-6">
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Back to Cart
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Payment Method Selection
  if (checkoutStep === "payment") {
    return (
      <Layout>
        <div className="min-h-screen p-4 pt-10">
          <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
            <h1 className="text-2xl font-semibold mb-6 text-center">Payment Method</h1>
            
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block mb-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Cash on Delivery
                  </label>
                  
                  <label className="block mb-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Online Bank Transfer
                  </label>

                  {formData.paymentMethod === "bank" && (
                    <div className="ml-6 mt-2 p-4 bg-gray-50 rounded-md">
                      <p className="text-gray-800 mb-2">Bank Account Details:</p>
                      <p className="text-sm text-gray-600 mb-1">Account Title: Wajeeha Hashmi</p>
                      <p className="text-sm text-gray-600 mb-1">Account Number: 12345678901234</p>
                      <p className="text-sm text-gray-600 mb-3">Bank: HBL</p>
                      <p className="text-xs text-gray-500 mb-4">Please make the transfer and upload your payment receipt below.</p>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Payment Receipt
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                        />
                        {receiptPreview && (
                          <div className="mt-3 relative w-32 h-32 mx-auto border rounded-md overflow-hidden">
                            <Image 
                              src={receiptPreview}
                              alt="Payment Receipt" 
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Order Notes (Optional):</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 h-24"
                    placeholder="Add any special instructions for your order here..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>Items ({cart.length}):</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("shipping")}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 transition-colors"
                >
                  Review Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  // Order Confirmation
  if (checkoutStep === "confirmation") {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Review Your Order</h1>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            
            <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                  <p><span className="font-medium">Email:</span> {formData.email}</p>
                  <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                </div>
                <div>
                  <p><span className="font-medium">Address:</span> {formData.address}</p>
                  <p><span className="font-medium">City:</span> {formData.city}</p>
                  <p><span className="font-medium">State/Province:</span> {formData.state}</p>
                  <p><span className="font-medium">Postal Code:</span> {formData.zipCode}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
              <p>{formData.paymentMethod === "cod" ? "Cash on Delivery" : "Online Bank Transfer"}</p>
              {formData.notes && (
                <>
                  <h3 className="font-medium mt-4">Order Notes:</h3>
                  <p>{formData.notes}</p>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-lg border p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {cart.map((item) => {
                  // Calculate price based on discount if present
                  let price;
                  if (item.discount) {
                    price = item.unstichedPrice ? 
                      Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100) :
                      Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100);
                  } else {
                    price = item.unstichedPrice || item.stichedPrice;
                  }
                  
                  return (
                    <div key={`${item.id}-${item.collection}`} className="flex justify-between items-center border-b pb-3">
                      <div className="flex items-center">
                        <div className="w-12 h-12 relative mr-3">
                          <Image
                            src={`https://static.wajeehacouture.com/assets${item.image}`}
                            alt={item.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p>Rs. {price * item.quantity}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setCheckoutStep("payment")}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Back
              </button>
              
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
        </div>
      </div>
    </Layout>
  );
  }
};

export default CartPage;
