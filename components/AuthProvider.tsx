"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getUser, isAuthenticated, fetchUserData } from "@/lib/auth"

// Create context
const AuthContext = createContext<{
  user: any | null
  loading: boolean
  refreshUser: () => Promise<void>
}>({
  user: null,
  loading: true,
  refreshUser: async () => {},
})

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Function to refresh user data from API
  const refreshUser = async () => {
    try {
      if (isAuthenticated()) {
        const userData = await fetchUserData()
        setUser(userData)
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error)
    }
  }

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      if (isAuthenticated()) {
        // First try to get user from localStorage
        const storedUser = getUser()
        if (storedUser) {
          setUser(storedUser)
        }

        try {
          // Then try to refresh from API
          await refreshUser()
        } catch (error) {
          // If API call fails and we're on a protected route, redirect to login
        //   if (pathname !== "/login") {
        //     router.push("/login")
        //   }
        }
      } else {
        setUser(null)

        // // Redirect to login if on a protected route
        // if (pathname !== "/login" && !pathname.startsWith("/public")) {
        //   router.push("/login")
        // }
      }
      setLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  return <AuthContext.Provider value={{ user, loading, refreshUser }}>{children}</AuthContext.Provider>
}