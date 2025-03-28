// app/dashboard/layout.tsx

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex">
        {/* This will be the Sidebar */}
        <aside className="w-1/5 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-4">
            <a href="/dashboard" className="px-4 py-2 hover:bg-green-500 block rounded">
              Dashboard
            </a>
            <a href="/dashboard/user-management" className="px-4 py-2 hover:bg-green-500 block rounded">
              User Management
            </a>
            <a href="/dashboard/freight-rate" className="px-4 py-2 hover:bg-green-500 block rounded">
              Freight Rate Management
            </a>
            <a href="/dashboard/quote-request" className="px-4 py-2 hover:bg-green-500 block rounded">
              Quote Request
            </a>
            <a href="/dashboard/settings" className="px-4 py-2 hover:bg-green-500 block rounded">
              Settings
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
  