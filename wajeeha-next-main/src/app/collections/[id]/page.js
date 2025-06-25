"use client";

import Layout from "@/utilities/Layout";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Add this line to enable Edge Runtime
export const runtime = "edge";

export default function Collection() {
  const [data, setData] = useState([]); // Initialize as an empty array
  const [selectedCollection, setSelectedCollection] = useState(null); // State for the selected collection

  const pathname = usePathname();
  const path = pathname.split("/").pop(); // Get the last segment of the URL

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/allCollectionsApi");
        console.log("API response status:", res.status); // Debug
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const response = await res.json();
        console.log("API response data:", response); // Debug
        setData(response.collections); // Make sure this is an array
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Filter the collection based on the path
    if (data.length > 0) {
      const filteredCollection = data.filter(
        (collection) => collection.name.toLowerCase() === path.toLowerCase() // Case-insensitive comparison
      );
      setSelectedCollection(
        filteredCollection.length > 0 ? filteredCollection[0] : null
      );
      console.log(filteredCollection, "filtered collection"); // Debug
    }
  }, [data, path]); // Run this effect when data or path changes

  return (
    <Layout>
      {selectedCollection && (
        <div className="flex flex-col lg:flex-row p-2">
          <div className="filter p-4 mt-24 mb-10 bg-gray-50 w-full lg:w-[20%] sticky top-20 h-full rounded-lg shadow-lg border">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Filter Products
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Max Price: Rs.</label>
              <input type="range" className="w-full accent-gray-500" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Sort By:</label>
              <select className="w-full border rounded-lg p-2">
                <option value="lowest">Price: Lowest to Highest</option>
                <option value="highest">Price: Highest to Lowest</option>
              </select>
            </div>

            <div className="my-6 ml-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-500"
                />
                <span className="ml-2 text-gray-700">Show In Stock Only</span>
              </label>
            </div>

            <button className="bg-black text-white p-2 rounded-lg hover:bg-gray-700">
              Apply Filters
            </button>
          </div>

          <div className="products w-full lg:w-[80%]">
            <h1 className="text-3xl font-medium flex justify-start items-center uppercase px-5 lg:px-20 mt-10">
              {selectedCollection.title || "none"}
            </h1>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-5 px-4 lg:px-20">
              {selectedCollection?.products?.map((item, index) => (
                <Link
                  href={`/${item.collection}/${item.id}`}
                  className={`card text-center overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    selectedCollection.name === "Winter"
                      ? "h-300px]"
                      : ""
                  }`}
                  key={index}
                >
                  <div
                    className={`w-full ${
                      selectedCollection.name === "Winter"
                        ? "h-[200px]"
                        : "h-[300px]"
                    } overflow-hidden rounded-t-lg`}
                  >
                    <Image
                      src={`https://static.wajeehacouture.com/assets${item.image}`}
                      alt={item.title}
                      className="object-cover w-full h-full"
                      width={400}
                      height={400}
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
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center my-6">
              <button className="px-4 py-2 bg-gray-300 rounded-lg mr-2">
                Previous
              </button>
              <span className="flex items-center"></span>
              <button className="px-4 py-2 bg-gray-300 rounded-lg ml-2">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
