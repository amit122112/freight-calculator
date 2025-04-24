"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import UserForm from "../../../../components/UserForm"

export default function AddUserPage() {
  return (
    <div className="bg-white">
      <Link href="/admin/users" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft size={16} className="mr-1" />
        Back to Users
      </Link>

      <h1 className="text-2xl font-bold text-black mb-2">Add New User</h1>
      <p className="text-gray-600 mb-6">Create a new user account in the system.</p>

      <UserForm />
    </div>
  )
}
