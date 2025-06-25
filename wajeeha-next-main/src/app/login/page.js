// pages/order-management.js
import Layout from "@/utilities/Layout";
import React from "react";

const Login = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg border text-center max-w-lg w-full mx-auto">
          <h1 className="text-2xl font-semibold mb-4">
            We&apos;re Enhancing Your Shopping Experience!
          </h1>
          <p className="text-gray-700 mb-6">
            Our team is currently upgrading our order management system to serve
            you better. In the meantime, you can still place your orders through
            the following channels:
          </p>
          <p className="text-gray-700 mb-6">
            Feel free to reach out via Instagram, email, or give us a quick
            call. We&apos;re here to make sure you can still get the products
            you love!
          </p>
          <div className="flex flex-col gap-4 mb-4">
            <a href="https://www.instagram.com/yourbrand" className="">
              Instagram:{" "}
              <span className="text-blue-500 hover:underline">
                instagram.com/wajeehahashmi_couture
              </span>
            </a>
            <a href="mailto:orders@yourbrand.com" className="">
              Email:{" "}
              <span className="text-blue-500 hover:underline">
                wajeehahashmi1995@gmail.com
              </span>
            </a>
            <p className="text-gray-700">
              Phone:{" "}
              <span className="font-semibold hover:underline cursor-pointer">
                +92 302 0010434
              </span>
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            Thank you for your understanding and support. We&apos;re excited to
            bring you an improved experience very soon!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
