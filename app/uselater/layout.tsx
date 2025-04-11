import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Simulating user role detection (You will replace this with real logic)
function getUserRole() {
  return "admin"; // Change this to "user" to test different views
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const role = getUserRole(); // Fetch role dynamically

  return (
    <html lang="en">
      <body className="flex">
        {/* Show Sidebar only for Admins */}
        {role === "admin" && <Sidebar />}
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
