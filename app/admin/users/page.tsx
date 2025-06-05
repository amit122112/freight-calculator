"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Pencil, Trash2, UserPlus, Eye, EyeOff } from "lucide-react"
import type { User } from "../../types/user"
import { getToken } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const token = getToken()
  const router = useRouter()

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [deleteStep, setDeleteStep] = useState<"confirm" | "verify">("confirm")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminPasswordError, setAdminPasswordError] = useState("")
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken()
        if (!token) {
          setErrorMessage("Authentication token missing. Please login.")
          return
        }

        const response = await fetch("https://www.hungryblogs.com/api/GetUsers", {
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

        if (data && data.details && Array.isArray(data.details)) {
          const formatted = data.details.map((u: any) => ({
            id: u.id,
            firstName: u.first_name || "",
            lastName: u.last_name || "",
            email: u.email || "",
            role: u.user_role || "user",
            company: u.company || "",
            phone: u.phone_number || "",
            status: u.user_status || "active",
            dateCreated: u.created_at ? new Date(u.created_at).toLocaleDateString() : "-",
          }))
          setUsers(formatted)
          setSuccessMessage(`Loaded ${formatted.length} users successfully`)
        } else {
          console.warn("Unexpected API response structure:", data)
          setUsers([])
          setErrorMessage("No users found")
        }
      } catch (err) {
        console.error("Error fetching users:", err)
        setUsers([])
        setErrorMessage("Failed to load users. Please try again.")
      }
    }

    fetchUsers()
  }, [token])

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
        setErrorMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, errorMessage])

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    if (filterRole !== "all" && user.role !== filterRole) return false
    if (filterStatus !== "all" && user.status !== filterStatus) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.company?.toLowerCase().includes(query)
      )
    }

    return true
  })

  const getStatusBadgeClass = (user_status: string) => {
    switch (user_status) {
      case "active":
        return "bg-green-200 text-white-800"
      case "blocked":
        return "bg-red-200 text-red-800"
      case "pending":
        return "bg-yellow-200 text-yellow-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/edit/${userId}`)
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
    setDeleteStep("confirm")
    setAdminPassword("")
    setAdminPasswordError("")
  }

  const verifyAdminPassword = async (password: string): Promise<boolean> => {
    try {
      console.log("Verifying admin password for delete operation...")

      // For testing purposes, require a specific test password
      // Replace this with actual API call when ready
      const testPassword = "admin123" // You can change this to any password you want for testing

      if (password === testPassword) {
        console.log("Admin password verified successfully")
        return true
      } else {
        console.log("Admin password verification failed")
        return false
      }

      /*
      // Uncomment this when you have the API endpoint ready
      const response = await fetch(`https://hungryblogs.com/api/VerifyAdminPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.valid || response.status === 200
      }

      return false
      */
    } catch (error) {
      console.error("Error verifying admin password:", error)
      return false
    }
  }

  const handleDeleteConfirmation = async () => {
    if (deleteStep === "confirm") {
      setDeleteStep("verify")
      return
    }

    if (deleteStep === "verify") {
      if (!adminPassword) {
        setAdminPasswordError("Admin password is required")
        return
      }

      setAdminPasswordError("")
      setIsDeleting(true)

      // Verify admin password
      const isValidPassword = await verifyAdminPassword(adminPassword)

      if (!isValidPassword) {
        setAdminPasswordError("Invalid admin password. Please try again.")
        setIsDeleting(false)
        return
      }

      // Proceed with deletion
      try {
        const response = await fetch("https://www.hungryblogs.com/api/DeleteUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: userToDelete?.id }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Remove user from list in UI
        setUsers((prev) => prev.filter((user) => user.id !== userToDelete?.id))

        // Close modal and reset state
        setShowDeleteModal(false)
        setUserToDelete(null)
        setDeleteStep("confirm")
        setAdminPassword("")
        setAdminPasswordError("")

        setSuccessMessage(`User ${userToDelete?.firstName} ${userToDelete?.lastName} deleted successfully`)
      } catch (err) {
        console.error("Delete error:", err)
        setErrorMessage("Could not delete user. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
    setDeleteStep("confirm")
    setAdminPassword("")
    setAdminPasswordError("")
    setShowAdminPassword(false)
  }

  return (
    <div className="bg-white">
      {/* Success and Error Messages
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded">
          <p>{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded">
          <p>{errorMessage}</p>
        </div>
      )} */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">User Management</h1>
          <p className="text-gray-800">Manage user accounts and permissions</p>
        </div>
        <Link
          href="/admin/users/add"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={16} />
          <span>Add User</span>
        </Link>
      </div>

      {/* Test Password Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Test</h3>
            <div className="mt-1 text-sm text-blue-700">
              <p>
                For testing purposes, use password: <span className="font-mono bg-blue-100 px-1 rounded">admin123</span>{" "}
                to delete users.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-400 text-black rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-400 text-black rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-400 text-black rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow border border-gray-400 text-black">
        <div className="overflow-x-auto text-black">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-black">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-black">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-black capitalize">{user.role}</td>
                    <td className="px-4 py-3 text-sm text-black">{user.company || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(user.status)} capitalize`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-black">{user.dateCreated}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="p-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          title="Edit User"
                        >
                          <Pencil size={16} />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t flex justify-between items-center text-black">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
            <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded text-sm disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border rounded text-sm bg-blue-50 border-blue-200">1</button>
            <button className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden pointer-events-auto border-2 border-gray-300">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {deleteStep === "confirm" ? "Delete User Account" : "Admin Verification"}
              </h3>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              {deleteStep === "confirm" ? (
                <div>
                  <p className="text-gray-700 mb-4">
                    Do you want to permanently delete the account for{" "}
                    <span className="font-medium text-gray-900">
                      {userToDelete.firstName} {userToDelete.lastName}
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-red-600">This action cannot be undone.</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 mb-4">Please enter your administrator password to confirm deletion:</p>
                  <div className="mb-4">
                    <label htmlFor="deleteAdminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? "text" : "password"}
                        id="deleteAdminPassword"
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value)
                          setAdminPasswordError("")
                        }}
                        className={`w-full border rounded-md py-2 px-3 pr-10 text-black ${
                          adminPasswordError ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your admin password"
                        disabled={isDeleting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={isDeleting}
                      >
                        {showAdminPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {adminPasswordError && <p className="mt-1 text-sm text-red-500">{adminPasswordError}</p>}
                    <p className="mt-1 text-xs text-gray-500">For testing, use: admin123</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              {deleteStep === "confirm" ? (
                <button
                  onClick={handleDeleteConfirmation}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Yes, Delete
                </button>
              ) : (
                <button
                  onClick={handleDeleteConfirmation}
                  disabled={!adminPassword || isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md transition-colors flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
