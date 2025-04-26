// app/login/page.tsx
"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { EquityLogo } from "../../components/Logo";
// Regex expression for email validation. Gmail for now
//const emailRegex = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [token, setToken] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  //This will validate email format on blur
  const handleEmailBlur = () => {
    if (email && !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.")
    } else {
      setEmailError("")
    }
  }

  // Update email and clear error if the new value is valid
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError && emailRegex.test(e.target.value)) {
      setEmailError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setToken("");
    setLoading(true);
  
    // Validate email format before making request
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        const msg = data.message || data.error || 'Login failed';
        setError(msg);
        setLoading(false);
        return;
      }
  
      // Success - store token and optionally redirect
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      setLoading(false);
  
      // Optional: redirect to dashboard or homepage
      if (data.user && data.user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Network error or server not responding.");
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-between px-4 md:px-32 py-12 bg-gray-100">
      <div className="mb-12 md:mb-0 md:max-w-md">
        {/* Left Side logo and statement*/}
      <div className="flex justify-center md:justify-start mb-4">
          <EquityLogo width={250} height={60} />
        </div>
        <p
          className="text-2xl md:text-3xl font-normal text-gray-800 mt-4"
          style={{ textAlign: "justify", textJustify: "inter-word" }}
        >
          We provide customized logistics solutions at competitive rates for parcels to full containers.
        </p>
      </div>

      <div className="max-w-md w-full bg-white  shadow-3xl rounded-lg  p-10 shadow-md transform transition-all duration-500 hover:scale-107">
        <h1 className="text-3xl text-black text-center font-extrabold mb-10 bg-gradient-to-r from-red-700 to-purple-500 bg-clip-text text-transparent">Sign In</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5 text-black">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-black">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              required
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none transition-all duration-300 ${
                emailError && !loading ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-blue-500"
              }`}
            />
            {emailError &&  !loading && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-lg font-medium text-black">
                Password
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  alert("Did you forget and want to reset the password??")
                }}
                className="text-sm font-medium text-blue-800 hover:text-blue-1000 dark:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-black">
              Remember Me
            </label>
          </div>


          <button
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}


