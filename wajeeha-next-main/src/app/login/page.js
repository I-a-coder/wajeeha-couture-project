"use client";

import Layout from "@/utilities/Layout";
import React, { useState } from "react";
import { useAuth } from "@/utilities/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      // Redirect admins to /admin, others to home
      const adminEmails = [
        "admin@wajeehacouture.com",
        "wajeehahashmi1995@gmail.com",
        "hamnashafeeq10@gmail.com"
      ];
      if (adminEmails.includes(email.toLowerCase())) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg border max-w-md w-full mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-center">Login to Your Account</h1>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-pink-600 hover:text-pink-800">
                Forgot Password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-pink-600 hover:text-pink-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
