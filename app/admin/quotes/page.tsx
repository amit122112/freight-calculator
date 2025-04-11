"use client"

import { Package, Users, ClipboardList } from "lucide-react"

export default function AdminDashboard() {
  // In a real application, you would fetch this data from your API
  const dashboardStats = {
    activeShipments: 0,
    users: 0,
    quoteRequests: 0,
  }

  return (
    <div className="bg-white">
      <h1 className="text-2xl text-black font-bold mb-4">Quotes Request</h1>
      <p className="mb-6 text-black"></p>

      <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REQUEST-ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">REQ-65474</td>
                  <td className="px-4 py-3 text-sm text-gray-900">amit@gmail.com</td>
                
                  <td className="px-4 py-3 text-sm">
                  <button type="submit" className="px-3 py-2 mt-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300">
                    View Quote
                  </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">REQ-65434</td>
                  <td className="px-4 py-3 text-sm text-gray-900">tahsin@gmail.com</td>
                
                  <td className="px-4 py-3 text-sm">
                  <button type="submit" className="px-3 py-2 mt-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300">
                    View Quote
                  </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">REQ-22474</td>
                  <td className="px-4 py-3 text-sm text-gray-900">santu@gmail.com</td>
                
                  <td className="px-4 py-3 text-sm">
                  <button type="submit" className="px-3 py-2 mt-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md font-semibold shadow-lg transition-all duration-300">
                    View Quote
                  </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

      
    </div>
  )
}

