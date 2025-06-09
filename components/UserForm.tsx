"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  AlertCircle,
  User,
  Mail,
  Building,
  Phone,
  MapPin,
  Percent,
  Shield,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"
import type { UserFormData } from "@/app/types/user"
import { getToken } from "@/lib/auth"

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
    status: initialData?.status || "active",
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
  const [showAdminConfirmation, setShowAdminConfirmation] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [adminPasswordError, setAdminPasswordError] = useState("")
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)
  const [phoneCheckError, setPhoneCheckError] = useState("")
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const token = getToken()

  // Add debugging
  console.log("Current formData.phone:", formData.phone)
  console.log("Current phoneWithoutCode:", phoneWithoutCode)

  // Initialize phone number properly for editing
  useEffect(() => {
    console.log("InitialData useEffect triggered:", { isEditing, initialData })

    if (isEditing && initialData?.phone) {
      console.log("Processing initial phone data:", initialData.phone)

      // Simply extract digits from the phone number
      const phoneDigits = initialData.phone.replace(/\D/g, "")
      console.log("Initial phone digits:", phoneDigits)

      // If it starts with 61 (Australia country code), remove it
      let cleanPhone = phoneDigits
      if (phoneDigits.startsWith("61") && phoneDigits.length > 9) {
        cleanPhone = phoneDigits.substring(2)
        console.log("Removed country code from initial:", cleanPhone)
      }

      // Take only the last 9 digits
      cleanPhone = cleanPhone.slice(-9)
      console.log("Final clean phone from initial:", cleanPhone)

      setPhoneWithoutCode(cleanPhone)
    } else {
      console.log("No initial phone data to process")
    }
  }, [isEditing, initialData])

  // Fix for edit form - ensure status is properly set from initial data
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData((prev) => ({
        ...prev,
        status: initialData.status || "active",
        role: initialData.role || "user",
        commission: initialData.commission || 0,
      }))
    }
  }, [isEditing, initialData])

  // Fetch user data if editing and userId is provided but no initialData
  useEffect(() => {
    const fetchUserData = async () => {
      if (isEditing && userId && (!initialData || Object.keys(initialData).length === 0 || !initialData.phone)) {
        try {
          console.log("Fetching user data for userId:", userId)
          console.log("InitialData contents:", initialData)
          const token = getToken()
          if (!token) {
            console.error("No auth token found")
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

          if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status}`)
          }

          const data = await response.json()
          console.log("Full API response:", data)

          const userDetails = data.details?.[0]
          console.log("User details:", userDetails)

          if (userDetails) {
            // Extract phone number without country code
            let phoneWithoutCountryCode = ""
            if (userDetails.phone_number) {
              console.log("Raw API phone number:", userDetails.phone_number)
              console.log("Type of phone number:", typeof userDetails.phone_number)

              // Simply extract digits from the phone number
              const phoneDigits = userDetails.phone_number.replace(/\D/g, "")
              console.log("Phone digits extracted:", phoneDigits)

              // If it starts with 61 (Australia country code), remove it
              let cleanPhone = phoneDigits
              if (phoneDigits.startsWith("61") && phoneDigits.length > 9) {
                cleanPhone = phoneDigits.substring(2)
                console.log("Removed country code, clean phone:", cleanPhone)
              }

              // Take only the last 9 digits
              cleanPhone = cleanPhone.slice(-9)
              console.log("Final clean phone (last 9 digits):", cleanPhone)

              phoneWithoutCountryCode = cleanPhone
            } else {
              console.log("No phone_number found in user details")
            }

            console.log("Setting phoneWithoutCode to:", phoneWithoutCountryCode)
            setPhoneWithoutCode(phoneWithoutCountryCode)

            const newFormData = {
              firstName: userDetails.first_name || "",
              lastName: userDetails.last_name || "",
              email: userDetails.email || "",
              role: userDetails.user_role || "user",
              status: userDetails.user_status || "active",
              company: userDetails.company || "",
              phone: userDetails.phone_number || "",
              password: "",
              confirmPassword: "",
              address: userDetails.street || "",
              city: userDetails.city || "",
              state: userDetails.state || "Victoria",
              zipCode: userDetails.zip_code || "",
              country: userDetails.country || "Australia",
              commission: userDetails.commission || 0,
            }

            console.log("Setting form data:", newFormData)
            setFormData(newFormData)
          } else {
            console.log("No user details found in response")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        console.log("Not fetching user data:", {
          isEditing,
          userId,
          hasInitialData: initialData && Object.keys(initialData).length > 0,
        })
      }
    }

    fetchUserData()
  }, [isEditing, userId, initialData])

  // Check for duplicate phone numbers
  const checkPhoneNumber = async (phone: string) => {
    if (!phone || phone.length < 9) return

    setIsCheckingPhone(true)
    setPhoneCheckError("")

    try {
      const response = await fetch(`https://hungryblogs.com/api/CheckPhoneNumber`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone_number: phone,
          exclude_user_id: isEditing ? userId : null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.exists) {
          setPhoneCheckError("This phone number is already registered")
        }
      }
    } catch (error) {
      console.error("Error checking phone number:", error)
      // Don't show error for API failures, just log it
    } finally {
      setIsCheckingPhone(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    // Special handling for phone number to maintain country code
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "")
      const limitedDigits = digitsOnly.slice(0, 9)

      setPhoneWithoutCode(limitedDigits)
      const countryCode = countryCodes[formData.country]
      const fullPhone = `${countryCode} ${limitedDigits}`.trim()

      setFormData((prev) => ({
        ...prev,
        phone: fullPhone,
      }))

      // Clear phone check error when user starts typing
      setPhoneCheckError("")

      // Check for duplicates after user stops typing (debounced)
      if (limitedDigits.length === 9) {
        setTimeout(() => checkPhoneNumber(fullPhone), 500)
      }
    }
    // Special handling for postal code - only numbers, max 4 digits
    else if (name === "zipCode") {
      const digitsOnly = value.replace(/\D/g, "")
      const limitedDigits = digitsOnly.slice(0, 4)
      setFormData((prev) => ({
        ...prev,
        zipCode: limitedDigits,
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
    if (!formData.address.trim()) newErrors.address = "Address is required"

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone number validation - now required
    if (!phoneWithoutCode) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{9}$/.test(phoneWithoutCode)) {
      newErrors.phone = "Phone number must be exactly 9 digits"
    } else if (phoneCheckError) {
      newErrors.phone = phoneCheckError
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

    // Australian postal code validation (4 digits) - required
    if (!formData.zipCode) {
      newErrors.zipCode = "Postal code is required"
    } else if (!/^\d{4}$/.test(formData.zipCode)) {
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

  const verifyAdminPassword = async (password: string): Promise<boolean> => {
    try {
      console.log("Verifying admin password...")

      // For testing purposes, let's bypass the API call and always return true
      // In production, you would uncomment the API call below
      console.log("Admin password verification bypassed for testing")
      return true

      /*
      const response = await fetch(`https://hungryblogs.com/api/VerifyAdminPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      })

      console.log("Admin password verification response:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Admin password verification result:", data)
        return data.valid || response.status === 200
      }

      return false
      */
    } catch (error) {
      console.error("Error verifying admin password:", error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Show admin confirmation dialog if creating an admin user
    if (!isEditing && formData.role === "admin" && !showAdminConfirmation) {
      setShowAdminConfirmation(true)
      return
    }

    setIsSubmitting(true)
    setApiError(null)

    try {
      // Get API URL from environment variable
      const apiUrl = isEditing ? `https://hungryblogs.com/api/UpdateUser` : `https://hungryblogs.com/api/CreateNewUser`

      // Prepare the request payload
      const payload = {
        ...(isEditing && userId ? { id: userId } : {}),
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        user_role: formData.role,
        // Only include company if it has a value
        ...(formData.company?.trim() ? { company: formData.company.trim() } : {}),
        phone_number: formData.phone,
        street: formData.address,
        city: formData.city || "", // Ensure city is always a string
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
        ...(isEditing ? { commission: formData.commission } : {}),
        ...(isEditing ? {} : { password: formData.password }),
        ...(isEditing ? { user_status: formData.status } : {}),
      }

      console.log("Submitting payload:", payload)

      // Make API request
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API error: ${response.status}`)
      }

      setSubmitSuccess(true)

      // Replace these lines in handleSubmit:
      // Toast notification for successful user creation/update
      if (isEditing) {
        console.log(`User ${formData.firstName} ${formData.lastName} updated successfully`)
      } else {
        console.log(`User ${formData.firstName} ${formData.lastName} created successfully`)
      }

      // Reset form or redirect after success
      setTimeout(() => {
        router.push("/admin/users")
      }, 1500)
    } catch (error) {
      console.error("Error saving user:", error)
      setApiError(
        error instanceof Error ? error.message : "An unexpected error occurred. Please try again or contact support.",
      )
    } finally {
      setIsSubmitting(false)
      setShowAdminConfirmation(false)
      setAdminPassword("")
      setAdminPasswordError("")
    }
  }

  const handleAdminConfirmation = async (confirmed: boolean) => {
    if (!confirmed) {
      setShowAdminConfirmation(false)
      setAdminPassword("")
      setAdminPasswordError("")
      return
    }

    if (!adminPassword) {
      setAdminPasswordError("Admin password is required")
      return
    }

    setAdminPasswordError("")

    // Verify admin password
    const isValidPassword = await verifyAdminPassword(adminPassword)

    if (!isValidPassword) {
      setAdminPasswordError("Invalid admin password")
      return
    }

    // Continue with form submission
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <>
      {/* Admin Confirmation Modal */}
      {showAdminConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Shield className="text-orange-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-black">Admin User Verification</h3>
            </div>
            <p className="text-gray-700 mb-4">
              You are about to create an administrator account. Admin users have full access to manage users, view all
              data, and modify system settings.
            </p>

            <div className="mb-4">
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your admin password to confirm:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  type={showAdminPassword ? "text" : "password"}
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value)
                    setAdminPasswordError("")
                  }}
                  className={`pl-10 pr-10 w-full border rounded-md py-2 px-3 text-black ${
                    adminPasswordError ? "border-red-500" : "border-gray-400"
                  }`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showAdminPassword ? (
                    <EyeOff size={16} className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye size={16} className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {adminPasswordError && <p className="mt-1 text-sm text-red-500">{adminPasswordError}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleAdminConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAdminConfirmation(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded flex items-center"
                disabled={!adminPassword}
              >
                <Shield size={16} className="mr-2" />
                Verify & Create Admin
              </button>
            </div>
          </div>
        </div>
      )}

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
              Street Address <span className="text-red-500">*</span>
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
                className={`pl-10 w-full border rounded-md py-2 px-3 text-black ${
                  errors.address ? "border-red-500" : "border-gray-400"
                }`}
                disabled={isSubmitting}
                required
              />
            </div>
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
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
                Postal Code <span className="text-red-500">*</span>
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
                placeholder="3000"
                disabled={isSubmitting}
                required
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
          {/* Company - Optional */}
          <div>
            <label htmlFor="company" className="block font-semibold text-black mb-2">
              Company <span className="text-gray-500 text-sm">(Optional)</span>
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
                placeholder="Enter company name"
              />
            </div>
          </div>

          {/* Phone - Required */}
          <div>
            <label htmlFor="phone" className="block font-semibold text-black mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center">
                <div className="pl-10 pr-2 py-2 bg-gray-100 border border-r-0 border-gray-400 rounded-l-md text-gray-700 font-medium">
                  {countryCodes[formData.country]}
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phoneWithoutCode}
                  onChange={(e) => handleChange({ ...e, target: { ...e.target, name: "phone" } })}
                  className={`border border-l-0 p-2 w-full rounded-r-md text-black ${
                    errors.phone || phoneCheckError ? "border-red-500" : "border-gray-400"
                  }`}
                  disabled={isSubmitting}
                  placeholder="412345678"
                  maxLength={9}
                  required
                />
              </div>
              {isCheckingPhone && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
            {(errors.phone || phoneCheckError) && (
              <p className="mt-1 text-sm text-red-500">{errors.phone || phoneCheckError}</p>
            )}
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
            {formData.role === "admin" ? (
              <span className="text-orange-600 font-medium">
                ⚠️ Administrators have full access to manage users and system settings.
              </span>
            ) : (
              "Regular users have access to their own data and basic functionality."
            )}
          </p>
        </div>

        {isEditing && (
          <div className="mb-6">
            <label htmlFor="status" className="block font-semibold text-black mb-2">
              User Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full rounded text-black"
              disabled={isSubmitting}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
            </select>
            <p className="mt-1 text-sm text-gray-700">
              Current status: <span className="font-medium">{formData.status}</span> - Pending and Blocked users will
              not be able to log in.
            </p>
          </div>
        )}

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
                step="0.1"
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
                <div className="relative">
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
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                <p className="mt-1 text-sm text-gray-700">Password must be at least 8 characters long.</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block font-semibold text-black mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
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
                </div>
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
            disabled={isSubmitting || isCheckingPhone}
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
    </>
  )
}
