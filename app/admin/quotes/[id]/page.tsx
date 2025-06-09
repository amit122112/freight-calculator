"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, User, Calendar, DollarSign, MapPin } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

interface ShipmentItem {
  details_id: number
  weight: number
  length: number
  width: number
  height: number
  shipment_id: number
  updated_at: string
  created_at: string
}

interface ShipmentDetail {
  shipment_id: number
  address_id: number
  shipment_address_id: number
  transport_id: number
  carrier_id: number
  price: number
  updated_at: string
  created_at: string
  user_id: number
  status: string
  carrier_name: string
  transport_name: string
  user_name: string
  details: ShipmentItem[]
}

export default function ShipmentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return

    const fetchShipmentDetails = async () => {
      try {
        const token = localStorage.getItem("auth_token")

        if (!token) {
          setError("Authentication required. Please log in again.")
          setLoading(false)
          return
        }

        const response = await fetch(`https://hungryblogs.com/api/GetShipment?shipment_id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          setError("Your session has expired. Please log in again.")
          setLoading(false)
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("API Response:", data)

        if (data.details && data.details.length > 0) {
          setShipment(data.details[0])
        } else {
          setError("Shipment not found")
        }
      } catch (err) {
        console.error("Error fetching shipment details:", err)
        setError("Failed to load shipment details")
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if user is authenticated
    if (user) {
      fetchShipmentDetails()
    } else {
      setLoading(false)
      setError("Please log in to view shipment details")
    }
  }, [id, user])

  // Calculate total weight and volume
  const totalWeight = shipment?.details.reduce((sum, item) => sum + item.weight, 0) || 0
  const totalVolume = shipment?.details.reduce((sum, item) => sum + item.length * item.width * item.height, 0) || 0

  
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    }

    const color = statusColors[status] || "bg-gray-100 text-gray-800"
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>{status}</span>
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <button onClick={() => router.back()} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={16} className="mr-1" /> Back to Quotes
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="p-6">
        <button onClick={() => router.back()} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={16} className="mr-1" /> Back to Quotes
        </button>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Shipment not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Quotes
      </button>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Shipment #{shipment.shipment_id}</h1>
            <p className="text-gray-600 mt-1">Quote Request Details</p>
          </div>
          <div className="flex items-center gap-3">{getStatusBadge(shipment.status)}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-black">Customer Information</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Customer Name</p>
                  <p className="text-black">{shipment.user_name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Package className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">User ID</p>
                  <p className="text-black">{shipment.user_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Information */}
          <div className="col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-black">Shipment Information</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <Truck className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Carrier</p>
                  <p className="text-black">{shipment.carrier_name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Transport Type</p>
                  <p className="text-black capitalize">{shipment.transport_name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Created</p>
                  <p className="text-black">{new Date(shipment.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start">
                <DollarSign className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Quoted Price</p>
                  <p className="text-black text-lg font-semibold">${shipment.price}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Details */}
          <div className="col-span-1 md:col-span-3 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-black">Items Summary</h2>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-xl font-bold text-black">{shipment.details.length}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Weight</p>
                <p className="text-xl font-bold text-black">{totalWeight} kg</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Volume</p>
                <p className="text-xl font-bold text-black">{totalVolume.toFixed(4)} m³</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Items Table */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-black">Item Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Item #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Weight (kg)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Length (m)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Width (m)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Height (m)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Volume (m³)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shipment.details.map((item, index) => {
                  const volume = item.length * item.width * item.height
                  return (
                    <tr key={item.details_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-black font-medium">#{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-black">{item.weight}</td>
                      <td className="px-4 py-3 text-sm text-black">{item.length}</td>
                      <td className="px-4 py-3 text-sm text-black">{item.width}</td>
                      <td className="px-4 py-3 text-sm text-black">{item.height}</td>
                      <td className="px-4 py-3 text-sm text-black">{volume.toFixed(4)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-semibold mb-2 text-black">Address Information</h3>
              <p className="text-sm text-gray-600">Address ID: {shipment.address_id}</p>
              <p className="text-sm text-gray-600">Shipment Address ID: {shipment.shipment_address_id}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2 text-black">System Information</h3>
              <p className="text-sm text-gray-600">Last Updated: {new Date(shipment.updated_at).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Transport ID: {shipment.transport_id}</p>
              <p className="text-sm text-gray-600">Carrier ID: {shipment.carrier_id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
