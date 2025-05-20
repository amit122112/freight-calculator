"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { loginUser } from "@/lib/auth"

interface User {
  id: number
  email: string
  name?: string
  user_role?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
  login: (_email: string, _password: string) => Promise<void>
  logout: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  login: async () => {},
  logout: async () => false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const refreshUser = async () => {
    try {
      if (typeof window === "undefined") return

      const token = localStorage.getItem("auth_token") || process.env.NEXT_PUBLIC_API_TOKEN
      console.log("Token:", token);

      if (!token) {
        setUserState(null)
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL
      const storedUserId = localStorage.getItem("user_id")
      const userId = storedUserId ? JSON.parse(storedUserId) : null
      console.log("User ID:", userId);

      if (!userId || !API_URL) {
        setUserState(null)
        return
      }

      const response = await fetch(`${API_URL}/GetUser/?id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
  const errorText = await response.text();
  console.error("User fetch failed:", response.status, errorText);
  throw new Error("Failed to fetch user data");
}




      const data = await response.json()
      setUserState(data.details?.[0] || null)
    } catch (error) {
      console.error("Failed to refresh user data:", error)
      setUserState(null)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshUser()
      } catch (error) {
        console.error("Auth check error:", error)
        setUserState(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || "Login failed")
      }

      const data = await loginUser(email, password)

      localStorage.setItem("auth_token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("user_id", JSON.stringify(data.user?.id))

      setUserState(data.user)

      if (data.user?.user_role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async (): Promise<boolean> => {
    try {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_id")
      localStorage.removeItem("user")
      setUserState(null)
      return true
    } catch (error) {
      console.error("Logout failed:", error)
      return false
    }
  }

  if (!mounted) return null // prevent hydration mismatch

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
