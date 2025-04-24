"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Building, Phone, MapPin } from "lucide-react"

export default function AccountSettings() {
  const [formData, setFormData] = useState({
    firstName: "ABC",
    lastName: "XYZ",
    email: "xyzabc@example.com",
    company: "ABC Shipping Ltd.",
    phone: "+61 xxxxxxx",
    address: "123 St",
    city: "Melbourn",
    state: "VIC",
    zipCode: "3073",
    country: "Australia",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black">Account Information</h2>
          <p className="text-gray-600">Update your personal information</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-black hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`pl-10 w-full border rounded-md py-2 px-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`pl-10 w-full border rounded-md py-2 px-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 text-black">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={16} className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`pl-10 w-full border rounded-md py-2 px-3 ${
                isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
              }`}
            />
          </div>
        </div>

        <div className="grid text-black grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={!isEditing}
                className={`pl-10 w-full border rounded-md py-2 px-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={16} className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`pl-10 w-full border rounded-md py-2 px-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 text-black">
          <h3 className="text-lg font-medium text-black mb-3">Address Information</h3>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className={`pl-10 w-full border rounded-md py-2 px-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border rounded-md py-2 px-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border rounded-md py-2 px-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border rounded-md py-2 px-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border rounded-md py-2 px-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
