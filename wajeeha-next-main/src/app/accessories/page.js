import Layout from "@/utilities/Layout";
import { promises as fs } from "fs";
import Image from "next/image";
import Link from "next/link";

export default async function Accessories() {
  const file = await fs.readFile(
    process.cwd() + "/src/data/accessoriesPageData.json",
    "utf8"
  );
  const data = JSON.parse(file);

  return (
    <Layout>
      <div className="first-section mt-10">
        <h1 className="text-3xl font-medium flex justify-center items-center uppercase px-20 mt-10 relative">
          <span className="relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-1 after:bg-pink-600 after:transform after:scale-x-50 after:hover:scale-x-100 after:transition-transform after:duration-300">
            {data.title || "Accessories"}
          </span>
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-7 p-10">
          {data.collections && data.collections.map((collection, index) => (
            <Link href={`/collections/${collection.path}`} key={index} className="group">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-pink-200 shadow-md hover:shadow-xl transition-all duration-500 group-hover:border-pink-600">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={collection.image?.startsWith("http") 
                      ? collection.image 
                      : `https://static.wajeehacouture.com/assets${collection.image}`}
                    alt={collection.title}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    width={400}
                    height={400}
                  />
                </div>
                <div className="absolute inset-0 bg-pink-600/0 group-hover:bg-pink-600/20 transition-colors duration-300"></div>
              </div>
              <h1 className="text-center mt-3 font-medium group-hover:text-pink-600 transition-colors duration-300">{collection.title}</h1>
            </Link>
          ))}
        </div>

        {/* Render Collection Sections */}
        {data.sections && data.sections.map((section, index) => (
          <div key={index} className="mb-16">
            <h1 className="text-2xl font-medium flex justify-center md:justify-start items-center text-center lg:text-start uppercase py-5 px-4 lg:px-20 ml-0 lg:ml-6 mt-10 relative">
              <span className="relative inline-block after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-pink-600 after:transform after:scale-x-50 after:hover:scale-x-100 after:transition-transform after:duration-300">
                {section.collectionTitle}
              </span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-5 px-4 lg:px-20">
              {section.items.map((item, itemIndex) => (
                <Link href={`/accessories/${item.id}`} key={itemIndex} className="group">
                  <div className="card text-center overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-pink-100 group-hover:translate-y-[-5px]">
                    <div
                      className={`w-full ${
                        section.collectionTitle === "Winter V1 Collection"
                          ? "h-[300px]"
                          : "h-[400px]"
                      } overflow-hidden rounded-t-lg relative`}
                    >
                      <Image
                        src={item.image?.startsWith("http") 
                          ? item.image 
                          : `https://static.wajeehacouture.com/assets${item.image}`}
                        alt={item.title}
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        width={400}
                        height={400}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                        <div className="p-4 w-full">
                          <h5 className="font-medium text-lg text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h5>
                        </div>
                      </div>
                      
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
          </div>
        ))}
      </div>
    </Layout>
  );
}
