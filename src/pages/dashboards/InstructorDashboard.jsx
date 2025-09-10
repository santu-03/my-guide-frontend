import React, { useMemo } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { ClipboardList, Calendar, Users, ThumbsUp, BookOpen } from "lucide-react";

const sessions = [
  { id: "s1", title: "Beginner Photography Walk", date: "2025-09-18", enrolled: 5 },
  { id: "s2", title: "City Cycling Basics", date: "2025-09-24", enrolled: 8 },
  { id: "s3", title: "Weekend Kayaking 101", date: "2025-10-02", enrolled: 10 },
];

export default function InstructorDashboard() {
  const user = { name: "Instructor User", role: "instructor", avatar: "/default-avatar.png" };

  const metrics = useMemo(
    () => [
      { icon: ClipboardList, label: "Total Activities", value: "32" },
      { icon: Calendar,      label: "Upcoming Sessions", value: "7", subtle: true },
      { icon: Users,         label: "Enrolled Users", value: "240", trend: { direction: "up", value: "+12%" } },
      { icon: ThumbsUp,      label: "Avg Feedback", value: "4.6 / 5" },
    ],
    []
  );

  return (
    <DashboardLayout role="instructor" title="Home" user={user}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((m, i) => <StatCard key={i} {...m} />)}
      </div>

      <section className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Upcoming Sessions
        </h2>
        {sessions.length ? (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {sessions.map((s) => (
              <li key={s.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{s.title}</div>
                  <div className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{s.enrolled} enrolled</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">No sessions scheduled.</div>
        )}
      </section>
    </DashboardLayout>
  );
}
