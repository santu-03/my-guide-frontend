import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/Layout/StatCard";
import { Wallet, Users, Plane, Package, CheckCircle2, XCircle, EllipsisVertical } from "lucide-react";

const initialTasks = [
  { id: "t1", type: "Pending Approval", amount: 1200, from: "Emiliaia Tavares", to: "George Tavares", status: "pending" },
  { id: "t2", type: "Unreported Advances", amount: 2132, from: "Sophie M.", to: "Playstation Corp.", status: "pending" },
];

const initialBookings = [
  { id: "b1", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Cathy" },
  { id: "b2", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Mark" },
  { id: "b3", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Amit" },
  { id: "b4", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Sara" },
  { id: "b5", pkg: "New Delhi → Dhaka", type: "Oneway", price: 50, status: "Pending", user: "Lina" },
];

export default function TravellerDashboard() {
  const user = { name: "Jayson", role: "traveller", avatar: "/default-avatar.png" };
  const [tasks, setTasks] = useState(initialTasks);
  const [bookings] = useState(initialBookings);

  const metrics = useMemo(
    () => [
      { icon: Wallet,  label: "Total Booked",    value: "$24,590", trend: { direction: "up",   value: "+12.08%" } },
      { icon: Package, label: "30 Days Revenue", value: "$18,680", trend: { direction: "down", value: "-12.08%" }, subtle: true },
      { icon: Users,   label: "Total Customers", value: "$50,680", trend: { direction: "up",   value: "+12.08%" } },
      { icon: Plane,   label: "Tour Packages",   value: "$16,590", trend: { direction: "up",   value: "+12.08%" } },
    ],
    []
  );

  const approveTask = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, status: "approved" } : x)));
  const rejectTask  = (id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, status: "rejected" } : x)));

  return (
    <DashboardLayout role="traveller" title="Home" user={user}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metrics.map((m, i) => (
          <StatCard key={i} icon={m.icon} label={m.label} value={m.value} trend={m.trend} subtle={m.subtle} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Pending Task</h2>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><EllipsisVertical className="h-5 w-5 text-gray-400" /></button>
          </div>
          <div className="p-5 space-y-4">
            {tasks.map((t) => (
              <div key={t.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">{t.type}</div>
                <div className="mt-1 text-2xl font-bold text-primary-600">${t.amount.toLocaleString()}</div>
                <div className="mt-2 text-xs text-gray-500">
                  From <span className="font-medium text-gray-700 dark:text-gray-200">{t.from}</span> to{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">{t.to}</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => rejectTask(t.id)} className="px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" disabled={t.status !== "pending"}>
                    Reject
                  </button>
                  <button onClick={() => approveTask(t.id)} className="px-3 py-2 rounded-lg text-sm text-white bg-primary-600 hover:bg-primary-700" disabled={t.status !== "pending"}>
                    Approve
                  </button>
                  {t.status !== "pending" && (
                    <span className={`inline-flex items-center gap-1 text-xs ml-2 ${t.status === "approved" ? "text-emerald-600" : "text-rose-600"}`}>
                      {t.status === "approved" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {t.status[0].toUpperCase() + t.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Booking</h2>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><EllipsisVertical className="h-5 w-5 text-gray-400" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="px-5 py-3 font-medium">Package Name</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {initialBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={`https://i.pravatar.cc/32?u=${b.user}`} alt={b.user} className="h-8 w-8 rounded-full" />
                        <div className="text-gray-900 dark:text-gray-100">{b.pkg}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className="text-emerald-600">{b.type}</span></td>
                    <td className="px-5 py-3">$ {b.price}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700 ring-1 ring-amber-200">{b.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">View</button>
                    </td>
                  </tr>
                ))}
                {!initialBookings.length && (
                  <tr><td colSpan={5} className="px-5 py-6 text-center text-gray-500">No bookings to show</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
