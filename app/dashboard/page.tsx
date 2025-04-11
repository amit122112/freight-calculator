"use client"


import { useState } from "react"
import { Package, Clock, Check, Plus, Search } from "lucide-react"
import Link from "next/link"

export default function UserDashboard() {

  const[searchQuery, setSearchQuery] = useState("")
  // fetch this data from  API later
  const userStats = {
    activeShipments: 0,
    pendingShipments: 0,
    completedShipments: 0,
  }

  const recentShipments = [
    { id: "SH-2001", origin: "Melbourne", destination: "Sydney", status: "In Transit", date: "2023-04-10" },
    { id: "SH-1986", origin: "Brisbane", destination: "Perth", status: "Delivered", date: "2023-04-05" },
    { id: "SH-1972", origin: "Sydney", destination: "Adelaide", status: "Processing", date: "2023-04-01" },
    { id: "SH-1965", origin: "Perth", destination: "Darwin", status: "Pending", date: "2023-03-28" },
  ]

  const filteredShipments = searchQuery
    ? recentShipments.filter(
        (shipment) =>
          shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.status.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : recentShipments

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "in transit":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">My Dashboard</h1>
        <Link
          href="/dashboard/new-shipment"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>New Shipment</span>
        </Link>
      </div>

      {/* Dashboard stats section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-black mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100 transform transition-all duration-500 hover:scale-107 ">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 ">
                <Package className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black ">Active Shipments</h3>
                <p className="text-2xl font-bold text-black">{userStats.activeShipments}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-100 transform transition-all duration-500 hover:scale-107 ">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Pending Shipments</h3>
                <p className="text-2xl font-bold text-gray-800">{userStats.pendingShipments}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-100 transform transition-all duration-500 hover:scale-107 ">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Check className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Completed Shipments</h3>
                <p className="text-2xl font-bold text-gray-800">{userStats.completedShipments}</p>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      {/* Recent activity section */}
      <div className="bg-white rounded-lg shadow border">
        <div className="font-semibold p-4 border-b flex justify-between items-center">
          <h2 className="text-black text-lg">My Shipments</h2>
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{shipment.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{shipment.origin}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{shipment.destination}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{shipment.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/dashboard/shipment/${shipment.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No shipments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t">
          <Link href="/dashboard/all-shipments" className="text-blue-600 hover:text-blue-800 font-medium">
            View All Shipments
          </Link>
        </div>
      

      </div>
    </div>
  )
}

