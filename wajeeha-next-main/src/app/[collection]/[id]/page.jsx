"use client";

import Layout from "@/utilities/Layout";
import SizeModal from "@/utilities/modal/SizeModal";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCart } from "@/utilities/CartContext";
import toast from "react-hot-toast";
import { db } from "@/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export const runtime = "edge";

export default function Product() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { collection: collectionParam, id } = useParams();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      if (!collectionParam || !id) {
        setError("Invalid product URL");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try to get product directly from Firestore first
        try {
          const productRef = doc(db, "products", id);
          const productSnap = await getDoc(productRef);
          
          if (productSnap.exists()) {
            const productData = productSnap.data();
            
            // Verify this product belongs to the right collection
            if (productData.collection === collectionParam) {
              setSelectedProduct({ id: productSnap.id, ...productData });
              setLoading(false);
              return;
            }
          }
        } catch (firestoreError) {
          console.error("Error fetching from Firestore:", firestoreError);
        }
        
        // If product not found by ID or collection doesn't match, try legacy approach with API
        try {
          const res = await fetch("/api/allProductApi");
          if (!res.ok) {
            throw new Error(`Failed to fetch data from API: ${res.status}`);
          }
          
          const response = await res.json();
          
          // Find the product by collection and id
          const selectedCollection = response.products.find(
            (prod) => prod.collection === collectionParam
          );
          
          if (selectedCollection) {
            const product = selectedCollection.items.find(
              (item) => item.id === id
            );
            
            if (product) {
              // Make sure we preserve the available status exactly as it is in the data
              setSelectedProduct({
                ...product,
                available: product.available,
                sizes: product.sizes || ["S", "M", "L", "XL"] // Default sizes if not specified
              });
              setLoading(false);
              return;
            }
          }
          
          // If we get here, the product wasn't found in either Firestore or legacy data
          throw new Error(`Product with ID ${id} not found`);
        } catch (apiError) {
          console.error("Error fetching from legacy API:", apiError);
          throw apiError;
        }
        
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [collectionParam, id]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    // Check if product is available
    if (!selectedProduct.available) {
      toast.error("This product is out of stock");
      return;
    }
    
    // Check if size is selected (if sizes are available)
    if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    
    // Add product to cart with selected size and quantity
    const productToAdd = {
      ...selectedProduct,
      id: selectedProduct.id || id,
      collection: collectionParam,
      selectedSize: selectedSize,
      quantity: quantity
    };
    
    // Add to cart
    addToCart(productToAdd, quantity);
    
    // Show success message
    toast.success(`${selectedProduct.title} added to cart!`);
  };

  // Display loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      </Layout>
    );
  }

  // Display error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
              <h1 className="text-2xl font-semibold mb-4">Error</h1>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => router.back()}
                className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // If product not found
  if (!selectedProduct) {
    return (
      <Layout>
        <div className="min-h-screen p-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
              <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
              <button
                onClick={() => router.push("/")}
                className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-8 md:px-16 lg:px-20 py-4 bg-gray-50">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-700 hover:text-pink-600 transition-colors mb-2 py-2 px-4 bg-white shadow-sm border rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Shopping
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row justify-center items-start gap-10 px-4 sm:px-8 md:px-16 lg:px-20 py-10">
        <div className="block lg:hidden w-full product-image">
          {selectedProduct?.image ? (
            <Image
              src={
                selectedProduct.image.startsWith("http") 
                  ? selectedProduct.image 
                  : "https://static.wajeehacouture.com/assets" + selectedProduct.image
              }
              alt={selectedProduct.title || "Product Image"}
              className="w-full h-auto object-cover"
              width={400}
              height={400}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[30%] product-description">
          <h1 className="font-bold text-2xl mb-4">{selectedProduct?.title || "Product"}</h1>
          <h5 className="font-bold text-lg mb-2">Details:</h5>
          <p>{selectedProduct?.details?.description || "No description available"}</p>
          <ul className="mt-2">
            <li>Color: {selectedProduct?.details?.color || "N/A"}</li>
            <li>Fabric: {selectedProduct?.details?.fabric || "N/A"}</li>
            <li>Article Type: {selectedProduct?.details?.articleType || "N/A"}</li>
            <li>Pieces: {selectedProduct?.details?.pieces || "N/A"}</li>
          </ul>

          <h5 className="font-bold text-lg mt-6">Size & Fit:</h5>
          <ul>
            <li>Model Height: {selectedProduct?.sizeAndFit?.modelHeight || "N/A"}</li>
            <li>Model Size: {selectedProduct?.sizeAndFit?.modelSize || "N/A"}</li>
          </ul>

          <h5 className="font-bold text-lg mt-6">Return & Exchange:</h5>
          <p>{selectedProduct?.returnAndExchange?.exchangePolicy || "Standard exchange policy applies"}</p>
          <ul className="ml-4 list-disc">
            {selectedProduct?.returnAndExchange?.eligibleArticles?.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            ) || <li>Contact customer support for details</li>}
          </ul>
          <p className="mt-2">
            <strong>Refund Policy:</strong>{" "}
            {selectedProduct?.returnAndExchange?.refundPolicy || "Standard refund policy applies"}
          </p>
          <p>
            <strong>Sale Policy:</strong>{" "}
            {selectedProduct?.returnAndExchange?.salePolicy || "Standard sale policy applies"}
          </p>
        </div>

        <div className="hidden lg:block w-full lg:w-[40%] product-image">
          {selectedProduct?.image ? (
            <Image
              src={
                selectedProduct.image.startsWith("http") 
                  ? selectedProduct.image 
                  : "https://static.wajeehacouture.com/assets" + selectedProduct.image
              }
              alt={selectedProduct.title || "Product Image"}
              className="w-full h-auto object-cover"
              width={400}
              height={400}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[30%] product-details">
          <p className="text-lg font-bold mt-3">
            Style Code:{" "}
            <span className="text-lg font-normal">
              {selectedProduct?.styleCode || selectedProduct?.id || "N/A"}
            </span>
          </p>
          
          {/* Stock Status Indicator */}
          <div className="mb-3 mt-2">
            {selectedProduct.available ? (
              <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded">
                In Stock
              </span>
            ) : (
              <span className="inline-block px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {selectedProduct.discount ? (
            <>
              {selectedProduct.unstichedPrice ? (
                <>
                  <div className="flex justify-start items-center mt-1">
                    <h5 className="text-lg font-bold">
                      Unstitched Price:{" "}
                    </h5>
                    <p className="ml-2 text-red-500 line-through">
                      {selectedProduct.unstichedPrice} PKR
                    </p>
                    <p className="ml-2 text-black">
                      {Math.round(
                        selectedProduct.unstichedPrice -
                          (selectedProduct.unstichedPrice *
                            selectedProduct.discount) /
                            100
                      )}{" "}
                      PKR
                    </p>
                  </div>
                  <div className="flex justify-start items-center mt-1">
                    <h5 className="text-lg font-bold">Stitched Price: </h5>
                    <p className="ml-2 text-red-500 line-through">
                      {selectedProduct.stichedPrice} PKR
                    </p>
                    <p className="ml-2 text-black">
                      {Math.round(
                        selectedProduct.stichedPrice -
                          (selectedProduct.stichedPrice *
                            selectedProduct.discount) /
                            100
                      )}{" "}
                      PKR
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-start items-center mt-1">
                    <h5 className="text-lg font-bold">Stitched Price: </h5>
                    <p className="ml-2 text-red-500 line-through">
                      {selectedProduct.stichedPrice} PKR
                    </p>
                    <p className="ml-2 text-black">
                      {Math.round(
                        selectedProduct.stichedPrice -
                          (selectedProduct.stichedPrice *
                            selectedProduct.discount) /
                            100
                      )}{" "}
                      PKR
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {selectedProduct.unstichedPrice && (
                <div className="flex justify-start items-center mt-1">
                  <h5 className="text-lg font-bold">Unstitched Price: </h5>
                  <p className="ml-2 text-black">
                    {selectedProduct.unstichedPrice} PKR
                  </p>
                </div>
              )}
              {selectedProduct.stichedPrice && (
                <div className="flex justify-start items-center mt-1">
                  <h5 className="text-lg font-bold">Stitched Price: </h5>
                  <p className="ml-2 text-black">
                    {selectedProduct.stichedPrice} PKR
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-8">
            <h5 className="text-lg font-bold mb-2">Available Sizes:</h5>
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
              <div className="grid grid-cols-5 gap-2 mb-4">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className={`p-2 border ${
                      selectedSize === size
                        ? "border-pink-500 bg-pink-50"
                        : selectedProduct.sizes.includes(size)
                          ? "border-gray-300 hover:border-pink-500"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    } rounded`}
                    onClick={() => selectedProduct.sizes.includes(size) && handleSizeSelect(size)}
                    disabled={!selectedProduct.sizes.includes(size) || !selectedProduct.available}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">One size fits all</p>
            )}
            <button
              className="text-blue-600 hover:underline mb-4 flex items-center"
              onClick={openModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Size Guide
            </button>

            <div className="flex items-center mb-6">
              <h5 className="text-lg font-bold mr-4">Quantity:</h5>
              <button
                className={`w-8 h-8 border rounded-l flex items-center justify-center ${
                  selectedProduct.available 
                    ? "hover:bg-gray-100" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => handleQuantityChange(-1)}
                disabled={!selectedProduct.available}
              >
                -
              </button>
              <span className="w-12 h-8 border-t border-b flex items-center justify-center">
                {quantity}
              </span>
              <button
                className={`w-8 h-8 border rounded-r flex items-center justify-center ${
                  selectedProduct.available 
                    ? "hover:bg-gray-100" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => handleQuantityChange(1)}
                disabled={!selectedProduct.available}
              >
                +
              </button>
            </div>

            <button
              className={`w-full py-3 px-4 rounded ${
                !selectedProduct.available
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700 text-white"
              }`}
              onClick={handleAddToCart}
              disabled={!selectedProduct.available}
            >
              {selectedProduct.available ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>

      <SizeModal isOpen={isModalOpen} onClose={closeModal} />
    </Layout>
  );
} 