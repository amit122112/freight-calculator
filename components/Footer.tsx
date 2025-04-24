"use client";
export default function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="w-full text-center py-4 bg-gray-100 border-t">
        <p className="text-sm text-gray-500">
          © {currentYear} Equity Logistics. All rights reserved.
        </p>
      </footer>
    );
  }
  