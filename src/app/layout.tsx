"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Activity,
  Home,
  Menu,
  X,
  LogOut,
  Zap,
} from "lucide-react";
import "./globals.css";

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-emerald-500/20 text-emerald-400 font-medium"
        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/stations", icon: MapPin, label: "Stations" },
    { href: "/sessions", icon: Activity, label: "Sessions" },
  ];

  return (
    <html lang="en">
      <head>
        <title>EV Charging Dashboard</title>
        <meta
          name="description"
          content="Manage EV stations and charging sessions"
        />
      </head>
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex min-h-screen">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:flex w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800/50">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">EV Dashboard</h1>
                  <p className="text-xs text-slate-400">Charging Management</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive(item.href)}
                />
              ))}
            </nav>

            {/* User Section */}
            <div className="p-6 border-t border-slate-800/50">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all duration-200">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transform transition-transform duration-300 lg:hidden ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Logo */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-3"
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">EV Dashboard</h1>
                  <p className="text-xs text-slate-400">Charging Management</p>
                </div>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-slate-400 hover:text-white lg:hidden"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive(item.href)}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}
            </nav>

            {/* User Section */}
            <div className="p-6 border-t border-slate-800">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all duration-200">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
              <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 text-slate-400 hover:text-white lg:hidden"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Page Title */}
                <div className="flex items-center gap-3">
                  <div className="hidden lg:block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    {navItems.find((item) => item.href === pathname)?.label ||
                      "EV Charging Dashboard"}
                  </h2>
                </div>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-emerald-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Logout Button */}
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-auto">{children}</main>

            {/* Footer */}
            <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
              <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                <p>© 2024 EV Charging Dashboard. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
