"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/utilities/Layout";
import { useAuth } from "@/utilities/AuthContext";
import { UserService } from "@/utilities/UserService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const AddressesPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false
  });
  
  // Fetch user profile with addresses
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      
      try {
        setLoading(true);
        setError("");
        
        const response = await UserService.getUserProfile(currentUser.uid);
        if (response.success) {
          setAddresses(response.data.addresses || []);
        } else {
          setError("Failed to load addresses");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("An error occurred while fetching your profile");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [currentUser, router]);
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false
    });
    setEditingAddressId(null);
  };
  
  // Handle edit address
  const handleEditAddress = (address) => {
    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      isDefault: address.isDefault || false
    });
    setEditingAddressId(address.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      router.push("/login");
      return;
    }
    
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    try {
      setLoading(true);
      
      let response;
      if (editingAddressId) {
        // Update existing address
        response = await UserService.updateShippingAddress(currentUser.uid, editingAddressId, formData);
        if (response.success) {
          toast.success("Address updated successfully");
        }
      } else {
        // Add new address
        response = await UserService.addShippingAddress(currentUser.uid, formData);
        if (response.success) {
          toast.success("Address added successfully");
        }
      }
      
      if (response.success) {
        // Refresh addresses list
        const profileResponse = await UserService.getUserProfile(currentUser.uid);
        if (profileResponse.success) {
          setAddresses(profileResponse.data.addresses || []);
        }
        
        // Reset form and hide it
        resetForm();
        setShowForm(false);
      } else {
        toast.error(response.error || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("An error occurred while saving the address");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await UserService.removeShippingAddress(currentUser.uid, addressId);
      if (response.success) {
        toast.success("Address removed successfully");
        
        // Refresh addresses list
        const profileResponse = await UserService.getUserProfile(currentUser.uid);
        if (profileResponse.success) {
          setAddresses(profileResponse.data.addresses || []);
        }
      } else {
        toast.error(response.error || "Failed to remove address");
      }
    } catch (error) {
      console.error("Error removing address:", error);
      toast.error("An error occurred while removing the address");
    } finally {
      setLoading(false);
    }
  };
  
  if (!currentUser && !loading) {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-4">Login Required</h1>
            <p className="mb-4">Please login to manage your addresses.</p>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/profile" className="flex items-center text-gray-700 hover:text-pink-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </Link>
          </div>
          
          <h1 className="text-2xl font-semibold mb-6">Manage Shipping Addresses</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* Add new address button */}
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors mb-6"
              disabled={loading}
            >
              Add New Address
            </button>
          )}
          
          {/* Address form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg border mb-6 p-6">
              <h2 className="text-lg font-semibold mb-4">{editingAddressId ? "Edit Address" : "Add New Address"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State/Province *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer mt-4">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <span>Set as default shipping address</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : (editingAddressId ? "Update Address" : "Save Address")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Addresses list */}
          <div className="bg-white rounded-lg shadow-lg border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Your Addresses</h2>
              <p className="text-gray-600">Manage your shipping addresses for faster checkout</p>
            </div>
            
            {loading && !addresses.length ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                {!showForm && (
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="text-pink-600 hover:text-pink-800 underline"
                  >
                    Add your first address
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {addresses.map((address) => (
                  <div key={address.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{address.fullName}</p>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.phone}</p>
                        {address.isDefault && (
                          <span className="inline-block mt-2 bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                            Default Address
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddressesPage; 