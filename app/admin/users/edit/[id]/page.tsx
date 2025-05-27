"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import UserForm from "@/components/UserForm"
import type { UserFormData } from "@/app/types/user"
import {getToken} from "@/lib/auth"

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const token = getToken()

  const [user, setUser] = useState<Partial<UserFormData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use local API route instead of external API since the external API is not working
        const response = await fetch(`https://hungryblogs.com/api/GetUser/?id=${userId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "Authorization": `Bearer ${token}`
                }
              })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `API error: ${response.status}`)
        }

        const userData = await response.json()
        const userDetails = userData.details?.[0] || {}

        // Transform API data to form data format
        setUser({
          firstName: userDetails.first_name || "",
          lastName: userDetails.last_name || "",
          email: userDetails.email || "",
          role: userDetails.user_role || "user",
          company: userDetails.company || "",
          phone: userDetails.phone || "",
          address: userDetails.street || "",
          city: userDetails.city || "",
          state: userDetails.state || "",
          zipCode: userDetails.zip_code || "",
          country: "Australia",
          commission: userDetails.commission || 0,
        })
      } catch (err) {
        console.error("Error fetching user:", err)
        setError(`Failed to load user data: ${err instanceof Error ? err.message : "Unknown error"}`)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Link href="/admin/users" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Users
        </Link>

        <div className="p-4 bg-red-50 border border-red-300 rounded-md flex items-center text-red-700 mb-4">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
            <p className="mt-2 text-sm">Using local API implementation instead of external API.</p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.push("/admin/users")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Return to Users List
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Link href="/admin/users" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Users
        </Link>

        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md flex items-center text-yellow-700">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>No user data available. The user may not exist or could not be loaded.</span>
        </div>

        <div className="mt-4">
          <button onClick={() => router.push("/admin/users")} className="px-4 py-2 bg-blue-600 text-white rounded">
            Return to Users List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <Link href="/admin/users" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Users
      </Link>

      <h1 className="text-2xl font-bold text-black mb-2">Edit User</h1>
      <p className="text-gray-700 mb-6">Update user information and commission rate.</p>

      {user && <UserForm initialData={user} isEditing={true} userId={userId} />}
    </div>
  )
}
