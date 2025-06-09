"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"

export default function QuoteRequestShipments() {
  const [shipments, setShipments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    // Only run on client-side and when user is available
    if (typeof window === "undefined" || !user) {
      setIsLoading(false)
      return
    }

    const fetchShipments = async () => {
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

        const response = await fetch("https://www.hungryblogs.com/api/GetShipments", {
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
        // Sort by created_at in descending order (latest first)
        const sortedShipments = (data.details || []).sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        setShipments(sortedShipments)
      } catch (err) {
        console.error("Error fetching shipments:", err)
        setError("Failed to load shipments. Please try again later.")
        setShipments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchShipments()
  }, [user])

  const filteredShipments = shipments.filter((s) => {
    const query = searchQuery.toLowerCase()
    return (
      String(s.shipment_id).includes(query) ||
      String(s.carrier_name || s.carrier_id)
        .toLowerCase()
        .includes(query) ||
      String(s.user_name || "")
        .toLowerCase()
        .includes(query) ||
      String(s.transport_name || "")
        .toLowerCase()
        .includes(query) ||
      s.details.some((d: any) => String(d.weight).includes(query))
    )
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedShipments = filteredShipments.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Calculate total weight for a shipment
  const getTotalWeight = (details: any[]) => {
    return details.reduce((sum, item) => sum + item.weight, 0)
  }

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Quote Requests</h1>
          <p className="text-gray-800">List of all requested shipments</p>
        </div>
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
              placeholder="Search by Shipment ID, User Name, Carrier, Transport, or Weight"
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
        <div className="bg-white rounded-lg shadow border border-gray-400 text-black">
          <div className="overflow-x-auto text-black">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Transport
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total Weight
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedShipments.length > 0 ? (
                  paginatedShipments.map((s, index) => (
                    <tr key={s.shipment_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-black font-medium">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 text-sm text-black font-medium">#{s.shipment_id}</td>
                      <td className="px-4 py-3 text-sm text-black">{s.user_name || "Unknown User"}</td>
                      <td className="px-4 py-3 text-sm text-black">{s.carrier_name || `ID: ${s.carrier_id}`}</td>
                      <td className="px-4 py-3 text-sm text-black capitalize">
                        {s.transport_name || `ID: ${s.transport_id}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-black font-medium">{getTotalWeight(s.details)} kg</td>
                      <td className="px-4 py-3 text-sm text-black font-medium">${s.price}</td>
                      <td className="px-4 py-3 text-sm text-black">{new Date(s.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => router.push(`/admin/quotes/${s.shipment_id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                      No shipments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t flex justify-between items-center text-black">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{Math.min(endIndex, filteredShipments.length)}</span> of{" "}
              <span className="font-medium">{filteredShipments.length}</span> shipments
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page ? "bg-blue-50 border-blue-200 text-blue-600" : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
