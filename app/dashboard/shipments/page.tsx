"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"

export default function MyShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return

    const fetchUserShipments = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("auth_token")

        if (!token) {
          console.error("No auth token found.")
          setError("Authentication required. Please log in again.")
          setIsLoading(false)
          return
        }

        if (!user?.id) {
          setError("User information not available.")
          setIsLoading(false)
          return
        }

        console.log("Fetching shipments for user:", user.id)

        const response = await fetch(`https://www.hungryblogs.com/api/GetShipments?user_id=${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          setError("Your session has expired. Please log in again.")
          setIsLoading(false)
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched shipments data:", data)
        setShipments(data.details || [])
      } catch (err) {
        console.error("Error fetching user shipments:", err)
        setError("Failed to load your shipments. Please try again later.")
        setShipments([])
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if user is authenticated
    if (user) {
      fetchUserShipments()
    } else {
      setIsLoading(false)
      setError("Please log in to view your shipments")
    }
  }, [user])

  const filteredShipments = shipments.filter((s) => {
    const query = searchQuery.toLowerCase()
    return (
      String(s.shipment_id).includes(query) ||
      String(s.carrier_id).includes(query) ||
      s.status.toLowerCase().includes(query) ||
      s.details.some((d: any) => String(d.weight).includes(query))
    )
  })

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    }

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const calculateTotalWeight = (details: any[]) => {
    return details.reduce((total, item) => total + (item.weight || 0), 0)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">My Shipments</h1>
          <p className="text-gray-800">Track and manage your shipping requests</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/new-shipment")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          New Shipment
        </button>
      </div>

      {/* Error message */}
      {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {/* Search bar */}
      {!isLoading && !error && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={16} />
            <input
              type="text"
              placeholder="Search by Shipment ID, Status, Carrier ID, or Weight"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-400 text-black rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Shipments Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow border border-gray-400">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total Weight
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment, index) => (
                    <tr key={shipment.shipment_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-black font-medium">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-black font-medium">#{shipment.shipment_id}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(shipment.status)}</td>
                      <td className="px-4 py-3 text-sm text-black">${shipment.price}</td>
                      <td className="px-4 py-3 text-sm text-black">{calculateTotalWeight(shipment.details)}kg</td>
                      <td className="px-4 py-3 text-sm text-black">
                        <div className="space-y-1">
                          {shipment.details.slice(0, 2).map((item: any, idx: number) => (
                            <div key={item.details_id} className="text-xs text-gray-600">
                              {item.weight}kg • {item.length}×{item.width}×{item.height}m
                            </div>
                          ))}
                          {shipment.details.length > 2 && (
                            <div className="text-xs text-gray-500">+{shipment.details.length - 2} more items</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-black">
                        {new Date(shipment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => router.push(`/dashboard/shipments/${shipment.shipment_id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      {searchQuery
                        ? "No shipments found matching your search."
                        : "No shipments found. Create your first shipment to get started."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredShipments.length > 0 && (
            <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredShipments.length}</span> of{" "}
                <span className="font-medium">{shipments.length}</span> shipments
              </div>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-sm text-blue-600 hover:text-blue-800">
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
