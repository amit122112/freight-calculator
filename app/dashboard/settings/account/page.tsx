"use client"

import React, { useEffect, useState } from "react"
import { User, Mail, Phone, MapPin, Building, Save, Camera } from "lucide-react"
import { getToken, getUser } from "@/lib/auth"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Australia",
  })

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = getToken()
      const user = getUser()
      const userId = user?.id

      if (!token || !userId) {
        console.warn("User token or ID not found.")
        return
      }

      const response = await fetch(`https://hungryblogs.com/api/GetUser/?id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      console.log("Data:",data)

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile")
      }

      const details = data.details?.[0]
      if (details) {
        setProfileData({
          firstName: details.first_name || "",
          lastName: details.last_name || "",
          email: details.email || "",
          phone: details.phone_number || "",
          company: details.company || "",
          position: details.position || "",
          address: details.street || "",
          city: details.city || "",
          state: details.state || "",
          zipCode: details.zip_code || "",
          country: details.country || "",
        })
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
    }
  }

  fetchProfile()
}, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const token = getToken()
      const user = getUser()

      const payload = {
        id: user.id,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone_number: profileData.phone,
        company: profileData.company,
        position: profileData.position,
        street: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zipCode,
        country: profileData.country,
      }

      const response = await fetch("https://hungryblogs.com/api/UpdateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      setIsEditing(false)
    } catch (error) {
      console.error("Profile update error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Photo Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold mb-4">
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
                </div>
      
              </div>
              <h2 className="text-xl font-semibold text-black">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600">{profileData.email}</p>
              <p className="text-gray-600">{profileData.company}</p>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Personal Information</h2>

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
                      value={profileData.firstName}
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
                      value={profileData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full border rounded-md py-2 px-3 ${
                        isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6 mb-6">
                <div>
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
                      value={profileData.email}
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
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full border rounded-md py-2 px-3 ${
                        isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6 mb-6">
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
                      value={profileData.company}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`pl-10 w-full border rounded-md py-2 px-3 ${
                        isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                      }`}
                    />
                  </div>
                </div>

              </div>

              <h2 className="text-lg font-semibold text-black mb-4 mt-8">Address Information</h2>

              <div className="mb-6 text-black">
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
                    value={profileData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`pl-10 w-full border rounded-md py-2 px-3 ${
                      isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 text-black md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={profileData.city}
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
                    value={profileData.state}
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
                    value={profileData.zipCode}
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
                    value={profileData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full border rounded-md py-2 px-3 ${
                      isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"
                    }`}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
