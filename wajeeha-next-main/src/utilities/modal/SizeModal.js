import React from "react";
import Image from "next/image";

export default function SizeModal({ closeModal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg relative">
        <button
          onClick={closeModal}
          className="text-2xl font-bold absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          &times;
        </button>
        <Image
          src="https://static.wajeehacouture.com/assets/sizeguide.jpg" // Replace with your actual image URL
          alt="Size Chart"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
