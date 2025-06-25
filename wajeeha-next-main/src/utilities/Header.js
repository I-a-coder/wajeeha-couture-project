"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Loader from "./Loader";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; // Import Slider from react-slick
import Link from "next/link";

export default function Header() {
  const [data, setData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navbarTop, setNavbarTop] = useState("top-6"); // Initial position for navbar
  const router = usePathname();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/headerApi");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const headerData = await res.json();
        setData(headerData);
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    }
    fetchData();
  }, []);

  // Scroll event to change navbar position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setNavbarTop("top-0"); // Change navbar position to top-0 on scroll
      } else {
        setNavbarTop("top-6"); // Change back to top-6 when at the top
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!data)
    return (
      <div>
        <Loader />
      </div>
    );

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <>
      {/* Notification Banner */}
      <div className="flex justify-center items-center text-center bg-[#2d2d2d] text-white text-xs p-1">
        <div className="slider-container w-full max-w-lg mx-auto">
          <Slider {...sliderSettings}>
            {data.notifications.map((notification, index) => (
              <div key={index} className="flex justify-center items-center">
                <p className="whitespace-nowrap">{notification.message}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav
        className={`bg-white border-gray-200 shadow-lg fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${navbarTop}`}
      >
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="flex justify-center mb-2">
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <Image
                src={data.logo}
                alt="wajeeha-hashmi-logo"
                className="w-full h-auto"
                width={400}
                height={400}
              />
            </a>
          </div>

          {/* Toggle Button for Small Screens */}
          <div className="flex justify-center md:hidden mb-2">
            <button
              id="menu-toggle"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg shadow-lg border hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-default"
              aria-expanded={isMenuOpen ? "true" : "false"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:flex md:flex-col md:justify-center md:items-center`}
            id="navbar-default"
          >
            <div className="w-full flex flex-col lg:flex-row items-center justify-between mt-2">
              <ul
                id="nav-items"
                className="font-medium flex flex-col md:flex-row md:space-x-2 lg:space-x-6 justify-center items-center lg:items-start w-full"
              >
                {data.navigation.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.link}
                      className={`block py-2 px-3 rounded transition-all text-start lg:text-center ${
                        router === item.link
                          ? "text-pink-600"
                          : "text-gray-700 hover:text-pink-600"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <ul className="icons flex items-center space-x-3 md:space-x-2 lg:space-x-6 ml-0 lg:ml-auto mt-5 lg:mt-0">
                <li>
                  <Link href="/login">
                    <FaRegCircleUser className="text-xl" />
                  </Link>
                </li>
                <li>
                  <Link href="/cart">
                    <RiShoppingCart2Line className="text-2xl" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32">
        {/* Adjust padding-top based on header height */}
        {/* Your main content goes here */}
      </div>
    </>
  );
}
