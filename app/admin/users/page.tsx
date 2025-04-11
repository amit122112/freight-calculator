"use client"

import { Package, Users, ClipboardList, Pencil, Delete } from "lucide-react"

export default function AdminDashboard() {
  // In a real application, you would fetch this data from your API
  const dashboardStats = {
    activeShipments: 0,
    users: 0,
    quoteRequests: 0,
  }

  return (
    <div className="bg-white">
      <h1 className="text-2xl text-black font-bold mb-4">Users</h1>
      <p className="mb-6 text-black"></p>

      <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USER-ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Amit</td>
                  <td className="px-4 py-3 text-sm text-gray-900">amit@gmail.com</td>
                  <td className="px-4 py-3 text-sm text-gray-900">MEL</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                      <button
                        type="button"
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300"
                      >
                        <Delete size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Tahsin</td>
                  <td className="px-4 py-3 text-sm text-gray-900">tahsin@gmail.com</td>
                  <td className="px-4 py-3 text-sm text-gray-900">SYD</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactive</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                      <button
                        type="button"
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300"
                      >
                        <Delete size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Santosh</td>
                  <td className="px-4 py-3 text-sm text-gray-900">santu@gmail.com</td>
                  <td className="px-4 py-3 text-sm text-gray-900">PER</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                      <button
                        type="button"
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300"
                      >
                        <Delete size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

      
    </div>
  )
}

