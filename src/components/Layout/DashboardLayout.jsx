
import React from "react";import Sidebar from "@/components/Layout/Sidebar";
import { Bell, Search, Settings } from "lucide-react";

/**
 * DashboardLayout
 * - Sticky top bar with optional search / bell
 * - Left sidebar (role-aware)
 * - Center container with optional right sidebar
 *
 * NEW props:
 * - sidebarExtra: ReactNode that is rendered inside Sidebar "extra" slot (e.g., small StatCards)
 * - rightSidebar: ReactNode rendered as right column next to main content
 */
export default function DashboardLayout({
  role = "traveller",
  title = "Dashboard",
  user,
  children,

  showSearch = true,
  showBell = true,

  sidebarExtra = null, // 👈 StatCards or widgets inside the left sidebar
  rightSidebar = null, // 👈 right column widgets/cards for dashboard pages
}) {
  const displayUser = user || { name: "User", avatar: "/default-avatar.png" };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left sidebar with extra slot */}
      <Sidebar role={role} extra={sidebarExtra} />

      {/* Main */}
      <main className="flex-1">
        {/* Top bar */}
        {/* <div className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200/70 dark:border-gray-800/70">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="h-14 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  {title}
                </h1>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {showSearch && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search…"
                      className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                )}

                {showBell && (
                  <button
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                )}

                <button
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Settings</span>
                </button>

                <div className="flex items-center gap-2 pl-2 ml-2 border-l border-gray-200 dark:border-gray-800">
                  <img
                    src={displayUser.avatar || "/default-avatar.png"}
                    alt={displayUser.name}
                    onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {displayUser.name}
                    </span>
                    {displayUser.email && (
                      <span className="text-xs text-gray-500">{displayUser.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Content container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {rightSidebar ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">{children}</div>
              <div className="space-y-6">{rightSidebar}</div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
