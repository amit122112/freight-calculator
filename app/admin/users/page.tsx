"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Pencil, Trash2, UserPlus } from "lucide-react"
import type { User } from "../../types/user"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // This is Mock user data - API to be integrated in 2nd sprint
  const users: User[] = [
    {
      id: "1",
      firstName: "Amit",
      lastName: "B",
      email: "amit.b@example.com",
      role: "admin",
      company: "Equity Logistics",
      phone: "+123123123",
      status: "active",
      dateCreated: "2023-01-15",
    },
    {
      id: "2",
      firstName: "Santu",
      lastName: "S",
      email: "santu.s@example.com",
      role: "user",
      company: "ABC Shipping",
      phone: "+321321321",
      status: "active",
      dateCreated: "2023-02-20",
    },
    {
      id: "3",
      firstName: "Tashin",
      lastName: "T",
      email: "tashin.t@example.com",
      role: "user",
      company: "XYZ Transport",
      phone: "+231123321",
      status: "inactive",
      dateCreated: "2023-03-10",
    },
  ]

  // Filter and search users
  const filteredUsers = users.filter((user) => {
    // Apply role filter
    if (filterRole !== "all" && user.role !== filterRole) return false

    // Apply status filter
    if (filterStatus !== "all" && user.status !== filterStatus) return false

    // Apply search query
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEditUser = (userId: string) => {
    console.log(`Edit user with ID: ${userId}`)
    // navigate to the edit page or open a modal later stages
  }

  const handleDeleteUser = (userId: string) => {
    console.log(`Delete user with ID: ${userId}`)
    // show a confirmation dialog before deleting in later stage
  }

  return (
    <div className="bg-white">
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
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
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
                          onClick={() => handleDeleteUser(user.id)}
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

        {/* Pagination - simplified for this example */}
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
    </div>
  )
}
