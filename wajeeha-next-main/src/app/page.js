"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/utilities/Layout";

// Default banner image as a base64 encoded placeholder
const DEFAULT_BANNER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCABkAIADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDy+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=";

export default function Home() {
  const [data, setData] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerError, setBannerError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch home page data
        const homeResponse = await fetch("/api/homeApi");
        const homeData = await homeResponse.json();
        setData(homeData);
        
        // Fetch collections for the featured section
        const collectionsResponse = await fetch("/api/allCollectionsApi");
        const collectionsData = await collectionsResponse.json();
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Function to handle image loading error
  const handleImageError = () => {
    setBannerError(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Hero Banner with Parallax Effect */}
      <div className="relative overflow-hidden">
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
          <div className="absolute inset-0 transform hover:scale-105 transition-transform duration-3000 ease-out">
          <Image
              src="/assets/display.png"
              alt="Hero Banner"
              className="w-full h-full object-cover"
              width={1920}
              height={600}
              priority
            />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8 py-10 rounded-lg max-w-lg backdrop-blur-sm bg-gradient-to-b from-transparent to-black/50 hover:from-transparent hover:to-black/60 transition-all duration-500 transform hover:scale-105">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4 text-shadow-lg animate-fadeIn">Wajeeha Couture</h1>
            <p className="text-lg md:text-xl mb-6 font-light text-shadow animate-fadeIn animation-delay-200">Elegance in Every Stitch</p>
            <Link href="/collections" className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-md transition-all duration-300 inline-block hover:shadow-lg hover:translate-y-[-2px] animate-fadeIn animation-delay-400">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12 relative">
            <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-pink-600 after:transform after:scale-x-0 after:hover:scale-x-100 after:transition-transform after:duration-300">Featured Collections</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections && collections.length > 0 ? collections.slice(0, 3).map((collection) => (
              <div key={collection.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100 group">
                <Link href={`/collections/${collection.id}`} className="block h-full">
                  <div className="relative h-80 overflow-hidden">
          <Image
                      src={collection.image?.startsWith("http") ? collection.image : "/assets/banner-default.jpg"}
                      alt={collection.title || "Collection image"}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            width={400}
                      height={300}
                    />
                    {collection.featured && (
                      <div className="absolute top-0 right-0 bg-pink-600 text-white py-1 px-3 m-3 rounded-md transform group-hover:scale-110 transition-transform duration-300">
                        <span className="font-medium">FEATURED</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                      <div className="p-6 w-full">
                        <h3 className="text-xl font-medium text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{collection.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-gray-800 truncate group-hover:text-pink-600 transition-colors duration-300">{collection.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 h-12 overflow-hidden">{collection.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-600 font-medium group-hover:translate-x-1 transition-transform duration-300">View Collection</span>
                      <svg className="w-5 h-5 text-pink-600 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            )) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Featured collections coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sale Section */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/banner-default.jpg')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-serif text-center mb-12 relative">
            <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-pink-600 after:transform after:scale-x-0 after:hover:scale-x-100 after:transition-transform after:duration-300">Sale</span>
          </h2>
          
          <div className="text-center mb-10">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover our exclusive clearance sale with amazing discounts on premium fashion items. 
              Don't miss out on these limited-time offers!
            </p>
            <Link href="/clearance-sale" className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-8 rounded-md transition-all duration-300 inline-flex items-center hover:shadow-lg hover:translate-y-[-2px]">
              <span>Shop Clearance Sale</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections && collections.length > 0 ? collections.slice(0, 3).map((collection) => (
              <div key={collection.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100 group">
                <Link href={`/collections/${collection.id}`} className="block h-full">
                  <div className="relative h-80 overflow-hidden">
          <Image
                      src={collection.image?.startsWith("http") ? collection.image : "https://static.wajeehacouture.com/assets" + collection.image}
                      alt={collection.title || "Collection image"}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            width={400}
                      height={300}
                    />
                    <div className="absolute top-0 right-0 bg-pink-600 text-white py-1 px-3 m-3 rounded-md transform rotate-0 group-hover:rotate-3 transition-transform duration-300">
                      <span className="font-medium">SALE</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                      <div className="p-6 w-full">
                        <h3 className="text-xl font-medium text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{collection.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-gray-800 truncate group-hover:text-pink-600 transition-colors duration-300">{collection.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 h-12 overflow-hidden">{collection.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-600 font-medium group-hover:translate-x-1 transition-transform duration-300">View Collection</span>
                      <svg className="w-5 h-5 text-pink-600 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            )) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">Sale items coming soon...</p>
              </div>
            )}
        </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12 relative">
            <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-pink-600 after:transform after:scale-x-0 after:hover:scale-x-100 after:transition-transform after:duration-300">New Arrivals</span>
            </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data && data[0]?.sections?.find(s => s.type === "newArrivals")?.items ? 
              data[0].sections.find(s => s.type === "newArrivals").items.slice(0, 8).map((item, index) => (
                  <Link
                    href={`/${item.collection}/${item.id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100 group"
                    key={index}
                  >
                  <div className="h-64 overflow-hidden relative">
                      <Image
                      src={item.image?.startsWith("http") ? item.image : "https://static.wajeehacouture.com/assets" + item.image}
                      alt={item.title || "Product image"}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      width={300}
                      height={300}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg text-gray-800 mb-2 truncate group-hover:text-pink-600 transition-colors duration-300">{item.title}</h3>
                    
                    {/* Stock Status Indicator */}
                    <div className="mb-2">
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
                    
                      {item.discount ? (
                        <div>
                          {item.unstichedPrice ? (
                          <>
                            <p className="text-red-500 line-through text-sm">Rs. {item.unstichedPrice} PKR</p>
                            <p className="text-gray-700 font-medium">
                              Rs. {Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100)} PKR
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-red-500 line-through text-sm">Rs. {item.stichedPrice} PKR</p>
                            <p className="text-gray-700 font-medium">
                              Rs. {Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100)} PKR
                            </p>
                          </>
                          )}
                        </div>
                      ) : (
                      <p className="text-gray-700 font-medium">
                        Rs. {item.unstichedPrice || item.stichedPrice} PKR
                            </p>
                          )}
                  </div>
                </Link>
              )) : (
                <div className="col-span-4 text-center py-8">
                  <p className="text-gray-500">New arrivals coming soon...</p>
                        </div>
                      )}
          </div>
          <div className="text-center mt-10">
            <Link href="/new-arrivals" className="inline-block bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Shop By Collection Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12 relative">
            <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-pink-600 after:transform after:scale-x-0 after:hover:scale-x-100 after:transition-transform after:duration-300">Shop By Collection</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {data && data[0]?.sections?.find(s => s.type === "shopByCollection")?.items ? 
              data[0].sections.find(s => s.type === "shopByCollection").items.map((item, index) => (
                <Link
                  key={index}
                  href={`/collections/${item.path}`}
                  className="text-center group relative"
                >
                  <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-2 border-pink-200 shadow-md transition-all duration-300 group-hover:border-pink-600 group-hover:shadow-lg relative">
                    <Image
                      src={item.image?.startsWith("http") ? item.image : "https://static.wajeehacouture.com/assets" + item.image}
                      alt={item.title || "Collection image"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      width={144}
                      height={144}
                    />
                    <div className="absolute inset-0 bg-pink-600/0 group-hover:bg-pink-600/20 transition-colors duration-300"></div>
                  </div>
                  <h3 className="mt-4 text-base font-medium text-gray-800 group-hover:text-pink-600 transition-colors duration-300">{item.title}</h3>
                </Link>
              )) : (
                <div className="text-center py-8 w-full">
                  <p className="text-gray-500">Collections coming soon...</p>
                </div>
                      )}
                    </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12 relative">
            <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-pink-600 after:transform after:scale-x-0 after:hover:scale-x-100 after:transition-transform after:duration-300">Customer Love</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:translate-y-[-5px]">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">"I absolutely love my new dress from Wajeeha Couture! The quality is exceptional and the design is unique. I've received so many compliments!"</p>
              <div className="flex items-center">
                <div className="font-medium">Ayesha K.</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:translate-y-[-5px]">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">"The customer service is outstanding! When I needed to exchange a size, they made the process so easy. I'll definitely be shopping here again."</p>
              <div className="flex items-center">
                <div className="font-medium">Fatima R.</div>
                      </div>
                    </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:translate-y-[-5px]">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">"The attention to detail in their embroidery work is incredible. These pieces are truly works of art and worth every penny!"</p>
              <div className="flex items-center">
                <div className="font-medium">Zainab M.</div>
              </div>
            </div>
          </div>
      </div>
      </section>
    </Layout>
  );
}
