"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function EditUserPage() {
  const { id } = useParams()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    company: "",
    phone: "",
    status: "active", // default for now
  })

  useEffect(() => {
    // Optional: load user details from state or mock data
    // In future: fetch(`/api/GetUser/${id}`)
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Saving user... (mock)")
    console.log("Updated user info:", form)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-black">Edit User (ID: {id})</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-black">First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border p-2 rounded text-black" />
        </div>
        <div>
          <label className="block mb-1 text-black">Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border p-2 rounded text-black" />
        </div>
        <div>
          <label className="block mb-1 text-black">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded text-black" />
        </div>
        <div>
          <label className="block mb-1 text-black">Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded text-black">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-black">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded text-black">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-black">Company</label>
          <input name="company" value={form.company} onChange={handleChange} className="w-full border p-2 rounded text-black" />
        </div>
        <div>
          <label className="block mb-1 text-black">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded text-black" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Changes</button>
      </form>
    </div>
  )
}
