"use client"

import Link from "next/link"
import { Home, Users, Package, ClipboardList, Settings, Hash, CreditCard } from "lucide-react"

type SidebarProps = {
  userRole?: string
}

export default function Sidebar({ userRole = "user" }: SidebarProps) {
  // Common menu items for all users
  const commonMenuItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  // Admin-specific menu items
  const adminMenuItems = [
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: Package, label: "Rate Management", href: "/admin/rates" },
    { icon: ClipboardList, label: "Quote Requests", href: "/admin/quotes" },
  ]

  // User-specific menu items
  const userMenuItems = [
    { icon: Users, label: "Profile", href: "/admin/profile" },
    { icon: Hash, label: "Update Password", href: "/admin/password" },
    { icon: CreditCard, label: "View Carriers", href: "/admin/carriers" },
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
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-gray-900"
              >
                <item.icon size={20} className="text-gray-600" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

