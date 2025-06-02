"use client"

import { useState } from "react"
import Link from "next/link"
import {Home,Users,Package,ClipboardList,Settings,Hash,CreditCard,ChevronDown,ChevronRight,User,Shield,Bell} from "lucide-react"
import { usePathname } from "next/navigation"

type SidebarProps = {
  userRole?: string
}

export default function Sidebar({ userRole = "user" }: SidebarProps) {
  const pathname = usePathname()
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)

  // Check if current path is under settings
  const isSettingsPath = pathname.includes("/admin/settings")

  // Common menu items for all users
  const commonMenuItems = [{ icon: Home, label: "Dashboard", href: "/admin" }]

  // Admin-specific menu items
  const adminMenuItems = [
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: Package, label: "Rate Management", href: "/admin/rates" },
    { icon: ClipboardList, label: "Quote Requests", href: "/admin/quotes" },
  ]

  // User-specific menu items
  const userMenuItems = [
    { icon: Hash, label: "Update Password", href: "/admin/password" },
    { icon: CreditCard, label: "View Carriers", href: "/admin/carriers" },
  ]

  // Settings submenu items
  const settingsItems = [
    { icon: User, label: "Account", href: "/admin/settings/account" },
    { icon: Shield, label: "Security", href: "/admin/settings/security" },
    { icon: Bell, label: "Notifications", href: "/admin/settings/notifications" }
  ]

  // Determine which menu items to show based on role
  const menuItems = [...commonMenuItems, ...(userRole === "admin" ? adminMenuItems : userMenuItems)]

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Equity Logistics</h2>
        <p className="text-sm text-gray-500">{userRole === "admin" ? "Admin Portal" : "Customer Portal"}</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(`${item.href}/`) && item.href !== "/admin" && item.href !== "/dashboard") ||
              (item.href === "/admin" && pathname === "/admin")

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
