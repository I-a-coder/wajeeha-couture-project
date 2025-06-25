"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "../utilities/Layout";
import { Carousel } from "react-responsive-carousel";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/homeApi");
        console.log("API response status:", res.status);
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const response = await res.json();
        console.log("API response data:", response);
        setData(response.sections);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      {/* <Carousel>
        <div>
          <Image
            src="/assets/images/wajeeha.jpg"
            width={400}
            height={400}
            alt="image1"
          />
          <p className="legend">Image 1</p>
        </div>
        <div>
          <Image
            src="/assets/images/wajeeha.jpg"
            width={400}
            height={400}
            alt="image2"
          />
          <p className="legend">Image 2</p>
        </div>
        <div>
          <Image
            src="/assets/images/wajeeha.jpg"
            width={400}
            height={400}
            alt="image3"
          />
          <p className="legend">Image 3</p>
        </div>
        <div>
          <Image
            src="/assets/images/wajeeha.jpg"
            width={400}
            height={400}
            alt="image4"
          />
          <p className="legend">Image 4</p>
        </div>
        <div>
          <Image
            src="/assets/images/wajeeha.jpg"
            width={400}
            height={400}
            alt="image5"
          />
          <p className="legend">Image 5</p>
        </div>
      </Carousel> */}
      <div className="first-section mt-10">
        {/* Loop through each section in the sections array */}
        {data?.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl lg:text-3xl font-medium text-center mt-5">
              {section.title}
            </h2>
            {section.type === "newArrivals" ||
            section.type === "barsatCollection" ||
            section.type === "spotlightSelections" ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-5 px-4 lg:px-20">
                {section.items.map((item, index) => (
                  <Link
                    href={`/${item.collection}/${item.id}`}
                    className="card text-center overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    key={index}
                  >
                    <div
                      className={`w-full ${
                        section.type === "newArrivals"
                          ? "h-[300px]"
                          : "h-[400px]"
                      } overflow-hidden rounded-t-lg`}
                    >
                      <Image
                        src={`https://static.wajeehacouture.com/assets${item.image}`}
                        alt={item.title}
                        className="object-contain md:object-cover w-full h-full"
                        width={400}
                        height={400}
                      />
                    </div>
                    <div className="p-4 bg-white rounded-b-lg">
                      <h5 className="font-medium text-base lg:text-lg text-pink-600">
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
                  </Link>
                ))}
              </div>
            ) : section.type === "shopByCollection" ? (
              <div className="flex flex-wrap justify-center items-center gap-7 p-10">
                {section.items.map((item) => (
                  <a key={item.path} href={`/collections/${item.path}`}>
                    <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-pink-600 shadow-lg flex flex-col items-center justify-center">
                      <div className="w-full h-[450px] overflow-hidden rounded-t-lg">
                        <Image
                          src={`https://static.wajeehacouture.com/assets${item.image}`}
                          alt={item.title}
                          className="object-cover w-full h-full"
                          width={400}
                          height={400}
                        />
                      </div>
                    </div>
                    <h1 className="text-sm lg:text-base text-center mt-3">{item.title}</h1>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Layout>
  );
}
