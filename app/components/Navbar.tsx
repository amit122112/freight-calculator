"use client"

import { useState } from "react"
import { EquityLogo } from "./Logo"
import { Bell, User, LogOut } from "lucide-react"

export default function Navbar({ userRole = "user" }: { userRole?: string }) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center">
          <EquityLogo height={40} width={120} />
          <h1 className="ml-4 text-xl font-semibold text-gray-800">
            {userRole === "admin" ? "Admin Dashboard" : "User Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
          </button>

          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-gray-800">{userRole === "admin" ? "Admin" : "User"}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
                <div className="border-t my-1"></div>
                <a href="/login" className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

