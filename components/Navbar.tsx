"use client"

import { useState, useEffect } from "react"
import { EquityLogo } from "./Logo"
import { Bell, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { getToken, getUser } from "@/lib/auth"

interface Notification {
  notification_id: number
  read: string
  name: string
  notify: string
  link: string
  user_id: number
  created_at: string
  updated_at: string
  user_name?: string | null
}

export default function Navbar({ userRole = "user" }: { userRole?: string }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [loadingNotification, setLoadingNotification] = useState<number | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [userFirstName, setUserFirstName] = useState<string>("")

  const router = useRouter()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      router.push("/login")
    }
  }

  const handleProfileClick = () => {
    setShowDropdown(false)
    if (userRole === "admin") {
      router.push("/admin/profile")
    } else {
      router.push("/dashboard/profile")
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

  // Generate user-friendly notification message
  const getNotificationMessage = (notification: Notification) => {
    const userName = notification.user_name || `User ${notification.user_id}`

    if (notification.name === "Quote Request") {
      return `${userName} has requested a quote`
    } else if (notification.name === "Support Request") {
      return `${userName} has requested support`
    } else {
      // Fallback for other notification types
      return notification.notify
    }
  }

  // Handle navigation based on notification type
  const getNavigationPath = (notification: Notification) => {
    if (notification.name === "Quote Request") {
      // Parse the link to extract shipment_id for quotes
      const linkMatch = notification.link.match(/shipment_id=(\d+)/)
      if (linkMatch) {
        const shipmentId = linkMatch[1]
        return `/admin/quotes/${shipmentId}`
      }
      return "/admin/quotes"
    } else if (notification.name === "Support Request") {
      // For future support requests - you can modify this when support API is ready
      const linkMatch = notification.link.match(/support_id=(\d+)/)
      if (linkMatch) {
        const supportId = linkMatch[1]
        return `/admin/support/${supportId}`
      }
      return "/admin/support"
    } else {
      // Fallback navigation
      return "/admin"
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Start navigation loading
    setIsNavigating(true)

    // Mark as read only if it's unread
    if (notification.read === "unread" && loadingNotification !== notification.notification_id) {
      setLoadingNotification(notification.notification_id)

      try {
        const token = getToken()
        if (token) {
          const response = await fetch(
            `https://hungryblogs.com/api/GetNotification?notification_id=${notification.notification_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            },
          )

          if (response.ok) {
            // Update local state - mark this notification as read
            setNotifications((prev) =>
              prev.map((n) =>
                n.notification_id === notification.notification_id
                  ? { ...n, read: "read", updated_at: new Date().toISOString() }
                  : n,
              ),
            )

            // Update unread count
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }
        }
      } catch (error) {
        console.error("Error marking notification as read:", error)
      } finally {
        setLoadingNotification(null)
      }
    }

    // Close notifications and navigate
    setShowNotifications(false)
    const navigationPath = getNavigationPath(notification)

    // Add a small delay to show loading state
    setTimeout(() => {
      router.push(navigationPath)
      // Reset navigation loading after a delay to ensure page transition
      setTimeout(() => setIsNavigating(false), 1000)
    }, 300)
  }

  // Fetch user's first name from API
  const fetchUserFirstName = async () => {
    try {
      const token = getToken()
      const storedUserId = localStorage.getItem("user_id")
      const userId = storedUserId ? JSON.parse(storedUserId) : null

      console.log("Fetching user first name for userId:", userId)
      console.log("Current user object:", user)

      if (!token || !userId) {
        console.log("No token or userId available")
        return
      }

      const response = await fetch(`https://hungryblogs.com/api/GetUser/?id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error("Failed to fetch user data:", response.status)
        return
      }

      const data = await response.json()
      console.log("User API response:", data)

      const userDetails = data.details?.[0]
      if (userDetails) {
        console.log("User details:", userDetails)

        // Try different possible field names for first name
        const firstName =
          userDetails.first_name ||
          userDetails.firstName ||
          userDetails.name?.split(" ")[0] ||
          userDetails.full_name?.split(" ")[0] ||
          ""

        console.log("Extracted first name:", firstName)
        setUserFirstName(firstName)
      }
    } catch (error) {
      console.error("Error fetching user first name:", error)
    }
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

        // Handle the array format from your API
        const fetched: Notification[] = Array.isArray(raw.Notifications)
          ? raw.Notifications
          : Object.values(raw.Notifications || {})

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

  // Fetch user first name when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchUserFirstName()
    }
  }, [user])

  // Get display name for user
  const getDisplayName = () => {
    if (userFirstName) {
      return userFirstName.length > 15 ? userFirstName.substring(0, 15) + "..." : userFirstName
    }

    // Fallback to existing user object
    if (user?.name) {
      const firstName = user.name.split(" ")[0]
      return firstName.length > 15 ? firstName.substring(0, 15) + "..." : firstName
    }

    return userRole === "admin" ? "Admin" : "User"
  }

  // Get full name for dropdown
  const getFullName = () => {
    if (user?.name) return user.name
    if (userFirstName) return userFirstName
    return userRole === "admin" ? "Admin User" : "User"
  }

  return (
    <>
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-xl">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Loading shipment details...</p>
            <p className="text-gray-500 text-sm">Please wait while we fetch the information</p>
          </div>
        </div>
      )}

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
                      [...notifications].reverse().map((notification) => (
                        <div
                          key={notification.notification_id}
                          className={`px-4 py-3 border-b cursor-pointer transition-colors ${
                            notification.read === "unread"
                              ? "bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500"
                              : "hover:bg-gray-50"
                          } ${loadingNotification === notification.notification_id ? "opacity-50" : ""} ${
                            isNavigating ? "pointer-events-none opacity-50" : ""
                          }`}
                          onClick={() => !isNavigating && handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-800">
                                  {notification.name === "Quote Request"
                                    ? "Quote Request"
                                    : notification.name === "Support Request"
                                      ? "Support Request"
                                      : notification.name}
                                </p>
                                {notification.read === "unread" && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{getNotificationMessage(notification)}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">
                                  {new Date(notification.created_at).toLocaleDateString()} at{" "}
                                  {new Date(notification.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                {!isNavigating && (
                                  <span className="text-xs text-blue-600 font-medium">Click to view →</span>
                                )}
                              </div>
                            </div>
                            {loadingNotification === notification.notification_id && (
                              <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            )}
                          </div>
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
                <span className="text-gray-800 max-w-32 truncate" title={getFullName()}>
                  {getDisplayName()}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">{getFullName()}</div>
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
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
    </>
  )
}
