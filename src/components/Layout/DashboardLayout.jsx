import React from "react";
import Sidebar from "@/components/Layout/Sidebar";
import { Bell, Search, ChevronDown, Settings } from "lucide-react";

export default function DashboardLayout({
  role,
  title,
  user,
  children,
  showSearch = true,
  showBell = true,
}) {
  const displayUser = user || { name: "User", role, avatar: "/default-avatar.png" };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role={role} />

      <main className="flex-1">
        <div className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200/70 dark:border-gray-800/70">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-12 items-center gap-4">
            <div className="col-span-6 sm:col-span-7">
              {title ? (
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
              ) : (
                <div className="text-sm text-gray-500">Dashboard</div>
              )}
            </div>

            {showSearch && (
              <div className="col-span-6 sm:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Search…"
                  />
                </div>
              </div>
            )}

            <div className="col-span-12 sm:col-span-2 flex items-center justify-end gap-2">
              <button className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <Settings className="h-4 w-4" />
                <span className="hidden lg:inline">Settings</span>
              </button>
              {showBell && (
                <button className="relative p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-primary-500" />
                </button>
              )}
              <button className="inline-flex items-center gap-2 rounded-full pl-1 pr-2 py-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <img src={displayUser.avatar} alt={displayUser.name} className="h-8 w-8 rounded-full object-cover" />
                <span className="text-sm text-gray-800 dark:text-gray-200 hidden sm:inline">{displayUser.name}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
