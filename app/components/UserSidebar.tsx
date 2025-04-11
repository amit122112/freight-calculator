"use client"

import Link from "next/link"
import { Home, Package, TrendingUp, CreditCard, User, MessageSquare, Settings } from "lucide-react"

export default function UserSidebar() {
  // Menu items for regular users
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Package, label: "My Shipments", href: "/dashboard/all-shipments" },
    { icon: TrendingUp, label: "Track Shipment", href: "/dashboard/track" },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
    { icon: User, label: "My Profile", href: "/dashboard/profile" },
    { icon: MessageSquare, label: "Support", href: "/dashboard/support" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Equity Logistics</h2>
        <p className="text-sm text-gray-500">Customer Portal</p>
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

