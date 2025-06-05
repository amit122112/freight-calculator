import type React from "react"
import Sidebar from "../../components/Sidebar"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Navbar userRole="admin" />
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
