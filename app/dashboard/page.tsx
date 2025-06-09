"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Package, Truck, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { getToken } from "@/lib/auth"
import { useAuth } from "@/components/AuthProvider"

interface UserShipment {
  shipment_id: number
  carrier_name: string
  transport_name: string
  price: number
  created_at: string
  status: string
  details: Array<{
    details_id: number
    weight: number
    length: number
    width: number
    height: number
  }>
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [recentShipments, setRecentShipments] = useState<UserShipment[]>([])
  const [shipmentsLoading, setShipmentsLoading] = useState(true)

  // Fetch user's recent shipments
  useEffect(() => {
    if (!user?.id) return

    const fetchUserShipments = async () => {
      try {
        setShipmentsLoading(true)
        const token = getToken()
        if (!token) return

        const response = await fetch(`https://hungryblogs.com/api/GetShipments?user_id=${user.id}`, {
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
            // Sort by created_at descending and take first 4 for recent, all for stats
            const sortedShipments = data.details.sort(
              (a: UserShipment, b: UserShipment) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
            setRecentShipments(sortedShipments.slice(0, 4))
          }
        }
      } catch (err) {
        console.error("Error fetching user shipments:", err)
      } finally {
        setShipmentsLoading(false)
      }
    }

    fetchUserShipments()
  }, [user])

  // Calculate total weight for a shipment
  const calculateTotalWeight = (details: Array<{ weight: number }>) => {
    return details.reduce((total, item) => total + (item.weight || 0), 0)
  }

  // Calculate quick stats from recent shipments
  const quickStats = {
    totalShipments: recentShipments.length,
    totalValue: recentShipments.reduce((sum, shipment) => sum + (shipment.price || 0), 0),
    totalWeight: recentShipments.reduce((sum, shipment) => sum + calculateTotalWeight(shipment.details), 0),
    lastShipmentDate: recentShipments.length > 0 ? recentShipments[0].created_at : null,
  }

  const filteredShipments = searchQuery
    ? recentShipments.filter(
        (shipment) =>
          String(shipment.shipment_id).includes(searchQuery.toLowerCase()) ||
          shipment.carrier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.transport_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : recentShipments

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-gray-600 mt-1">Manage your shipments and track your logistics</p>
        </div>
        <Link
          href="/dashboard/new-shipment"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>New Shipment</span>
        </Link>
      </div>

      {/* Quick Summary Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
          <Package className="mr-2 text-blue-600" size={20} />
          Quick Summary
        </h2>
        {shipmentsLoading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
                <Package className="text-blue-600" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{quickStats.totalShipments}</p>
              <p className="text-sm text-gray-600">Recent Shipments</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
                <DollarSign className="text-green-600" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-800">${quickStats.totalValue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
                <Truck className="text-purple-600" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{quickStats.totalWeight}kg</p>
              <p className="text-sm text-gray-600">Total Weight</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mx-auto mb-2">
                <Calendar className="text-orange-600" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {quickStats.lastShipmentDate ? new Date(quickStats.lastShipmentDate).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-sm text-gray-600">Last Shipment</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent activity section */}
      <div className="bg-white rounded-lg shadow border">
        <div className="font-semibold p-4 border-b flex justify-between items-center">
          <h2 className="text-black text-lg">My Recent Shipments</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {shipmentsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transport
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment.shipment_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">#{shipment.shipment_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{shipment.carrier_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{shipment.transport_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{calculateTotalWeight(shipment.details)}kg</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${shipment.price}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(shipment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link
                          href={`/dashboard/shipments/${shipment.shipment_id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      {searchQuery ? "No shipments found matching your search." : "No recent shipments found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 border-t">
          <Link href="/dashboard/shipments" className="text-blue-600 hover:text-blue-800 font-medium">
            View All Shipments
          </Link>
        </div>
      </div>
    </div>
  )
}
