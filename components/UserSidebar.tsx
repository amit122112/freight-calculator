"use client"

import { useState } from "react"
import Link from "next/link"
import {Home,Package,User,MessageSquare,Settings,ChevronDown,ChevronRight,Shield,Bell} from "lucide-react"
import { usePathname } from "next/navigation"

export default function UserSidebar() {
  const pathname = usePathname()
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)

  // Check if current path is under settings
  const isSettingsPath = pathname.includes("/dashboard/settings")

  // Menu items for regular users
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Package, label: "My Shipments", href: "/dashboard/shipments" },
    { icon: User, label: "My Profile", href: "/dashboard/profile" },
    { icon: MessageSquare, label: "Support", href: "/dashboard/support" },
  ]

  // Settings submenu items
  const settingsItems = [
    { icon: User, label: "Account", href: "/dashboard/settings/account" },
    { icon: Shield, label: "Security", href: "/dashboard/settings/security" },
    { icon: Bell, label: "Notification", href: "/dashboard/settings/notifications" }
  ]

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Equity Logistics</h2>
        <p className="text-sm text-gray-500">Customer Portal</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {/* Regular menu items */}
          {menuItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(`${item.href}/`) && item.href !== "/dashboard") ||
              (item.href === "/dashboard" && pathname === "/dashboard")

            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-2 p-2 rounded ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <item.icon size={20} className={isActive ? "text-blue-600" : "text-gray-600"} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}

          {/* Settings dropdown menu */}
          <li className="relative">
            <button
              onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
              className={`flex items-center justify-between w-full p-2 rounded ${
                isSettingsPath
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                  : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings size={20} className={isSettingsPath ? "text-blue-600" : "text-gray-600"} />
                <span>Settings</span>
              </div>
              {settingsMenuOpen ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>

            {/* Settings Submenu */}
            {settingsMenuOpen && (
              <ul className="pl-6 mt-1 space-y-1">
                {settingsItems.map((item, index) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                  return (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-2 p-2 text-sm rounded ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                            : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        <item.icon size={16} className={isActive ? "text-blue-600" : "text-gray-600"} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  )
}
