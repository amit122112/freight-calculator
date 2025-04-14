"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import type { UserFormData } from "../types/user"

export default function UserForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    company: "",
    phone: "",
    password: "",
    confirmPassword: "",
    sendInvite: true,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Clear error when field is edited
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
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

    // Password validation
    if (!formData.sendInvite) {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("User created:", {
        ...formData,
        // Don't log passwords in production
        password: "[REDACTED]",
        confirmPassword: "[REDACTED]",
      })

      setSubmitSuccess(true)

      // Reset form or redirect after success
      setTimeout(() => {
        router.push("/admin/users")
      }, 1500)
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
          <Check size={20} className="mr-2 flex-shrink-0" />
          <span>User successfully created! Redirecting...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block font-semibold text-black mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
            disabled={isSubmitting}
            required
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block font-semibold text-black mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
            disabled={isSubmitting}
            required
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label htmlFor="email" className="block font-semibold text-black mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
          disabled={isSubmitting}
          required
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Company */}
        <div>
          <label htmlFor="company" className="block font-semibold text-black mb-2">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            disabled={isSubmitting}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block font-semibold text-black mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            disabled={isSubmitting}
          />
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
          className="border border-gray-300 p-2 w-full rounded"
          disabled={isSubmitting}
          required
        >
          <option value="user">Regular User</option>
          <option value="admin">Administrator</option>
        </select>
        <p className="mt-1 text-sm text-gray-600">
          Administrators have full access to manage users and system settings.
        </p>
      </div>

      {/* Send Invite Option */}
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sendInvite"
            name="sendInvite"
            checked={formData.sendInvite}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <label htmlFor="sendInvite" className="ml-2 block text-black">
            Send invitation email to set password
          </label>
        </div>
      </div>

      {/* Password fields (shown only if not sending invite) */}
      {!formData.sendInvite && (
        <div className="border-t pt-6 mt-6">
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
                className={`border p-2 w-full rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
                disabled={isSubmitting}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              <p className="mt-1 text-sm text-gray-600">Password must be at least 8 characters long.</p>
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
                className={`border p-2 w-full rounded ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                disabled={isSubmitting}
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
          className="px-6 py-2 border rounded hover:bg-gray-100 text-black"
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
              Creating...
            </>
          ) : (
            "Create User"
          )}
        </button>
      </div>
    </form>
  )
}
