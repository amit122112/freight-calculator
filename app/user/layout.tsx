// app/dashboard/layout.tsx

export default function UDashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex">
        {/* This will be the Sidebar */}
        <aside className="w-1/5 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold mb-6">User Panel</h2>
          <nav className="space-y-4">
            <a href="/user" className="px-4 py-2 hover:bg-green-500 block rounded">
              Dashboard
            </a>
            <a href="/user/profile" className="px-4 py-2 hover:bg-green-500 block rounded">
              Profile
            </a>
            <a href="/user/update-password" className="px-4 py-2 hover:bg-green-500 block rounded">
              Update Password
            </a>
            <a href="/user/view-carriers" className="px-4 py-2 hover:bg-green-500 block rounded">
              View Carriers
            </a>
          </nav>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 p-6 rounded bg-green-300">
          {children}
        </main>
      </div>
    );
  }
  