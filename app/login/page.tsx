"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Create the request body
    const loginData = { email, password };

    try {
      // Make the API request to your backend
      const response = await fetch("https://hungryblogs.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Allow all origins (only if needed on the client-side)
          "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow POST and OPTIONS methods
          "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
        },
        body: JSON.stringify(loginData),
      });

      // Check if the response is successful
      if (!response.ok) {
        // If login fails, display the error
        const errorData = await response.json();
        setError(errorData.message || "An error occurred during login.");
        setLoading(false);
        return;
      }

      // If login is successful, redirect to the dashboard or home page
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      setError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl text-black text-center font-bold">Login</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full text-black border border-gray-300 rounded p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full text-black border border-gray-300 rounded p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
