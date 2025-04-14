"use client"

import { Package } from "lucide-react"

export default function AdminDashboard() {
  // In a real application, you would fetch this data from your API

  return (
    <div className="bg-white">
      <h1 className="text-2xl text-black font-bold mb-4">Rates</h1>
      <p className="mb-6 text-black"></p>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-100 transform transition-all duration-500 hover:scale-107 ">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 ">
                <Package className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black ">Carrier 1</h3>
                {/*<p className="text-2xl font-bold text-black">{dashboardStats.activeShipments}</p>*/}
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-100 transform transition-all duration-500 hover:scale-107 ">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Package className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-black">Carrier 2</h3>
                {/*<p className="text-2xl font-bold text-gray-800">{dashboardStats.users}</p>*/}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    
  )
}

