import React from "react";
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "EV Charging Dashboard",
  description: "Manage EV stations and charging sessions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100 text-gray-900">
        {/* sidebar */}
        <aside className="w-64 bg-blue-800 text-white flex flex-col p-6">
          <Link href="/">
          <h1 className="text-xl font-bold mb-8">EV Dashboard</h1>
          </Link>

          <nav className="flex flex-col gap-4">
            <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            <Link href="/stations/" className="hover:text-gray-300">Stations</Link>
            <Link href="/sessions/" className="hover:text-gray-300">Sessions</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">

          <header className="w-full bg-blue-800 shadow px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">EV Charging Dashboard</h2>

            <nav className="flex gap-6 text-lg text-white">
              <Link href="/" className="hover:text-black">Home</Link>
              <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
              <Link href="/stations" className="hover:text-black">Stations</Link>
              <Link href="/sessions" className="hover:text-black">Sessions</Link>
            </nav>

            <button className="px-4 py-2 bg-cyan-800 text-white rounded-lg cursor-pointer hover:bg-cyan-900">
              Logout
            </button>
          </header>

          {/* Page Content */}
          <main className="p-10">{ children }</main>

        </div>

      </body>
    </html>
  );
}