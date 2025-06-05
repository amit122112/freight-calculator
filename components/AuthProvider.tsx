"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  loginUser,
  isAuthenticated,
  getToken,
  removeToken,
  removeUser,
  getRememberMe,
  getTokenExpirationInfo,
} from "@/lib/auth"
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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<boolean>
  tokenInfo: any
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  login: async () => {},
  logout: async () => false,
  tokenInfo: null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update token info whenever user state changes
  useEffect(() => {
    if (user) {
      const info = getTokenExpirationInfo()
      setTokenInfo(info)
    } else {
      setTokenInfo(null)
    }
  }, [user])

  const logout = async (): Promise<boolean> => {
    try {
      const token = getToken()

      if (token) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        } catch (error) {
          console.warn("Logout API call failed, but continuing with local cleanup")
        }
      }

      removeToken()
      removeUser()
      setUserState(null)
      setTokenInfo(null)
      router.push("/login")
      return true
    } catch (error) {
      console.error("Logout failed:", error)
      return false
    }
  }

  const handleSessionTimeout = async () => {
    await logout()
  }

  // Get session timeout duration based on remember me
  const getSessionTimeout = () => {
    const rememberMe = getRememberMe()

    if (rememberMe) {
      // For remember me, use a very long timeout (effectively disable active session timeout)
      return 14 * 24 * 60 // 14 days in minutes
    } else {
      // For regular sessions, use 2 hours
      return 2 * 60 // 2 hours in minutes
    }
  }

  const { showWarning, timeLeft, dismissWarning } = useSessionTimeout({
    timeoutInMinutes: getSessionTimeout(),
    warningInSeconds: 30,
    onTimeout: handleSessionTimeout,
    isAuthenticated: !!user,
  })

  const refreshUser = async () => {
    try {
      if (typeof window === "undefined") return

      const token = getToken()
      if (!token) {
        setUserState(null)
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
        await logout()
        return
      }

      if (!response.ok) {
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

      if (!isAuthenticated()) {
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

    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  const login = async (email: string, password: string, rememberMe = false): Promise<void> => {
    try {
      const data = await loginUser(email, password, rememberMe)

      setUserState(data.user)

      const info = getTokenExpirationInfo()
      setTokenInfo(info)

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
    <AuthContext.Provider value={{ user, loading, refreshUser, login, logout, tokenInfo }}>
      {children}
      {showWarning && <SessionTimeoutWarning timeLeft={timeLeft} onContinue={dismissWarning} />}
    </AuthContext.Provider>
  )
}
