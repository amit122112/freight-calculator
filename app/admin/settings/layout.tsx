"use client"

import type React from "react"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg border shadow-sm p-6">{children}</div>
    </div>
  )
}
