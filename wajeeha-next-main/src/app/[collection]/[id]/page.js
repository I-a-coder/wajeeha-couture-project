"use client";

import Layout from "@/utilities/Layout";
import SizeModal from "@/utilities/modal/SizeModal";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation"; // Use this to get dynamic route params
import React, { useEffect, useState } from "react";

export const runtime = "edge";

export default function Product() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  // Retrieve the collection and id from the route parameters
  const { collection, id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/allProductApi");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const response = await res.json();
        console.log("API Response:", response); // Log API response

        // Find the product by collection and id
        const selectedCollection = response.products.find(
          (prod) => prod.collection === collection
        );
        if (selectedCollection) {
          const product = selectedCollection.items.find(
            (item) => item.id === id
          );
          if (!product) {
            throw new Error(
              `Product with id ${id} not found in collection ${collection}`
            );
          }
          setSelectedProduct(product);
        } else {
          throw new Error(`Collection ${collection} not found`);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }

    if (collection && id) {
      fetchData();
    }
  }, [collection, id]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row justify-center items-start gap-10 px-4 sm:px-8 md:px-16 lg:px-20 py-10">
        <div className="block lg:hidden w-full product-image">
          {selectedProduct?.image ? (
            <Image
              src={
                "https://static.wajeehacouture.com/assets" +
                selectedProduct.image
              }
              alt="Product Image"
              className="w-full h-auto object-cover"
              width={400}
              height={400}
            />
          ) : (
            <p>No image available</p>
          )}
        </div>

        <div className="w-full lg:w-[30%] product-description">
          <h1 className="font-bold text-2xl mb-4">{selectedProduct?.title}</h1>
          <h5 className="font-bold text-lg mb-2">Details:</h5>
          <p>{selectedProduct?.details?.description}</p>
          <ul className="mt-2">
            <li>Color: {selectedProduct?.details.color}</li>
            <li>Fabric: {selectedProduct?.details.fabric}</li>
            <li>Article Type: {selectedProduct?.details.articleType}</li>
            <li>Pieces: {selectedProduct?.details.pieces}</li>
          </ul>

          <h5 className="font-bold text-lg mt-6">Size & Fit:</h5>
          <ul>
            <li>Model Height: {selectedProduct?.sizeAndFit.modelHeight}</li>
            <li>Model Size: {selectedProduct?.sizeAndFit.modelSize}</li>
          </ul>

          <h5 className="font-bold text-lg mt-6">Return & Exchange:</h5>
          <p>{selectedProduct?.returnAndExchange.exchangePolicy}</p>
          <ul className="ml-4 list-disc">
            {selectedProduct?.returnAndExchange.eligibleArticles.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
          <p className="mt-2">
            <strong>Refund Policy:</strong>{" "}
            {selectedProduct?.returnAndExchange.refundPolicy}
          </p>
          <p>
            <strong>Sale Policy:</strong>{" "}
            {selectedProduct?.returnAndExchange.salePolicy}
          </p>
        </div>

        <div className="hidden lg:block w-full lg:w-[40%] product-image">
          {selectedProduct?.image ? (
            <Image
              src={
                "https://static.wajeehacouture.com/assets" +
                selectedProduct.image
              }
              alt="Product Image"
              className="w-full h-auto object-cover"
              width={400}
              height={400}
            />
          ) : (
            <p>No image available</p>
          )}
        </div>

        <div className="w-full lg:w-[30%] product-details">
          {selectedProduct ? (
            <>
              <p className="text-lg font-bold mt-3">
                Style Code:{" "}
                <span className="text-lg font-normal">
                  {selectedProduct?.styleCode}
                </span>
              </p>
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
                  {selectedProduct.unstichedPrice ? (
                    <>
                      <div className="flex justify-start items-center mt-1">
                        <h5 className="text-lg font-bold">
                          Unstitched Price:{" "}
                        </h5>
                        <p className="ml-2">
                          {selectedProduct.unstichedPrice} PKR
                        </p>
                      </div>
                      <div className="flex justify-start items-center mt-1">
                        <h5 className="text-lg font-bold">Stitched Price: </h5>
                        <p className="ml-2">
                          {selectedProduct.stichedPrice} PKR
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-start items-center mt-1">
                        <h5 className="text-lg font-bold">Stitched Price: </h5>
                        <p className="ml-2">
                          {selectedProduct.stichedPrice} PKR
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}

              <h5 className="font-bold text-lg my-4">Sizes Available</h5>
              <div className="flex flex-wrap gap-4 mb-4">
                {selectedProduct?.sizes.map((size, index) => (
                  <button
                    className="border px-4 py-2 rounded-lg hover:bg-gray-200"
                    key={index}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <button
                onClick={openModal} // Open the modal on click
                className="border-2 border-gray-500 px-4 py-2 rounded-lg text-lg font-bold mt-2"
              >
                SIZE CHART
              </button>

              {/* Modal */}
              {isModalOpen && <SizeModal closeModal={closeModal} />}

              <div className="flex items-center gap-2 mt-6">
                <button className="px-4 py-2 border rounded">-</button>
                <span className="text-xl">1</span>
                <button className="px-4 py-2 border rounded">+</button>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900">
                <Link href="/cart">Add to Cart</Link>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
