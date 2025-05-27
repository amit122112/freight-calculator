"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { loginUser } from "@/lib/auth"
import { useSessionTimeout } from "@/hooks/useSessionTimeout"
import { SessionTimeoutWarning } from "@/components/SessionTimeoutWarning"

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

  useEffect(() => {
    setMounted(true)
  }, [])

  const logout = async (): Promise<boolean> => {
    try {
      console.log("AuthProvider - Logout Called")

      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_id")
      localStorage.removeItem("user")
      setUserState(null)
      router.push("/login")
      return true
    } catch (error) {
      console.error("Logout failed:", error)
      return false
    }
  }

  const handleSessionTimeout = async () => {
    console.log("AuthProvider - Session timeout triggered")
    await logout()
  }

  const { showWarning, timeLeft, dismissWarning } = useSessionTimeout({
    timeoutInMinutes: 2,
    warningInSeconds: 30,
    onTimeout: handleSessionTimeout,
    isAuthenticated: !!user,
  })

  useEffect(() => {
    console.log("AuthProvider - User state changed:", user)
    console.log("AuthProvider - Is authenticated:", !!user)
  }, [user])

  useEffect(() => {
    console.log("AuthProvider - Session timeout state:", {
      showWarning,
      timeLeft,
      isAuthenticated: !!user,
    })
  }, [showWarning, timeLeft, user])

  const refreshUser = async () => {
    try {
      if (typeof window === "undefined") return

      const token = localStorage.getItem("auth_token")
      if (!token) {
        console.warn("No token found. Logging out.")
        await logout()
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL
      const storedUserId = localStorage.getItem("user_id")
      const userId = storedUserId ? JSON.parse(storedUserId) : null

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

      if (response.status === 401) {
        console.warn("Token expired or invalid. Logging out...")
        await logout()
        return
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error("User fetch failed:", response.status, errorText)
        throw new Error("Failed to fetch user data")
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
      if (typeof window === "undefined") return

      const token = localStorage.getItem("auth_token")
      if (!token) {
        console.warn("No auth token found on load, skipping refresh.")
        setLoading(false)
        return
      }

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

  if (!mounted) return null

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, login, logout }}>
      {children}
      {showWarning && <SessionTimeoutWarning timeLeft={timeLeft} onContinue={dismissWarning} />}
    </AuthContext.Provider>
  )
}
