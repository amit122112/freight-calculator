"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Check, X, AlertCircle } from "lucide-react"
import { getToken, getUser } from "@/lib/auth"

export default function SecurityPage() {
  const [isClient, setIsClient] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Password requirements state
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check password requirements
  useEffect(() => {
    setRequirements({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    })
  }, [newPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset messages
    setSuccessMessage("")
    setErrorMessage("")

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    // Check if all requirements are met
    const allRequirementsMet = Object.values(requirements).every(Boolean)
    if (!allRequirementsMet) {
      setErrorMessage("Password does not meet all requirements")
      return
    }

    setIsSubmitting(true)

    try {
      const token = getToken()
      const user = getUser()

      if (!token || !user?.id) {
        setErrorMessage("You are not logged in. Please log in again.")
        setIsSubmitting(false)
        return
      }

      console.log("Updating password for user ID:", user.id)

      const response = await fetch("https://www.hungryblogs.com/api/UpdateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          password: newPassword,
        }),
      })

      console.log("Password update response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API error: ${response.status}`)
      }

      // Success
      setSuccessMessage("Password updated successfully")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Password update error:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      {met ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />}
      <span className={met ? "text-green-600" : "text-red-600"}>{text}</span>
    </div>
  )

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
      <h1 className="text-2xl font-bold text-black mb-6">Security Settings</h1>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-md flex items-center text-green-700">
          <Check size={20} className="mr-2 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-md flex items-center text-red-700">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {newPassword !== confirmPassword && confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h3>
              <div className="space-y-1 text-sm">
                <RequirementItem met={requirements.length} text="At least 8 characters" />
                <RequirementItem met={requirements.uppercase} text="At least one uppercase letter" />
                <RequirementItem met={requirements.lowercase} text="At least one lowercase letter" />
                <RequirementItem met={requirements.number} text="At least one number" />
                <RequirementItem met={requirements.special} text="At least one special character" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  isSubmitting || !Object.values(requirements).every(Boolean) || newPassword !== confirmPassword
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
