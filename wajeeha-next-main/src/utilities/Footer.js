"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/footerApi"); // Correct API URL
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const footerData = await res.json();
        setData(footerData);
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="bg-[#F6F6F8] px-5 lg:px-10 py-10">
        <div className="flex flex-col lg:flex-row justify-center gap-10 lg:gap-20">
          {data?.sections?.map((section, index) => (
            <div className={`${section.type} text-start md:text-center lg:text-start`} key={index}>
              <h1 className="text-2xl font-medium mb-4">
                {section.content.title}
              </h1>
              <div className="text-gray-500 space-y-4 flex flex-col items-start md:items-center lg:items-start justify-center">
                {section.content.items?.map((item, index) => (
                  <p
                    className="flex space-x-2"
                    key={index}
                  >
                    {item.href ? (
                      <a href={item.href} className="hover:underline">
                        {item.value}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </p>
                ))}
                {section.type === "newsletterSignup" && (
                  <>
                    <p className="flex space-x-2">
                      <span>{section.content.description}</span>
                    </p>
                    <form className="flex w-[90%] sm:w-[60%] lg:w-full">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="flex-grow p-3 border border-gray-300 focus:outline-none w-[65%] md:w-3/4 lg:w-[65%]"
                      />
                      <button
                        type="submit"
                        className="p-3 bg-black text-white hover:bg-gray-700 transition-colors duration-300 w-[35%] md:w-1/4 lg:w-[45%]"
                      >
                        Subscribe
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center text-white text-sm bg-black p-1">
        <p>&copy; {new Date().getFullYear()} Wajeeha Hashmi Couture. All Rights Reserved.</p>
        <div className="flex justify-center items-center text-sm text-gray-400 gap-3 mt-1">
          <Link href="/privacy-policy">
            <p className="hover:underline">Privacy Policy</p>
          </Link>{' '}
          |{' '}
          <Link href="/return-exchange">
            <p className="hover:underline">Refund Policy</p>
          </Link>
        </div>
      </div>
    </>
  );
}
