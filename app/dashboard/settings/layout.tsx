"use client"

import type React from "react"
//import { usePathname } from "next/navigation"
//import Link from "next/link"
//import { User, Shield, Bell, Globe, ChevronRight } from "lucide-react"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  //const pathname = usePathname()



  return (
    <div className="bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-lg border shadow-sm p-6">{children}</div>
      </div>
    </div>
  )
}
