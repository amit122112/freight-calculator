"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

export default function QuoteRequestShipments() {
  const [shipments, setShipments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          console.error("No auth token found.")
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setShipments(data.details || [])
      } catch (err) {
        console.error("Error fetching shipments:", err)
        setShipments([])
      }
    }

    fetchShipments()
  }, [])

  const filteredShipments = shipments.filter((s) => {
    const query = searchQuery.toLowerCase()
    return (
      String(s.shipment_id).includes(query) ||
      String(s.carrier_id).includes(query) ||
      s.details.some((d: any) => String(d.weight).includes(query))
    )
  })

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Quote Requests</h1>
          <p className="text-gray-800">List of all requested shipments</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={16} />
          <input
            type="text"
            placeholder="Search by Shipment ID, Carrier ID, or Weight"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-400 text-black rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-lg shadow border border-gray-400 text-black">
        <div className="overflow-x-auto text-black">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.N</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Shipment ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Carrier ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.length > 0 ? (
                filteredShipments.map((s, index) => (
                  <tr key={s.shipment_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-black font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-black">{s.shipment_id}</td>
                    <td className="px-4 py-3 text-sm text-black">{s.carrier_id}</td>
                    <td className="px-4 py-3 text-sm text-black">${s.price}</td>
                    <td className="px-4 py-3 text-sm text-black">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-black">
                      {s.details.map((d: any) => (
                        <div key={d.details_id}>
                          {d.weight}kg ({d.length}×{d.width}×{d.height})
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => (window.location.href = `/admin/quotes/${s.shipment_id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
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
            Showing <span className="font-medium">{filteredShipments.length}</span> of{" "}
            <span className="font-medium">{shipments.length}</span> shipments
          </div>
        </div>
      </div>
    </div>
  )
}
