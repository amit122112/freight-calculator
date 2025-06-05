"use client"

import { useAuth } from "@/components/AuthProvider"
import { Clock, Shield, CheckCircle } from "lucide-react"

export function SessionInfo() {
  const { tokenInfo } = useAuth()

  if (!tokenInfo) return null

  const formatTimeLeft = (timeLeft: number) => {
    if (timeLeft <= 0) return "Expired"

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-green-100 rounded-md text-green-700">
          <Shield size={20} />
        </div>
        <h3 className="text-lg font-medium text-black">Session Information</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Status:
          </span>
          <span className="font-medium text-green-600">Active</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 flex items-center gap-2">
            <Clock size={16} />
            Time Remaining:
          </span>
          <span className="font-medium">{formatTimeLeft(tokenInfo.timeLeft)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Remember Me:</span>
          <span className={`font-medium ${tokenInfo.rememberMe ? "text-blue-600" : "text-gray-500"}`}>
            {tokenInfo.rememberMe ? "Enabled (14 days)" : "Disabled (2 hours)"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Expires:</span>
          <span className="font-medium text-gray-800">
            {tokenInfo.expirationDate.toLocaleDateString()} {tokenInfo.expirationDate.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  )
}
