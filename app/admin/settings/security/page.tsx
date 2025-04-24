"use client"

import type React from "react"

import { useState } from "react"
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Password strength requirements
  const requirements = [
    { text: "At least 8 characters", met: newPassword.length >= 8 },
    { text: "At least one uppercase letter", met: /[A-Z]/.test(newPassword) },
    { text: "At least one lowercase letter", met: /[a-z]/.test(newPassword) },
    { text: "At least one number", met: /[0-9]/.test(newPassword) },
    { text: "At least one special character", met: /[^A-Za-z0-9]/.test(newPassword) },
  ]

  const passwordsMatch = newPassword === confirmPassword && newPassword !== ""
  const allRequirementsMet = requirements.every((req) => req.met)
  const canSubmit = currentPassword && allRequirementsMet && passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setError("")

    if (!canSubmit) return

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate success
      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError("Failed to update password. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-black">Security Settings</h2>
        <p className="text-gray-600">Update your password and security preferences</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
          <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          <span>Your password has been updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <XCircle size={20} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-lg font-medium text-black mb-4">Change Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 pr-10 w-full border border-gray-300 rounded-md py-2 px-3"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-gray-400" />
                ) : (
                  <Eye size={16} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10 w-full border border-gray-300 rounded-md py-2 px-3"
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-gray-400" />
                ) : (
                  <Eye size={16} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-10 pr-10 w-full border rounded-md py-2 px-3 ${
                  confirmPassword && !passwordsMatch ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-gray-400" />
                ) : (
                  <Eye size={16} className="text-gray-400" />
                )}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && <p className="mt-1 text-sm text-red-600">Passwords do not match</p>}
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h4>
            <ul className="space-y-1">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-center text-sm">
                  {req.met ? (
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                  ) : (
                    <XCircle size={16} className="mr-2 text-gray-300" />
                  )}
                  <span className={req.met ? "text-green-700" : "text-gray-500"}>{req.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSaving}
            className={`px-4 py-2 rounded-md transition-colors ${
              canSubmit && !isSaving
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } flex items-center gap-2`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium text-black mb-4">Two-Factor Authentication</h3>
        <p className="text-gray-600 mb-4">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>

        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Enable 2FA
        </button>
      </div>
    </div>
  )
}
