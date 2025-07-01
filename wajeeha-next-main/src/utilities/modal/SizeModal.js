"use client";

import React, { useState, useEffect, useRef } from "react";

// Size chart data
const shirtSizesInch = {
  headers: ["Size", "Chest", "Waist", "Hips", "Shoulder", "Sleeve Length"],
  rows: [
    ["XS", 34, 28, 36, 14, 23],
    ["S", 36, 30, 38, 15, 23.5],
    ["M", 38, 32, 40, 16, 24],
    ["L", 40, 34, 42, 17, 24.5],
    ["XL", 42, 36, 44, 18, 25],
    ["XXL", 44, 38, 46, 19, 25.5],
  ],
};

const pantsSizesInch = {
  headers: ["Size", "Waist", "Hips", "Inseam", "Outseam"],
  rows: [
    ["XS", 28, 36, 30, 40],
    ["S", 30, 38, 30.5, 40.5],
    ["M", 32, 40, 31, 41],
    ["L", 34, 42, 31.5, 41.5],
    ["XL", 36, 44, 32, 42],
    ["XXL", 38, 46, 32.5, 42.5],
  ],
};

export default function SizeModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState("in"); // "in" or "cm"
  const modalRef = useRef(null);

  // Convert inches to cm or vice versa
  const convertValue = (value) => {
    if (typeof value !== "number") return value;
    return unit === "in" ? value : Math.round(value * 2.54 * 10) / 10;
  };

  // Get headers with unit
  const getHeaders = (headers) => {
    return headers.map((header, index) => {
      if (index === 0) return header;
      return `${header} (${unit === "in" ? "in" : "cm"})`;
    });
  };

  // Handle unit change
  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div 
        ref={modalRef} 
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">Size Guide</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-300 hover:rotate-90 transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">-Wajeeha Hashmi Couture-</h2>
          
          {/* Units toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex border rounded-md overflow-hidden shadow-sm">
              <button 
                onClick={() => handleUnitChange("cm")}
                className={`px-4 py-2 ${unit === "cm" ? 
                  "bg-pink-600 text-white" : 
                  "bg-white text-gray-700 hover:bg-gray-50"} transition-colors duration-300`}
              >
                Cm
              </button>
              <button 
                onClick={() => handleUnitChange("in")}
                className={`px-4 py-2 ${unit === "in" ? 
                  "bg-pink-600 text-white" : 
                  "bg-white text-gray-700 hover:bg-gray-50"} transition-colors duration-300`}
              >
                In
              </button>
            </div>
          </div>
          
          {/* Shirt sizes table */}
          <h3 className="font-bold mb-2 text-lg">Shirt Measurements</h3>
          <div className="overflow-x-auto mb-6 rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {getHeaders(shirtSizesInch.headers).map((header, index) => (
                    <th 
                      key={index}
                      className="px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider text-center"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shirtSizesInch.rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className={`${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-pink-50 transition-colors duration-200`}
                  >
                    {row.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        className="px-4 py-3 whitespace-nowrap text-center text-sm"
                      >
                        {cellIndex === 0 ? cell : convertValue(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pants sizes table */}
          <h3 className="font-bold mb-2 text-lg">Pants Measurements</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {getHeaders(pantsSizesInch.headers).map((header, index) => (
                    <th 
                      key={index}
                      className="px-4 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider text-center"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pantsSizesInch.rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className={`${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-pink-50 transition-colors duration-200`}
                  >
                    {row.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        className="px-4 py-3 whitespace-nowrap text-center text-sm"
                      >
                        {cellIndex === 0 ? cell : convertValue(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="mb-2">
              <strong>Note:</strong> These measurements are approximate and may vary slightly due to the nature of handcrafted garments.
            </p>
            <p>
              For custom sizing or any questions, please contact our customer service.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
        <button
            onClick={onClose} 
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
        >
            Close
        </button>
        </div>
      </div>
    </div>
  );
}
