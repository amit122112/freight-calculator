import type React from "react"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

// This function should eventually be replaced with actual authentication logic
function getUserRole() {
  return "admin" // Change this to "user" to test different views
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = getUserRole() // Fetch role dynamically

  return (
    <div className="flex bg-white min-h-screen">
      {/* Show Sidebar for all authenticated users */}
      <Sidebar userRole={role} />

      <div className="flex-1 flex flex-col">
        <Navbar userRole={role} />
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

