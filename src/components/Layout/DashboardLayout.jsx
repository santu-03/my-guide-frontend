// FILE: DashboardLayout.jsx
import React from "react";
import Sidebar from "@/components/Layout/Sidebar";

export default function DashboardLayout({ role, title, user, children }) {
  return (
    <div className="flex">
      <Sidebar role={role} />

      <main className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* User Profile Header */}
        {user && (
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.name}
              className="h-12 w-12 rounded-full border border-gray-300"
            />
            <div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                {user.name}
              </div>
              <div className="text-sm text-gray-500">{user.role}</div>
            </div>
          </div>
        )}

        {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
