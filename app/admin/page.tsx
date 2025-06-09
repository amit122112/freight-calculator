"use client"

import { useState, useEffect } from "react"
import { Package, Users, ClipboardList, TrendingUp, Activity, AlertCircle } from "lucide-react"
import { getToken } from "@/lib/auth"
import { useAuth } from "@/components/AuthProvider"

interface DashboardStats {
  total_users: number
  active_users: number
  inactive_users: number
  total_shipments: number
  active_shipments: number
  inactive_shipments: number
}

interface QuoteRequest {
  shipment_id: number
  user_name: string
  carrier_name: string
  transport_name: string
  price: number
  created_at: string
  details: Array<{
    details_id: number
    weight: number
    length: number
    width: number
    height: number
  }>
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    total_shipments: 0,
    active_shipments: 0,
    inactive_shipments: 0,
  })
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [quotesLoading, setQuotesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Skip data fetching if not mounted or no user
    if (!mounted || !user) {
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = getToken()
        if (!token) {
          console.log("Admin dashboard: No token available, skipping fetch")
          setLoading(false)
          return
        }

        // Check if user is admin
        if (user?.user_role !== "admin") {
          console.log("Admin dashboard: User is not admin, skipping fetch")
          setLoading(false)
          return
        }

        console.log("Admin dashboard: Fetching dashboard data")
        const response = await fetch("https://hungryblogs.com/api/Dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          // Don't throw for auth errors, just log them
          if (response.status === 401 || response.status === 403) {
            console.log(`Admin dashboard: Authentication error (${response.status})`)
            setLoading(false)
            return
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data && data.details) {
          setDashboardStats(data.details)
        } else {
          console.warn("Unexpected API response structure:", data)
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [mounted, user])

  // Fetch recent quote requests
  useEffect(() => {
    if (!mounted || !user || user?.user_role !== "admin") {
      return
    }

    const fetchRecentQuotes = async () => {
      try {
        setQuotesLoading(true)
        const token = getToken()
        if (!token) return

        const response = await fetch("https://hungryblogs.com/api/GetShipments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data && data.details) {
            // Sort by created_at descending and take first 3
            const sortedQuotes = data.details
              .sort(
                (a: QuoteRequest, b: QuoteRequest) =>
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
              )
              .slice(0, 3)
            setRecentQuotes(sortedQuotes)
          }
        }
      } catch (err) {
        console.error("Error fetching recent quotes:", err)
      } finally {
        setQuotesLoading(false)
      }
    }

    fetchRecentQuotes()
  }, [mounted, user])

  // Calculate total weight for a shipment
  const calculateTotalWeight = (details: Array<{ weight: number }>) => {
    return details.reduce((total, item) => total + (item.weight || 0), 0)
  }

  // If not mounted yet, return null to avoid hydration issues
  if (!mounted) {
    return null
  }

  // If no user or not admin, show appropriate message
  if (!user) {
    return null // Don't render anything if not logged in
  }

  if (user?.user_role !== "admin") {
    return (
      <div className="bg-white p-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center text-yellow-700">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>You don't have permission to access the admin dashboard.</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>Error loading dashboard: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <h1 className="text-2xl text-black font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6 text-black">Welcome, Admin! Here's your system overview.</p>

      {/* Dashboard stats section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-black mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Users */}
          <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100 transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Total Users</h3>
                <p className="text-2xl font-bold text-black">{dashboardStats.total_users}</p>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-100 transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Activity className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Active Users</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardStats.active_users}</p>
              </div>
            </div>
          </div>

          {/* Inactive Users */}
          <div className="bg-orange-50 p-4 rounded-lg shadow border border-orange-100 transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Users className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Inactive Users</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardStats.inactive_users}</p>
              </div>
            </div>
          </div>

          {/* Total Shipments */}
          <div className="bg-purple-50 p-4 rounded-lg shadow border border-purple-100 transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Package className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Total Shipments</h3>
                <p className="text-2xl font-bold text-black">{dashboardStats.total_shipments}</p>
              </div>
            </div>
          </div>

          {/* Active Shipments */}
          <div className="bg-teal-50 p-4 rounded-lg shadow border border-teal-100 transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg mr-3">
                <TrendingUp className="text-teal-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Active Shipments</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardStats.active_shipments}</p>
              </div>
            </div>
          </div>

          {/* Quote Requests (using inactive_shipments as pending/quote requests) */}
          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-100 transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <ClipboardList className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Pending Requests</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardStats.inactive_shipments}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity section */}
      <div>
        <h2 className="text-lg text-black font-semibold mb-4">Recent Quote Requests</h2>
        <div className="bg-white rounded-lg shadow border">
          
          <div className="p-4">
            {quotesLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recentQuotes.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipment ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentQuotes.map((quote) => (
                    <tr key={quote.shipment_id}>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">#{quote.shipment_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{quote.user_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{quote.carrier_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{calculateTotalWeight(quote.details)}kg</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${quote.price}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 py-8">No recent quote requests found.</div>
            )}
          </div>
          {recentQuotes.length > 0 && (
            <div className="p-4 border-t">
              <a href="/admin/quotes" className="text-blue-600 hover:text-blue-800 font-medium">
                View All Quote Requests
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
