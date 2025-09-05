// // // import React from 'react';
// // // import { Link } from 'react-router-dom';
// // // import { Users, Shield, MapPin, ListChecks, Settings } from 'lucide-react';
// // // import Button from '@/components/ui/Button';
// // // import { Card, CardHeader, CardContent } from '@/components/ui/Card';

// // // export default function AdminDashboard() {
// // //   return (
// // //     <div className="max-w-7xl mx-auto p-6 space-y-8">
// // //       <header className="flex items-center justify-between">
// // //         <div>
// // //           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
// // //           <p className="text-gray-600 dark:text-gray-400">Platform controls & quick actions.</p>
// // //         </div>
// // //         <Button as={Link} to="/settings">
// // //           <Settings className="h-4 w-4 mr-2" /> Settings
// // //         </Button>
// // //       </header>

// // //       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // //         <Card>
// // //           <CardHeader className="font-semibold">Users</CardHeader>
// // //           <CardContent className="space-y-3">
// // //             <div className="flex justify-between text-sm">
// // //               <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> Total users</span>
// // //               <span className="font-medium">—</span>
// // //             </div>
// // //             <div className="flex justify-between text-sm">
// // //               <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4" /> Admins</span>
// // //               <span className="font-medium">—</span>
// // //             </div>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader className="font-semibold">Content</CardHeader>
// // //           <CardContent className="space-y-3">
// // //             <div className="flex justify-between text-sm">
// // //               <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Places</span>
// // //               <span className="font-medium">—</span>
// // //             </div>
// // //             <div className="flex justify-between text-sm">
// // //               <span className="inline-flex items-center gap-2"><ListChecks className="h-4 w-4" /> Activities</span>
// // //               <span className="font-medium">—</span>
// // //             </div>
// // //           </CardContent>
// // //         </Card>

// // //         <Card>
// // //           <CardHeader className="font-semibold">Quick Links</CardHeader>
// // //           <CardContent className="grid gap-2">
// // //             <Button as={Link} to="/admin/places" variant="secondary">Manage Places</Button>
// // //             <Button as={Link} to="/admin/activities" variant="secondary">Manage Activities</Button>
// // //             <Button as={Link} to="/admin/users" variant="secondary">Manage Users</Button>
// // //           </CardContent>
// // //         </Card>
// // //       </section>
// // //     </div>
// // //   );
// // // }
// // // FILE: AdminDashboard.jsx
// // import React, { useEffect, useMemo, useRef, useState } from "react";
// // import {
// //   Users, Shield, MapPin, ListChecks, Settings, TrendingUp, AlertCircle,
// //   RefreshCw, SlidersHorizontal, Search, X, Bell, HelpCircle, Check, Filter
// // } from "lucide-react";
// // import {
// //   AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// // } from "recharts";

// // const LS_KEY = "adminDash.prefs.v1";
// // const timeframes = [
// //   { id: "7d", label: "Last 7 days" },
// //   { id: "30d", label: "Last 30 days" },
// //   { id: "90d", label: "Last 90 days" },
// //   { id: "ytd", label: "Year to date" },
// // ];

// // export default function AdminDashboard() {
// //   // ---------- Preferences ----------
// //   const [prefs, setPrefs] = useState(() => {
// //     try { return JSON.parse(localStorage.getItem(LS_KEY)) || { timeframe: "30d", compact: false }; }
// //     catch { return { timeframe: "30d", compact: false }; }
// //   });
// //   useEffect(() => localStorage.setItem(LS_KEY, JSON.stringify(prefs)), [prefs]);

// //   // ---------- State ----------
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isHelpOpen, setHelpOpen] = useState(false);
// //   const [searchText, setSearchText] = useState("");
// //   const [activeFilter, setActiveFilter] = useState("all"); // all|users|admins|places|activities
// //   const [alerts, setAlerts] = useState([
// //     { id: "a1", level: "warn", text: "2 activities pending moderation" },
// //     { id: "a2", level: "info", text: "New platform update available" },
// //   ]);

// //   // ---------- Mock fetch + realtime tick ----------
// //   const [metrics, setMetrics] = useState({ users: 0, admins: 0, places: 0, activities: 0 });
// //   const [activityFeed, setActivityFeed] = useState([]);
// //   const mockFetch = async () => {
// //     setIsLoading(true);
// //     // simulate fetch latency
// //     await new Promise(r => setTimeout(r, 450));
// //     setMetrics({ users: 1428, admins: 12, places: 86, activities: 312 });
// //     setActivityFeed([
// //       { id: 11, text: "New user registered: Meera N.", time: "2m ago", type: "users" },
// //       { id: 10, text: "Place approved: Fort Kochi", time: "15m ago", type: "places" },
// //       { id: 9, text: "Activity created: Old Delhi Food Walk", time: "22m ago", type: "activities" },
// //       { id: 8, text: "Admin role granted to @ops.kunal", time: "1h ago", type: "admins" },
// //     ]);
// //     setIsLoading(false);
// //   };
// //   useEffect(() => { mockFetch(); }, [prefs.timeframe]);

// //   // realtime “tick”
// //   useEffect(() => {
// //     const t = setInterval(() => {
// //       setMetrics(m => ({ ...m, users: m.users + Math.floor(Math.random() * 3) })); // gentle drift
// //     }, 5000);
// //     return () => clearInterval(t);
// //   }, []);

// //   // ---------- Charts (mocked by timeframe) ----------
// //   const trendData = useMemo(() => {
// //     const base = { "7d": 7, "30d": 12, "90d": 12, "ytd": 12 }[prefs.timeframe] || 12;
// //     return Array.from({ length: base }).map((_, i) => ({
// //       label: prefs.timeframe === "7d" ? `D${i + 1}` : `W${i + 1}`,
// //       users: 100 + i * 20 + (i % 2 ? 15 : -10),
// //       activities: 40 + i * 10 + (i % 3 ? 14 : -6),
// //     }));
// //   }, [prefs.timeframe]);

// //   // ---------- Derived + filters ----------
// //   const kpis = [
// //     { key: "users", label: "Total Users", value: metrics.users, icon: Users },
// //     { key: "admins", label: "Admins", value: metrics.admins, icon: Shield },
// //     { key: "places", label: "Places", value: metrics.places, icon: MapPin },
// //     { key: "activities", label: "Activities", value: metrics.activities, icon: ListChecks },
// //   ];

// //   const filteredFeed = activityFeed.filter(i =>
// //     (activeFilter === "all" || i.type === activeFilter) &&
// //     (searchText.trim() ? i.text.toLowerCase().includes(searchText.toLowerCase()) : true)
// //   );

// //   // ---------- Keyboard shortcuts ----------
// //   const searchRef = useRef(null);
// //   useEffect(() => {
// //     const onKey = (e) => {
// //       if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
// //         e.preventDefault();
// //         searchRef.current?.focus();
// //       }
// //       if (e.key.toLowerCase() === "r" && (e.metaKey || e.ctrlKey)) {
// //         e.preventDefault();
// //         mockFetch();
// //       }
// //       if (e.key === "?" && (e.metaKey || e.ctrlKey)) {
// //         e.preventDefault();
// //         setHelpOpen(true);
// //       }
// //     };
// //     window.addEventListener("keydown", onKey);
// //     return () => window.removeEventListener("keydown", onKey);
// //   }, []);

// //   // ---------- Helpers ----------
// //   const removeAlert = (id) => setAlerts(a => a.filter(x => x.id !== id));
// //   const classCard = "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900";
// //   const label = (s) => s[0].toUpperCase() + s.slice(1);

// //   return (
// //     <div className={`max-w-7xl mx-auto p-6 space-y-8 ${prefs.compact ? "text-[15px]" : ""}`}>
// //       {/* Header */}
// //       <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
// //           <p className="text-sm text-gray-600 dark:text-gray-400">Platform controls & quick actions.</p>
// //         </div>

// //         <div className="flex flex-wrap items-center gap-2">
// //           {/* Timeframe */}
// //           <div className={`${classCard} px-3 py-2 flex items-center gap-2`}>
// //             <Filter className="h-4 w-4" />
// //             <select
// //               value={prefs.timeframe}
// //               onChange={(e) => setPrefs(p => ({ ...p, timeframe: e.target.value }))}
// //               className="bg-transparent outline-none"
// //               aria-label="Select timeframe"
// //             >
// //               {timeframes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
// //             </select>
// //           </div>

// //           {/* Compact toggle */}
// //           <button
// //             onClick={() => setPrefs(p => ({ ...p, compact: !p.compact }))}
// //             className={`${classCard} px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 inline-flex items-center gap-2`}
// //             aria-pressed={prefs.compact}
// //           >
// //             <SlidersHorizontal className="h-4 w-4" />
// //             <span>{prefs.compact ? "Compact" : "Comfort"}</span>
// //           </button>

// //           {/* Settings */}
// //           <a
// //             href="/settings"
// //             className="inline-flex items-center rounded-xl px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90"
// //           >
// //             <Settings className="h-4 w-4 mr-2" /> Settings
// //           </a>

// //           {/* Refresh */}
// //           <button
// //             onClick={mockFetch}
// //             className={`${classCard} px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 inline-flex items-center gap-2`}
// //             aria-label="Refresh (Ctrl/Cmd+R)"
// //           >
// //             <RefreshCw className="h-4 w-4" /> Refresh
// //           </button>

// //           {/* Help */}
// //           <button onClick={() => setHelpOpen(true)} className={`${classCard} p-2`} aria-label="Open help">
// //             <HelpCircle className="h-4 w-4" />
// //           </button>
// //         </div>
// //       </header>

// //       {/* KPI Cards */}
// //       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //         {kpis.map(({ key, label: lab, value, icon: Icon }) => (
// //           <button
// //             key={key}
// //             onClick={() => setActiveFilter(activeFilter === key ? "all" : key)}
// //             className={`${classCard} p-5 hover:shadow-sm transition-shadow text-left`}
// //             aria-pressed={activeFilter === key}
// //           >
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-sm text-gray-600 dark:text-gray-400">{lab}</p>
// //                 <p className="mt-1 text-3xl font-semibold">{isLoading ? "…" : value}</p>
// //               </div>
// //               <div className="rounded-xl p-2 bg-gray-100 dark:bg-gray-800">
// //                 <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
// //               </div>
// //             </div>
// //             <div className="mt-3 flex items-center text-xs text-emerald-600">
// //               <TrendingUp className="h-4 w-4 mr-1" /> Click to {activeFilter === key ? "clear filter" : `filter ${label(key)}`}
// //             </div>
// //           </button>
// //         ))}
// //       </section>

// //       {/* Charts */}
// //       <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
// //         <div className={`${classCard} xl:col-span-2`}>
// //           <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Growth Trend</div>
// //           <div className="p-5 h-72">
// //             <ResponsiveContainer width="100%" height="100%">
// //               <AreaChart data={trendData}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="label" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Area type="monotone" dataKey="users" stroke="#6366F1" fill="#A5B4FC" name="Users" />
// //                 <Area type="monotone" dataKey="activities" stroke="#22C55E" fill="#BBF7D0" name="Activities" />
// //               </AreaChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>

// //         <div className={classCard}>
// //           <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Content Mix</div>
// //           <div className="p-5 h-72">
// //             <ResponsiveContainer width="100%" height="100%">
// //               <BarChart data={[
// //                 { name: "Places", value: metrics.places },
// //                 { name: "Activities", value: metrics.activities },
// //               ]}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="name" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Bar dataKey="value" fill="#10B981" />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Search + Alerts + Activity */}
// //       <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         <div className={`${classCard} lg:col-span-2`}>
// //           <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
// //             <span className="font-semibold">Recent Activity</span>
// //             <div className="flex items-center gap-2">
// //               <div className="relative">
// //                 <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-500" />
// //                 <input
// //                   ref={searchRef}
// //                   value={searchText}
// //                   onChange={(e) => setSearchText(e.target.value)}
// //                   placeholder="Search activity (/)"
// //                   className="pl-8 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
// //                 />
// //                 {searchText && (
// //                   <button className="absolute right-2 top-2.5 text-gray-500" onClick={() => setSearchText("")} aria-label="Clear">
// //                     <X className="h-4 w-4" />
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //           <div className="p-5 space-y-3 text-sm">
// //             {isLoading ? (
// //               <div className="animate-pulse text-gray-500">Loading activity…</div>
// //             ) : filteredFeed.length ? (
// //               filteredFeed.map((i) => (
// //                 <div key={i.id} className="flex items-center justify-between border-b last:border-0 border-gray-100 dark:border-gray-800 pb-3">
// //                   <span>{i.text}</span>
// //                   <span className="text-gray-500">{i.time}</span>
// //                 </div>
// //               ))
// //             ) : (
// //               <div className="text-gray-500">No activity matches.</div>
// //             )}
// //           </div>
// //         </div>

// //         <div className={classCard}>
// //           <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Alerts</div>
// //           <div className="p-5 space-y-3">
// //             {alerts.length === 0 ? (
// //               <div className="text-sm text-gray-500">All clear.</div>
// //             ) : alerts.map(a => (
// //               <div key={a.id} className="flex items-start gap-2 text-sm border rounded-lg p-3 border-amber-200 dark:border-amber-900/40">
// //                 <Bell className="h-4 w-4 mt-0.5 text-amber-500" />
// //                 <div className="flex-1">{a.text}</div>
// //                 <button onClick={() => removeAlert(a.id)} aria-label="Dismiss"><X className="h-4 w-4 text-gray-400" /></button>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Quick Links */}
// //       <section className={classCard}>
// //         <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Quick Links</div>
// //         <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
// //           {[
// //             { to: "/admin/places", label: "Manage Places", icon: MapPin },
// //             { to: "/admin/activities", label: "Manage Activities", icon: ListChecks },
// //             { to: "/admin/users", label: "Manage Users", icon: Users },
// //             { to: "/settings", label: "Platform Settings", icon: Settings },
// //           ].map((q) => (
// //             <a key={q.to} href={q.to} className="inline-flex items-center rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
// //               <q.icon className="h-4 w-4 mr-2" /> {q.label}
// //             </a>
// //           ))}
// //         </div>
// //       </section>

// //       {/* Help modal */}
// //       {isHelpOpen && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center">
// //           <div className="absolute inset-0 bg-black/40" onClick={() => setHelpOpen(false)} />
// //           <div className={`${classCard} relative w-full max-w-lg p-6`}>
// //             <button onClick={() => setHelpOpen(false)} className="absolute right-3 top-3" aria-label="Close"><X className="h-5 w-5" /></button>
// //             <h3 className="text-lg font-semibold mb-4">Shortcuts & Tips</h3>
// //             <ul className="space-y-2 text-sm">
// //               <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">/</kbd> focus search</li>
// //               <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">⌘/Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">R</kbd> refresh</li>
// //               <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Click any KPI to filter the activity feed</li>
// //             </ul>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import React, { useState } from "react";
// import { Users, ShoppingCart, DollarSign, ClipboardList, BarChart } from "lucide-react";
// import Sidebar from "@/components/Layout/Sidebar";
// import StatCard from "@/components/Layout/StatCard";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
// import Modal from "@/components/ui/Modal";

// export default function AdminDashboard() {
//   const [loading, setLoading] = useState(false);
//   const [openModal, setOpenModal] = useState(false);

//   const links = [
//     { to: "/admin/users", label: "Users", icon: Users },
//     { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
//     { to: "/admin/revenue", label: "Revenue", icon: DollarSign },
//     { to: "/admin/activities", label: "Activities", icon: ClipboardList },
//     { to: "/admin/analytics", label: "Analytics", icon: BarChart },
//   ];

//   const kpis = [
//     { icon: Users, label: "Total Users", value: "12,345", color: "primary" },
//     { icon: DollarSign, label: "Revenue", value: "$98,400", color: "green" },
//     { icon: ShoppingCart, label: "Orders", value: "1,240", color: "blue" },
//     { icon: ClipboardList, label: "Activities", value: "320", color: "purple" },
//   ];

//   return (
//     <div className="flex">
//       <Sidebar links={links} />
//       <main className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//           <Button onClick={() => setOpenModal(true)}>+ New Report</Button>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           {loading
//             ? Array(4).fill(0).map((_, i) => (
//                 <LoadingSkeleton key={i} className="h-24 rounded-xl" />
//               ))
//             : kpis.map((k) => <StatCard key={k.label} {...k} />)}
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <LoadingSkeleton className="h-20 w-full rounded-lg" variant="shimmer" />
//             ) : (
//               <p className="text-gray-500">Charts, tables, or logs go here...</p>
//             )}
//           </CardContent>
//         </Card>

//         <Modal isOpen={openModal} onClose={() => setOpenModal(false)} title="Create Report">
//           <p className="text-gray-600 dark:text-gray-300">Form for new report goes here.</p>
//           <div className="mt-4 flex justify-end gap-2">
//             <Button variant="secondary" onClick={() => setOpenModal(false)}>Cancel</Button>
//             <Button onClick={() => setOpenModal(false)}>Save</Button>
//           </div>
//         </Modal>
//       </main>
//     </div>
//   );
// }








// AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Users, Shield, MapPin, ListChecks, Settings, TrendingUp, AlertCircle,
  RefreshCw, Search, X, Bell, HelpCircle, Check, Filter
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const LS_KEY = "adminDash.prefs.v1";
const timeframes = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "ytd", label: "Year to date" },
];

export default function AdminDashboard() {
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || { timeframe: "30d", compact: false }; }
    catch { return { timeframe: "30d", compact: false }; }
  });
  useEffect(() => localStorage.setItem(LS_KEY, JSON.stringify(prefs)), [prefs]);

  const [isLoading, setIsLoading] = useState(true);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [alerts, setAlerts] = useState([
    { id: "a1", level: "warn", text: "2 activities pending moderation" },
    { id: "a2", level: "info", text: "New platform update available" },
  ]);

  const [metrics, setMetrics] = useState({ users: 0, admins: 0, places: 0, activities: 0 });
  const [activityFeed, setActivityFeed] = useState([]);

  const mockFetch = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 450));
    setMetrics({ users: 1428, admins: 12, places: 86, activities: 312 });
    setActivityFeed([
      { id: 11, text: "New user registered: Meera N.", time: "2m ago", type: "users" },
      { id: 10, text: "Place approved: Fort Kochi", time: "15m ago", type: "places" },
      { id: 9, text: "Activity created: Old Delhi Food Walk", time: "22m ago", type: "activities" },
      { id: 8, text: "Admin role granted to @ops.kunal", time: "1h ago", type: "admins" },
      { id: 7, text: "User reported issue with booking #B2948", time: "2h ago", type: "users" },
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    mockFetch();
    const interval = setInterval(() => {
      setActivityFeed((feed) => [
        { id: Math.random(), text: "New event: " + ["user joined", "place added", "activity created"][Math.floor(Math.random() * 3)], time: "just now", type: ["users", "places", "activities"][Math.floor(Math.random() * 3)] },
        ...feed.slice(0, 9),
      ]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredFeed = useMemo(() => activityFeed.filter(a => activeFilter === "all" || a.type === activeFilter), [activityFeed, activeFilter]);

  const chartData = useMemo(() => {
    const len = { "7d": 7, "30d": 30, "90d": 90, "ytd": 365 }[prefs.timeframe] || 30;
    return Array.from({ length: len }).map((_, i) => ({ day: i + 1, users: Math.round(Math.random() * 100 + 50), activities: Math.round(Math.random() * 20 + 10) }));
  }, [prefs.timeframe]);

  const classCard = "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Platform overview and controls.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={mockFetch} className={`${classCard} px-3 py-2 inline-flex items-center gap-2`}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={() => setHelpOpen(true)} className={`${classCard} px-3 py-2 inline-flex items-center gap-2`}>
            <HelpCircle className="h-4 w-4" /> Help
          </button>
        </div>
      </header>
      {alerts.length ? (
        <section className="space-y-2">
          {alerts.map(a => (
            <div key={a.id} className={`${classCard} p-4 flex items-center gap-3 text-sm ${a.level === "warn" ? "bg-amber-50 dark:bg-amber-900/30" : "bg-blue-50 dark:bg-blue-900/30"}`}>
              <AlertCircle className="h-4 w-4" />
              {a.text}
              <button onClick={() => setAlerts(as => as.filter(b => b.id !== a.id))} className="ml-auto"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </section>
      ) : null}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <button onClick={() => setActiveFilter("users")} className={classCard}>
          <div className="p-5 space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            <div className="text-3xl font-bold">{metrics.users}</div>
          </div>
        </button>
        <button onClick={() => setActiveFilter("admins")} className={classCard}>
          <div className="p-5 space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400">Admins</div>
            <div className="text-3xl font-bold">{metrics.admins}</div>
          </div>
        </button>
        <button onClick={() => setActiveFilter("places")} className={classCard}>
          <div className="p-5 space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400">Places</div>
            <div className="text-3xl font-bold">{metrics.places}</div>
          </div>
        </button>
        <button onClick={() => setActiveFilter("activities")} className={classCard}>
          <div className="p-5 space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400">Activities</div>
            <div className="text-3xl font-bold">{metrics.activities}</div>
          </div>
        </button>
      </section>
      <section className={classCard}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="font-semibold">Growth Trend</div>
          <select value={prefs.timeframe} onChange={(e) => setPrefs(p => ({ ...p, timeframe: e.target.value }))} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-sm">
            {timeframes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <div className="p-5 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="activities" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className={classCard}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Activity Feed</div>
        <div className="px-5 pt-4 flex gap-2 mb-4">
          <button onClick={() => setActiveFilter("all")} className={activeFilter === "all" ? "font-medium" : ""}>All</button>
          <button onClick={() => setActiveFilter("users")} className={activeFilter === "users" ? "font-medium" : ""}>Users</button>
          <button onClick={() => setActiveFilter("admins")} className={activeFilter === "admins" ? "font-medium" : ""}>Admins</button>
          <button onClick={() => setActiveFilter("places")} className={activeFilter === "places" ? "font-medium" : ""}>Places</button>
          <button onClick={() => setActiveFilter("activities")} className={activeFilter === "activities" ? "font-medium" : ""}>Activities</button>
        </div>
        <div className="px-5 pb-5 space-y-4 text-sm">
          {filteredFeed.map(a => (
            <div key={a.id} className="flex items-center gap-2">
              <div className="flex-1">{a.text}</div>
              <div className="text-gray-500">{a.time}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={classCard}>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Quick Links</div>
          <div className="p-5 grid gap-2">
            {[
              { to: "/admin/users", label: "Manage Users", icon: Users },
              { to: "/admin/places", label: "Manage Places", icon: MapPin },
              { to: "/admin/activities", label: "Manage Activities", icon: ListChecks },
              { to: "/admin/settings", label: "Settings", icon: Settings },
            ].map((q) => (
              <a key={q.to} href={q.to} className="inline-flex items-center rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <q.icon className="h-4 w-4 mr-2" /> {q.label}
              </a>
            ))}
          </div>
        </div>
      </section>
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setHelpOpen(false)} />
          <div className={`${classCard} relative w-full max-w-lg p-6`}>
            <button onClick={() => setHelpOpen(false)} className="absolute right-3 top-3" aria-label="Close"><X className="h-5 w-5" /></button>
            <h3 className="text-lg font-semibold mb-4">Shortcuts & Tips</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">/</kbd> focus search</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">⌘/Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">R</kbd> refresh</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Click any KPI to filter the activity feed</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}