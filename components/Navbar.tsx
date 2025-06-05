"use client"

import { useState, useEffect } from "react"
import { EquityLogo } from "./Logo"
import { Bell, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { getToken, getUser } from "@/lib/auth"

interface Notification {
  read: string
  name: string
  created_at: string
  first_name?: string
  [key: string]: any
}

export default function Navbar({ userRole = "user" }: { userRole?: string }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      router.push("/login")
    }
  }

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications)
    setShowDropdown(false)
  }

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown)
    setShowNotifications(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".dropdown-area")) {
        setShowDropdown(false)
        setShowNotifications(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = getToken()
        const user = getUser()

        // Only fetch notifications if user is authenticated and is an admin
        if (!token || !user || userRole !== "admin") {
          return
        }

        const response = await fetch("https://hungryblogs.com/api/GetNotifications", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          // Don't log error for 401/403 as these are expected when not authenticated
          if (response.status === 401 || response.status === 403) {
            return
          }
          throw new Error(`Failed to fetch notifications: ${response.status}`)
        }

        const raw = await response.json()
        const fetched: Notification[] = raw.Notifications ? Object.values(raw.Notifications) : []

        const unread = fetched.filter((n) => n.read === "unread").length
        setNotifications(fetched)
        setUnreadCount(unread)
      } catch (error) {
        // Only log errors that aren't authentication related
        if (error instanceof Error && !error.message.includes("401") && !error.message.includes("403")) {
          console.error("Error fetching notifications:", error)
        }
        // Reset notification state on error
        setNotifications([])
        setUnreadCount(0)
      }
    }

    // Add a small delay to ensure auth state is properly initialized
    const timeoutId = setTimeout(fetchNotifications, 100)

    return () => clearTimeout(timeoutId)
  }, [userRole])

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center">
          <EquityLogo height={40} width={120} />
          <h1 className="ml-4 text-xl font-semibold text-gray-800">
            {userRole === "admin" ? "Admin Dashboard" : "User Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {userRole === "admin" && (
            <div className="relative dropdown-area">
              <button onClick={handleToggleNotifications} className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded-md border z-20">
                  <h4 className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Notifications</h4>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-3 text-gray-500 text-sm">No notifications</p>
                  ) : (
                    [...notifications].reverse().map((n, idx) => (
                      <div key={idx} className="px-4 py-2 border-b hover:bg-gray-50">
                        <p className="text-sm text-gray-800">
                          {n.user_name || "A user"}{" "}
                          {n.name === "Quote Request"
                            ? "has requested a quote"
                            : n.name === "Support Request"
                              ? "has a support request"
                              : "has a new notification"}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <div className="relative dropdown-area">
            <button
              onClick={handleToggleDropdown}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-gray-800">{userRole === "admin" ? "Admin" : "User"}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
                <div className="border-t my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
