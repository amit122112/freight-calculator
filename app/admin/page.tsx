"use client"

import { Package, Users, ClipboardList } from "lucide-react"

export default function AdminDashboard() {
  // fetch this data from  API in later stages
  const dashboardStats = {
    activeShipments: 0,
    users: 0,
    quoteRequests: 0,
  }

  return (
    <div className="bg-white">
      <h1 className="text-2xl text-black font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6 text-black">Welcome, Admin! Manage users and shipments here.</p>

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
                <p className="text-2xl font-bold text-black">{dashboardStats.activeShipments}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-100 transform transition-all duration-500 hover:scale-107 ">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Users className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Users</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardStats.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-100 transform transition-all duration-500 hover:scale-107 ">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <ClipboardList className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Quote Requests</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardStats.quoteRequests}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity section */}
      <div>
        <h2 className="text-lg text-black font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b">
            <h3 className="font-medium text-black">Latest Shipments</h3>
          </div>
          <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SHIPMENT-ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Example 1</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Sydney</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Melbourne</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">In Transit</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Example 2</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Brisbane</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Perth</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Processing</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Example 3</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Adelaide</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Darwin</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

