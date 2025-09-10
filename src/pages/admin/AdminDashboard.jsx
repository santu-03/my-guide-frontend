import React, { useMemo } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { Users, ClipboardList, MapPin, DollarSign, Activity, Link as LinkIcon } from "lucide-react";

export default function AdminDashboard() {
  const user = { name: "Admin User", role: "admin", avatar: "/default-avatar.png" };

  const metrics = useMemo(
    () => [
      { icon: Users,         label: "Total Users",       value: "3,284",    trend: { direction: "up", value: "+8.3%" } },
      { icon: ClipboardList, label: "Active Activities", value: "142",      trend: { direction: "up", value: "+2.1%" }, subtle: true },
      { icon: MapPin,        label: "Listed Places",     value: "67",       trend: { direction: "down", value: "-0.6%" } },
      { icon: DollarSign,    label: "Revenue (30d)",     value: "$120,540", trend: { direction: "up", value: "+4.7%" } },
    ],
    []
  );

  return (
    <DashboardLayout role="admin" title="Admin Home" user={user}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((m, i) => <StatCard key={i} {...m} />)}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
            <Activity className="h-5 w-5" /> System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Stat label="API Uptime" value="99.97%" />
            <Stat label="Error Rate (24h)" value="0.12%" />
            <Stat label="Queue Latency" value="181ms" />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
            <LinkIcon className="h-5 w-5" /> Quick Admin Links
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Manage Activities", to: "/dashboard/admin/activities" },
              { label: "Add Activity",      to: "/dashboard/admin/activities/new" },
              { label: "Manage Places",     to: "/dashboard/admin/places" },
              { label: "Add Place",         to: "/dashboard/admin/places/new" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.to}
                className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/40"
              >
                {l.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}
