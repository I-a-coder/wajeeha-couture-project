"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RiShoppingCart2Line } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Loader from "./Loader";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; // Import Slider from react-slick
import Link from "next/link";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

export default function Header() {
  const [data, setData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [navbarTop, setNavbarTop] = useState("top-6"); // Initial position for navbar
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const { getCartItemCount } = useCart();

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  // Handle logout
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Close the dropdown menu
      setShowUserDropdown(false);
      
      // Log the user out
      await logout();
      
      // Redirect to home page
      router.push('/');
      
      // Show success message (optional)
      alert("You have been successfully logged out.");
    } catch (error) {
      console.error("Failed to logout", error);
      alert("Failed to logout. Please try again.");
    }
  };

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

  // Get cart item count
  const cartItemCount = getCartItemCount();

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
                        pathname === item.link
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
                <li className="user-dropdown relative">
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center focus:outline-none hover:text-pink-600 transition-colors py-2 px-3"
                    aria-expanded={showUserDropdown}
                    aria-haspopup="true"
                  >
                    {currentUser && currentUser.photoURL ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={currentUser.photoURL}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <FaRegCircleUser className="text-xl" />
                    )}
                    {currentUser && (
                      <span className="ml-2 hidden md:inline text-sm font-medium">
                        {currentUser.displayName || currentUser.email.split('@')[0]}
                      </span>
                    )}
                  </button>
                  
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl py-1 z-50 border border-gray-200 animate-fadeIn">
                      {currentUser ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center">
                              {currentUser.photoURL ? (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                  <Image
                                    src={currentUser.photoURL}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-800">{currentUser.displayName || "User"}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">{currentUser.email}</p>
                              </div>
                            </div>
                          </div>
                          <Link href="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              My Profile
                            </div>
                          </Link>
                          <Link href="/orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 4v12m-8-8h12M8 16h8m-8-8a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              My Orders
                            </div>
                          </Link>
                          <hr className="my-1 border-gray-100" />
                          <a href="#" onClick={handleLogout} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </div>
                          </a>
                        </>
                      ) : (
                        <>
                          <Link href="/login" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                              </svg>
                              Login
                            </div>
                          </Link>
                          <Link href="/signup" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                              Sign Up
                            </div>
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </li>
                <li className="relative">
                  <Link href="/cart" className="flex items-center hover:text-pink-600 transition-colors py-2 px-3">
                    <RiShoppingCart2Line className="text-2xl" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
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
