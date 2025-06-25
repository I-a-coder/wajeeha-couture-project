import Layout from "@/utilities/Layout";
import { promises as fs } from "fs";
import Image from "next/image";
import Link from "next/link";

export default async function Collections() {
  const file = await fs.readFile(
    process.cwd() + "/src/data/collectionData.json",
    "utf8"
  );
  const data = JSON.parse(file);

  console.log(data.title);

  return (
    <Layout>
      <div className="first-section mt-10">
        <h1 className="text-3xl font-medium flex justify-center items-center uppercase px-20 mt-10">
          {data.title}
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-7 p-10">
          {data.collections.map((collection, index) => (
            <a href={`/collections/${collection.path}`} key={index}>
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-pink-600 shadow-lg flex flex-col items-center justify-center">
                <div className="w-full h-[400px] overflow-hidden rounded-t-lg">
                  <Image
                    src={`https://static.wajeehacouture.com/assets${collection.image}`}
                    alt={collection.title}
                    className="object-cover w-full h-full"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
              <h1 className="text-center mt-3">{collection.title}</h1>
            </a>
          ))}
        </div>

        {/* Render Collection Sections */}
        {data.sections.map((section, index) => (
          <div key={index}>
            <h1 className="text-2xl font-medium flex justify-center md:justify-start items-center text-center lg:text-start uppercase py-5 px-4 lg:px-20 ml-0 lg:ml-6 mt-10">
              {section.collectionTitle}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-5 px-4 lg:px-20">
              {section.items.map((item, index) => (
                <Link href={`/${item.collection}/${item.id}`} key={index}>
                  <div className="card text-center overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border">
                    <div
                      className={`w-full ${
                        section.collectionTitle === "Winter V1 Collection"
                          ? "h-[300px]"
                          : "h-[400px]"
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
                      {!item.available && (
                        <p className="text-red-500 text-sm">Out of Stock</p>
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
