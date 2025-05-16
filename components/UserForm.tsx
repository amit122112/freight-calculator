"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, AlertCircle, User, Mail, Building, Phone, MapPin, Percent } from "lucide-react"
import type { UserFormData } from "@/app/types/user"
import {API_TOKEN} from "@/lib/config"
// Country codes for phone numbers
const countryCodes: Record<string, string> = {
  Australia: "+61",
}

// Australian states and territories
const australianStates = [
  "Australian Capital Territory",
  "New South Wales",
  "Northern Territory",
  "Queensland",
  "South Australia",
  "Tasmania",
  "Victoria",
  "Western Australia",
]

// Default country code if country not found
const DEFAULT_COUNTRY_CODE = "+61"


interface UserFormProps {
  initialData?: Partial<UserFormData>
  isEditing?: boolean
  userId?: string
}

export default function UserForm({ initialData, isEditing = false, userId }: UserFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<UserFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    role: initialData?.role || "user",
    company: initialData?.company || "",
    phone: initialData?.phone || "",
    password: initialData?.password || "",
    confirmPassword: initialData?.confirmPassword || "",
    // Address fields
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "Victoria", // Default Victoria
    zipCode: initialData?.zipCode || "",
    country: initialData?.country || "Australia", // Default to Australia
    // Commission field (only for editing)
    commission: initialData?.commission || 0,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [phoneWithoutCode, setPhoneWithoutCode] = useState("")

  // Update phone number when country changes
  useEffect(() => {
    if (formData.country && formData.phone) {
      if (initialData?.phone && phoneWithoutCode === "") {

        const countryCode = countryCodes[formData.country] || DEFAULT_COUNTRY_CODE
        if (initialData.phone.startsWith(countryCode)) {
          setPhoneWithoutCode(initialData.phone.substring(countryCode.length).trim())
        } else {
          setPhoneWithoutCode(initialData.phone)
        }
      } else {
        // Update the full phone number with country code
        const countryCode = countryCodes[formData.country] || DEFAULT_COUNTRY_CODE
        setFormData((prev) => ({
          ...prev,
          phone: `${countryCode} ${phoneWithoutCode}`.trim(),
        }))
      }
    }
  }, [formData.country, initialData?.phone, phoneWithoutCode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    // Special handling for phone number to maintain country code
    if (name === "phone") {
      setPhoneWithoutCode(value)
      const countryCode = countryCodes[formData.country] || DEFAULT_COUNTRY_CODE
      setFormData((prev) => ({
        ...prev,
        phone: `${countryCode} ${value}`.trim(),
      }))
    }
    // Special handling for commission to ensure it's a number
    else if (name === "commission") {
      const commissionValue = Number.parseFloat(value)
      setFormData((prev) => ({
        ...prev,
        commission: isNaN(commissionValue) ? 0 : commissionValue,
      }))
    }
    // Normal handling for other fields
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }))
    }

    // Clear error when field is edited
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }

    // Clear API error when form is modified
    if (apiError) {
      setApiError(null)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {}

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation for new users
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    // Australian postal code validation (4 digits)
    if (formData.zipCode && !/^\d{4}$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid 4-digit Australian postal code"
    }

    // Commission validation (only for editing)
    if (isEditing && formData.commission !== undefined) {
      if (formData.commission < 0) {
        newErrors.commission = "Commission cannot be negative"
      } else if (formData.commission > 100) {
        newErrors.commission = "Commission cannot exceed 100%"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setApiError(null)

    try {
      // Get API URL from environment variable
      const apiUrl = isEditing ? `https://hungryblogs.com/api/UpdateUser`: `https://hungryblogs.com/api/CreateNewUser`


      // Get token from localStorage or use environment variable
      const token = localStorage.getItem("auth_token") || process.env.NEXT_PUBLIC_API_TOKEN

      // Prepare the request payload
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        role: formData.role,
        company: formData.company,
        phone: formData.phone,
        street: formData.address || "",
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
        ...(isEditing ? { commission: formData.commission } : {}),
        ...(isEditing ? {} : { password: formData.password }),
      }


      // Make API request
      const response = await fetch(apiUrl, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: API_TOKEN, // or `Bearer ${token}` if token is used
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API error: ${response.status}`)
      }

      setSubmitSuccess(true)

      // Reset form or redirect after success
      setTimeout(() => {
        router.push("/admin/users")
      }, 1500)
    } catch (error) {
      console.error("Error saving user:", error)
      setApiError(
        error instanceof Error ? error.message : "An unexpected error occurred. Please try again or contact support.",
      )

      // For demo purposes, simulate success anyway if we're in development
      // if (process.env.NODE_ENV === "development") {
      //   console.log("Development mode: Simulating success despite error")
      //   setSubmitSuccess(true)
      //   setTimeout(() => {
      //     router.push("/admin/users")
      //   }, 1500)
      // }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-3xl border border-gray-300">
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-md flex items-center text-green-700">
          <Check size={20} className="mr-2 flex-shrink-0" />
          <span>User successfully {isEditing ? "updated" : "created"}! Redirecting...</span>
        </div>
      )}

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-md flex items-center text-red-700">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block font-semibold text-black mb-2">
            First Name <span className="text-red-500">*</span>
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
              className={`pl-10 border p-2 w-full rounded text-black ${
                errors.firstName ? "border-red-500" : "border-gray-400"
              }`}
              disabled={isSubmitting}
              required
            />
          </div>
          {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block font-semibold text-black mb-2">
            Last Name <span className="text-red-500">*</span>
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
              className={`pl-10 border p-2 w-full rounded text-black ${
                errors.lastName ? "border-red-500" : "border-gray-400"
              }`}
              disabled={isSubmitting}
              required
            />
          </div>
          {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label htmlFor="email" className="block font-semibold text-black mb-2">
          Email Address <span className="text-red-500">*</span>
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
            className={`pl-10 border p-2 w-full rounded text-black ${
              errors.email ? "border-red-500" : "border-gray-400"
            }`}
            disabled={isSubmitting}
            required
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Address Information Section*/}
      <div className="mb-6 border-t border-gray-300 pt-6">
        <h3 className="text-lg font-semibold text-black mb-4">Address Information</h3>

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
              className="pl-10 w-full border border-gray-400 rounded-md py-2 px-3 text-black"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City/Suburb
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-md py-2 px-3 text-black"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State/Territory
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-md py-2 px-3 text-black"
              disabled={isSubmitting}
            >
              {australianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={`w-full border rounded-md py-2 px-3 text-black ${
                errors.zipCode ? "border-red-500" : "border-gray-400"
              }`}
              maxLength={4}
              placeholder="0000"
              disabled={isSubmitting}
            />
            {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-400 rounded-md py-2 px-3 text-black"
              disabled={isSubmitting}
            >
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Company */}
        <div>
          <label htmlFor="company" className="block font-semibold text-black mb-2">
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
              className="pl-10 border border-gray-400 p-2 w-full rounded text-black"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block font-semibold text-black mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={16} className="text-gray-400" />
            </div>
            <div className="flex items-center">
              <div className="pl-10 pr-2 py-2 bg-gray-100 border border-r-0 border-gray-400 rounded-l-md text-gray-700 font-medium">
                {countryCodes[formData.country] || DEFAULT_COUNTRY_CODE}
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phoneWithoutCode}
                onChange={handleChange}
                className="border border-l-0 border-gray-400 p-2 w-full rounded-r-md text-black"
                disabled={isSubmitting}
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role */}
      <div className="mb-6">
        <label htmlFor="role" className="block font-semibold text-black mb-2">
          User Role <span className="text-red-500">*</span>
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border border-gray-400 p-2 w-full rounded text-black"
          disabled={isSubmitting}
          required
        >
          <option value="user">Regular User</option>
          <option value="admin">Administrator</option>
        </select>
        <p className="mt-1 text-sm text-gray-700">
          Administrators have full access to manage users and system settings.
        </p>
      </div>

      {/* Commission - Only show when editing */}
      {isEditing && (
        <div className="mb-6 border-t border-gray-300 pt-6">
          <label htmlFor="commission" className="block font-semibold text-black mb-2">
            Commission Rate (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent size={16} className="text-gray-400" />
            </div>
            <input
              type="number"
              id="commission"
              name="commission"
              value={formData.commission}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className={`pl-10 border p-2 w-full rounded text-black ${
                errors.commission ? "border-red-500" : "border-gray-400"
              }`}
              disabled={isSubmitting}
            />
          </div>
          {errors.commission && <p className="mt-1 text-sm text-red-500">{errors.commission}</p>}
          <p className="mt-1 text-sm text-gray-700">
            Commission percentage for this user. Enter a value between 0 and 100.
          </p>
        </div>
      )}

      {/* Password fields (shown only for new users) */}
      {!isEditing && (
        <div className="border-t border-gray-300 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-black mb-4">Set Password</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-semibold text-black mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`border p-2 w-full rounded text-black ${
                  errors.password ? "border-red-500" : "border-gray-400"
                }`}
                disabled={isSubmitting}
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              <p className="mt-1 text-sm text-gray-700">Password must be at least 8 characters long.</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block font-semibold text-black mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`border p-2 w-full rounded text-black ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-400"
                }`}
                disabled={isSubmitting}
                required
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 text-black"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update User"
          ) : (
            "Create User"
          )}
        </button>
      </div>
    </form>
  )
}
