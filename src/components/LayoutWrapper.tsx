"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  MapPin,
  Activity,
  Home,
  Menu,
  X,
  LogOut,
  Zap,
  User,
} from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/stations", icon: MapPin, label: "Stations" },
  { href: "/sessions", icon: Activity, label: "Sessions" },
];

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
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-emerald-500/20 text-emerald-400 font-medium shadow-sm shadow-emerald-500/10"
        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
    }`}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="text-sm sm:text-base">{label}</span>
  </Link>
);

const UserSection: React.FC<{
  session: any;
  status: string;
  onLogout: () => void;
}> = ({ session, status, onLogout }) => (
  <>
    {status === "loading" ? (
      <div className="px-4 py-3">
        <div className="h-4 bg-slate-800 rounded animate-pulse mb-2" />
        <div className="h-3 bg-slate-800 rounded animate-pulse w-2/3" />
      </div>
    ) : session?.user ? (
      <div className="mb-4 px-3 py-2 bg-slate-800/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {session.user.name || "User"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {session.user.email}
            </p>
          </div>
        </div>
      </div>
    ) : null}

    <button
      onClick={onLogout}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all duration-200"
    >
      <LogOut className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm sm:text-base">Logout</span>
    </button>
  </>
);

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  // Hide sidebar/header on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    return <>{children}</>;
  }

  const currentPage =
    NAV_ITEMS.find((item) => item.href === pathname)?.label ||
    "EV Charging Dashboard";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-4 xl:p-6 border-b border-slate-800/50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg xl:text-xl font-bold text-white truncate">
                EV Dashboard
              </h1>
              <p className="text-xs text-slate-400 truncate">
                Charging Management
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 xl:p-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
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
        <div className="p-4 xl:p-6 border-t border-slate-800/50">
          <UserSection
            session={session}
            status={status}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col z-50 transform transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={closeSidebar}
          >
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-white truncate">
                EV Dashboard
              </h1>
              <p className="text-xs text-slate-400 truncate">
                Charging Management
              </p>
            </div>
          </Link>
          <button
            onClick={closeSidebar}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 sm:p-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
              onClick={closeSidebar}
            />
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 sm:p-6 border-t border-slate-800">
          <UserSection
            session={session}
            status={status}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 xl:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
          <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
            {/* Mobile Menu Button & Page Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors lg:hidden flex-shrink-0"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="hidden lg:block w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white truncate">
                  {currentPage}
                </h2>
              </div>
            </div>

            {/* Desktop User Info & Logout */}
            <div className="hidden sm:flex items-center gap-3 lg:gap-4 flex-shrink-0">
              {session?.user && (
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-white truncate max-w-[150px] xl:max-w-[200px]">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate max-w-[150px] xl:max-w-[200px]">
                    {session.user.email}
                  </p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg transition-colors border border-slate-700/50 hover:border-slate-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
              <p className="text-center sm:text-left">
                © 2024 EV Charging Dashboard. All rights reserved.
              </p>
              <div className="flex items-center gap-4 sm:gap-6">
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                  aria-label="Privacy Policy"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                  aria-label="Terms of Service"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors"
                  aria-label="Support"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
