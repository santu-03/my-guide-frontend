import React, { useMemo } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { ClipboardList, Star, Users, FileBarChart, TrendingUp, Award } from "lucide-react";

const recent = [
  { id: "c1", name: "Monsoon Trek Drive", status: "Live",   progress: 72 },
  { id: "c2", name: "Calcutta Heritage Walk", status: "Draft", progress: 35 },
  { id: "c3", name: "Goa Cycling Tour", status: "Review", progress: 58 },
];

export default function AdvisorDashboard() {
  const user = { name: "Advisor User", role: "advisor", avatar: "/default-avatar.png" };

  const metrics = useMemo(
    () => [
      { icon: ClipboardList, label: "Active Campaigns", value: "18", trend: { direction: "up", value: "+4.1%" } },
      { icon: Users,         label: "Total Clients",     value: "76", trend: { direction: "up", value: "+1.3%" }, subtle: true },
      { icon: FileBarChart,  label: "Reports (30d)",     value: "42" },
      { icon: Star,          label: "Avg Client Rating", value: "4.8 / 5" },
    ],
    []
  );

  return (
    <DashboardLayout role="advisor" title="Home" user={user}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((m, i) => <StatCard key={i} {...m} />)}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Recent Campaigns
          </h2>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {recent.map((r) => (
              <li key={r.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{r.name}</div>
                  <div className="text-xs text-gray-500">Status: {r.status}</div>
                </div>
                <div className="w-40">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500" style={{ width: `${r.progress}%` }} />
                  </div>
                  <div className="text-right text-xs mt-1 text-gray-500">{r.progress}%</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
            <Award className="h-5 w-5" /> Highlights
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">Top Rated: Goa Cycling Tour</div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">Rising: Monsoon Trek Drive</div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">New Client: River Rafting Co.</div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">3 briefs due this week</div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
