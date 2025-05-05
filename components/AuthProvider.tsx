"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
//import { authApi } from "@/lib/auth"

// Create context
const AuthContext = createContext<{
  user: any | null
  loading: boolean
  refreshUser: () => Promise<void>
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<boolean>
}>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  login: async () => ({}),
  logout: async () => false,
})

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Function to refresh user data from localStorage
  const refreshUser = async () => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token")
        if (token) {
          try {
            // This will try to get user data from API
            //const userData = await authApi.getUser()
            //setUser(userData)
          } catch (error) {
            console.error("Failed to refresh user data:", error)
            // If API call fails, this will try to use stored user data
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
              setUser(JSON.parse(storedUser))
            } else {
              setUser(null)
            }
          }
        } else {
          setUser(null)
        }
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error)
    }
  }

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("auth_token")
          const storedUser = localStorage.getItem("user")

          if (token && storedUser) {
            setUser(JSON.parse(storedUser))
          } else {
            setUser(null)

            // Comment out the redirect logic for now
            // if (pathname !== "/login" && !pathname.startsWith("/public")) {
            //   router.push("/login");
            // }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password)

      // Store token and user data
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))

      // Update state
      setUser(response.user)
      return response
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Try to call logout API if user is logged in
      if (user) {
        try {
          await authApi.logout()
        } catch (error) {
          console.error("Logout API call failed:", error)
        }
      }

      // This will clear local storage regardless of API response
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      setUser(null)

      return true
    } catch (error) {
      console.error("Logout failed:", error)
      return false
    }
  }

  return <AuthContext.Provider value={{ user, loading, refreshUser, login, logout }}>{children}</AuthContext.Provider>
}
