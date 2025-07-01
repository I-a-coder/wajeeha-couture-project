"use client";

import Layout from "@/utilities/Layout";
import React, { useState } from "react";
import { useAuth } from "@/utilities/AuthContext";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(email);
      setMessage("Check your email for password reset instructions");
    } catch (error) {
      setError("Failed to reset password. Please check if the email is correct.");
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg border max-w-md w-full mx-auto">
          <h1 className="text-2xl font-semibold mb-6 text-center">Reset Your Password</h1>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
          
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
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-pink-600 hover:text-pink-800">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword; 