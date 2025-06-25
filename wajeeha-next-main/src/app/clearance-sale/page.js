"use client";

import Layout from "@/utilities/Layout";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function NewArrivals() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [productsPerPage] = useState(12); // Number of products to show per page

  // Filter states
  const [maxPrice, setMaxPrice] = useState(20000); // Example default max price
  const [sortOrder, setSortOrder] = useState("lowest"); // Default sort order
  const [selectedCollection, setSelectedCollection] = useState("All"); // Default collection
  const [showInStock, setShowInStock] = useState(false); // Default for in-stock

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/clearanceSaleApi");
        console.log("API response status:", res.status); // Debug
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const response = await res.json();
        console.log("API response data:", response); // Debug
        setTitle(response.title);
        setData(response.products); // Make sure this is an array
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }
    fetchData();
  }, []);

  // Calculate the current products to display after applying filters
  const applyFilters = () => {
    let filteredProducts = [...data]; // Create a copy of the original data

    // Filter by max price
    filteredProducts = filteredProducts.filter(
      (product) => product.unstichedPrice <= maxPrice
    );

    // Filter by collection
    if (selectedCollection !== "All") {
      filteredProducts = filteredProducts.filter(
        (product) => product.collectionName === selectedCollection
      );
    }

    // Filter by in-stock status
    if (showInStock) {
      filteredProducts = filteredProducts.filter(
        (product) => product.available
      );
    }

    // Sort products
    if (sortOrder === "lowest") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highest") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    return filteredProducts;
  };

  const filteredProducts = applyFilters(); // Get filtered products
  const indexOfLastProduct = currentPage * productsPerPage; // Last product index
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage; // First product index
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  ); // Products for the current page

  // Total number of pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Scroll to top whenever currentPage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle filter changes
  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    // Other state updates can be handled directly with controlled components
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row p-2">
        <div className="filter p-4 mt-5 lg:mt-24 mb-10 bg-gray-50 w-full lg:w-[20%] relative lg:sticky top-0 lg:top-40 h-full rounded-lg shadow-lg border">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Filter Products
          </h2>

          {/* Price Range Filter */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Max Price: Rs.</label>
            <input
              type="range"
              min="0"
              max="20000" // Set this according to your product price range
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-gray-500"
            />
            <p className="text-gray-600">Selected Price: Rs. {maxPrice}</p>
          </div>

          {/* Sort By Filter */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Sort By:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="lowest">Price: Lowest to Highest</option>
              <option value="highest">Price: Highest to Lowest</option>
            </select>
          </div>

          {/* Collection Filter */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Collection:</label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="All">All</option>
              <option value="Aghaz Collection">Aghaz Collection</option>
              <option value="Barsat Collection">Barsat Collection</option>
              <option value="Wedding Formals">Wedding Formals</option>
              <option value="Winter V1">Winter V1</option>
            </select>
          </div>

          {/* In-Stock Filter */}
          <div className="my-6 ml-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showInStock}
                onChange={() => setShowInStock(!showInStock)}
                className="form-checkbox h-5 w-5 text-gray-500"
              />
              <span className="ml-2 text-gray-700">Show In Stock Only</span>
            </label>
          </div>

          <button
            onClick={handleApplyFilters}
            className="bg-black text-white p-2 rounded-lg hover:bg-gray-700"
          >
            Apply Filters
          </button>
        </div>

        <div className="products w-full lg:w-[80%]">
          <h1 className="text-3xl font-medium flex justify-start items-center uppercase px-5 lg:px-20 mt-10">
            {title}
          </h1>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-5 px-4 lg:px-20">
            {currentProducts?.map((item, index) => (
              <a href={`/${item.collection}/${item.id}`} key={index}>
                <div className="card text-center overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-[500px]">
                  <div className="w-full h-[400px] overflow-hidden rounded-t-lg">
                    <Image
                      src={`https://static.wajeehacouture.com/assets${item.image}`}
                      alt={item.title}
                      className="object-cover w-full h-full"
                      width={300}
                      height={300}
                    />
                  </div>
                  <div className="p-4 bg-white rounded-b-lg">
                    <h5 className="font-medium text-lg text-pink-600">
                      {item.title}
                    </h5>
                    {item.discount ? (
                      <div>
                        {/* Original price with strikethrough in red */}
                        {item.unstichedPrice ? (
                          <p className="text-red-500 line-through">
                            Rs. {item.unstichedPrice} PKR
                          </p>
                        ) : (
                          <p className="text-red-500 line-through">
                            Rs. {item.stichedPrice} PKR
                          </p>
                        )}

                        {/* Discounted price after applying discount and rounding off */}
                        {item.unstichedPrice ? (
                          <p className="text-gray-500">
                            Rs.{" "}
                            {Math.round(
                              item.unstichedPrice -
                                (item.unstichedPrice * item.discount) / 100
                            )}{" "}
                            PKR
                          </p>
                        ) : (
                          <p className="text-gray-500">
                            Rs.{" "}
                            {Math.round(
                              item.stichedPrice -
                                (item.stichedPrice * item.discount) / 100
                            )}{" "}
                            PKR
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        {/* Show price without discount if no discount is present */}
                        {item.unstichedPrice ? (
                          <p className="text-gray-500">
                            Rs. {item.unstichedPrice} PKR
                          </p>
                        ) : (
                          <p className="text-gray-500">
                            Rs. {item.stichedPrice} PKR
                          </p>
                        )}
                      </div>
                    )}
                    {!item.available && (
                      <p className="text-red-500 text-sm">Out of Stock</p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center my-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg mr-2 ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              Previous
            </button>
            <span className="flex items-center mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ml-2 ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
