"use client";

import Layout from "@/utilities/Layout";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ClearanceSale() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("Clearance Sale");
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
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const response = await res.json();
        setTitle(response.title);
        setData(response.products); // Make sure this is an array
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }
    fetchData();
  }, []);

  // Apply filters function that actually does the filtering
  const applyFilters = () => {
    if (!data || data.length === 0) return [];
    
    let filteredProducts = [...data]; // Create a copy of the original data

    // Filter by max price
    filteredProducts = filteredProducts.filter(
      (product) => (product.unstichedPrice || product.stichedPrice) <= maxPrice
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
        (product) => product.available === true
      );
    }

    // Sort products
    if (sortOrder === "lowest") {
      filteredProducts.sort((a, b) => {
        const priceA = a.unstichedPrice || a.stichedPrice;
        const priceB = b.unstichedPrice || b.stichedPrice;
        return priceA - priceB;
      });
    } else if (sortOrder === "highest") {
      filteredProducts.sort((a, b) => {
        const priceA = a.unstichedPrice || a.stichedPrice;
        const priceB = b.unstichedPrice || b.stichedPrice;
        return priceB - priceA;
      });
    }

    return filteredProducts;
  };

  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Apply filters whenever data changes or filters change
  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredProducts(applyFilters());
    }
  }, [data]);

  // Calculate the current products to display from filtered products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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
    // Actually apply the filters and update the state
    setFilteredProducts(applyFilters());
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row p-2">
        <div className="filter p-4 mt-5 lg:mt-24 mb-10 bg-gray-50 w-full lg:w-[20%] relative lg:sticky top-0 lg:top-40 h-full rounded-lg shadow-lg border">
          <h2 className="text-lg font-semibold mb-4 text-black relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-pink-600 after:transform after:scale-x-50 after:hover:scale-x-100 after:transition-transform after:duration-300">
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
              className="w-full accent-pink-600"
            />
            <p className="text-gray-600">Selected Price: Rs. {maxPrice}</p>
          </div>

          {/* Sort By Filter */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Sort By:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border rounded-lg p-2 focus:border-pink-600 focus:ring-1 focus:ring-pink-600 focus:outline-none transition-colors duration-300"
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
              className="w-full border rounded-lg p-2 focus:border-pink-600 focus:ring-1 focus:ring-pink-600 focus:outline-none transition-colors duration-300"
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
            <label className="inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={showInStock}
                onChange={() => setShowInStock(!showInStock)}
                className="form-checkbox h-5 w-5 text-pink-600 rounded border-gray-300 focus:ring-pink-600 transition-colors duration-300"
              />
              <span className="ml-2 text-gray-700 group-hover:text-pink-600 transition-colors duration-300">Show In Stock Only</span>
            </label>
          </div>

          <button
            onClick={handleApplyFilters}
            className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 transition-colors duration-300 hover:shadow-md w-full"
          >
            Apply Filters
          </button>
        </div>

        <div className="products w-full lg:w-[80%]">
          <h1 className="text-3xl font-medium flex justify-start items-center uppercase px-5 lg:px-20 mt-10 relative">
            <span className="relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-pink-600 after:transform after:scale-x-50 after:hover:scale-x-100 after:transition-transform after:duration-300">
              {title}
            </span>
          </h1>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-5 px-4 lg:px-20">
            {currentProducts?.map((item, index) => (
              <Link href={`/${item.collection}/${item.id}`} key={index} className="group">
                <div className="card text-center overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-100 group-hover:translate-y-[-5px] h-auto">
                  <div className="w-full h-[350px] overflow-hidden rounded-t-lg relative">
                    <Image
                      src={item.image?.startsWith("http") 
                        ? item.image 
                        : `https://static.wajeehacouture.com/assets${item.image}`}
                      alt={item.title}
                      className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      width={300}
                      height={300}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                      <div className="p-4 w-full">
                        <h5 className="font-medium text-lg text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h5>
                      </div>
                    </div>
                    
                    {/* Discount Badge */}
                    {item.discount && (
                      <div className="absolute top-2 left-2 bg-pink-600 text-white py-1 px-3 rounded-full transform rotate-0 group-hover:rotate-3 transition-transform duration-300">
                        <span className="font-medium text-sm">{item.discount}% OFF</span>
                      </div>
                    )}
                    
                    {/* Stock Status Indicator */}
                    <div className="absolute top-2 right-2">
                      {item.available === true ? (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded group-hover:bg-green-200 transition-colors duration-300">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded group-hover:bg-red-200 transition-colors duration-300">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-b-lg">
                    <h5 className="font-medium text-lg text-gray-800 group-hover:text-pink-600 transition-colors duration-300 truncate">
                      {item.title}
                    </h5>
                    
                    {item.discount ? (
                      <div className="mt-2">
                        {/* Original price with strikethrough in red */}
                        {item.unstichedPrice ? (
                          <p className="text-red-500 line-through text-sm">
                            Rs. {item.unstichedPrice} PKR
                          </p>
                        ) : (
                          <p className="text-red-500 line-through text-sm">
                            Rs. {item.stichedPrice} PKR
                          </p>
                        )}

                        {/* Discounted price after applying discount and rounding off */}
                        {item.unstichedPrice ? (
                          <p className="text-gray-700 font-medium">
                            Rs.{" "}
                            {Math.round(
                              item.unstichedPrice -
                                (item.unstichedPrice * item.discount) / 100
                            )}{" "}
                            PKR
                          </p>
                        ) : (
                          <p className="text-gray-700 font-medium">
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
                      <div className="mt-2">
                        {item.unstichedPrice ? (
                          <p className="text-gray-700 font-medium">
                            Rs. {item.unstichedPrice} PKR
                          </p>
                        ) : (
                          <p className="text-gray-700 font-medium">
                            Rs. {item.stichedPrice} PKR
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center my-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg mr-2 transition-colors duration-300 ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-pink-600 text-white hover:bg-pink-700 hover:shadow-md"
              }`}
            >
              Previous
            </button>
            <span className="flex items-center mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded-lg ml-2 transition-colors duration-300 ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-pink-600 text-white hover:bg-pink-700 hover:shadow-md"
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
