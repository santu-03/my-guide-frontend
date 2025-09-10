import React, { useMemo } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { MapPin, Calendar, DollarSign, Star, Users } from "lucide-react";

const upcoming = [
  { id: "u1", title: "Old Kolkata Heritage Walk", date: "2025-09-14", guests: 6 },
  { id: "u2", title: "Sundarbans Day Tour", date: "2025-09-16", guests: 12 },
  { id: "u3", title: "North Kolkata Food Trail", date: "2025-09-20", guests: 8 },
];

export default function GuideDashboard() {
  const user = { name: "Guide User", role: "guide", avatar: "/default-avatar.png" };

  const metrics = useMemo(
    () => [
      { icon: MapPin,    label: "Active Tours",      value: "9",      trend: { direction: "up", value: "+1" } },
      { icon: Calendar,  label: "Upcoming Bookings", value: "23",     trend: { direction: "up", value: "+3" }, subtle: true },
      { icon: DollarSign,label: "Earnings (30d)",    value: "₹84,200",trend: { direction: "up", value: "+6.2%" } },
      { icon: Star,      label: "Average Rating",    value: "4.7 / 5" },
    ],
    []
  );

  return (
    <DashboardLayout role="guide" title="Home" user={user}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((m, i) => <StatCard key={i} {...m} />)}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Upcoming Bookings</h2>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {upcoming.map((b) => (
              <li key={b.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{b.title}</div>
                  <div className="text-xs text-gray-500">{new Date(b.date).toLocaleDateString()}</div>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Users className="h-4 w-4" /> {b.guests}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Announcements</h2>
          <ol className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>Confirm meeting points a day before.</li>
            <li>Carry spare ponchos and water.</li>
            <li>Share a WhatsApp live-location on tour day.</li>
          </ol>
        </section>
      </div>
    </DashboardLayout>
  );
}
