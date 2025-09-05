// // // FILE: AdvisorDashboard.jsx
// // import React, { useEffect, useMemo, useRef, useState } from "react";
// // import {
// //   Megaphone, BarChart3, PlusCircle, TrendingUp, MousePointerClick, Search, Filter,
// //   Pencil, Check, X, RefreshCw, ChevronDown
// // } from "lucide-react";
// // import {
// //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// // } from "recharts";

// // const STATUS = ["active", "paused", "draft", "completed"];

// // export default function AdvisorDashboard() {
// //   // ---------- Data (mock fetch) ----------
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [campaigns, setCampaigns] = useState([]);
// //   const [query, setQuery] = useState("");
// //   const [status, setStatus] = useState("all");
// //   const [sortBy, setSortBy] = useState({ key: "impressions", dir: "desc" });
// //   const [showNew, setShowNew] = useState(false);

// //   useEffect(() => {
// //     const fetch = async () => {
// //       setIsLoading(true);
// //       await new Promise(r => setTimeout(r, 350));
// //       setCampaigns([
// //         { id: "c1", name: "Summer Promo", status: "active", impressions: 1200, clicks: 96, weekly: [10,18,14,22,20,19,21,25,24,28,27,30] },
// //         { id: "c2", name: "Festival Week", status: "draft", impressions: 0, clicks: 0, weekly: [0,0,0,0,0,0,0,0,0,0,0,0] },
// //         { id: "c3", name: "Monsoon Push", status: "paused", impressions: 540, clicks: 30, weekly: [6,8,12,6,7,5,4,9,10,12,8,5] },
// //         { id: "c4", name: "Diwali Blast", status: "completed", impressions: 4200, clicks: 420, weekly: [20,30,35,40,45,50,55,60,50,45,40,35] },
// //       ]);
// //       setIsLoading(false);
// //     };
// //     fetch();
// //   }, []);

// //   // ---------- Derived ----------
// //   const filtered = useMemo(() => {
// //     let list = campaigns.filter(c =>
// //       (status === "all" ? true : c.status === status) &&
// //       (query.trim() ? c.name.toLowerCase().includes(query.toLowerCase()) : true)
// //     );
// //     const dir = sortBy.dir === "asc" ? 1 : -1;
// //     list.sort((a, b) => {
// //       const va = sortBy.key === "ctr" ? (a.impressions ? a.clicks / a.impressions : 0) : a[sortBy.key];
// //       const vb = sortBy.key === "ctr" ? (b.impressions ? b.clicks / b.impressions : 0) : b[sortBy.key];
// //       return (va > vb ? 1 : va < vb ? -1 : 0) * dir;
// //     });
// //     return list;
// //   }, [campaigns, status, query, sortBy]);

// //   const totals = useMemo(() => {
// //     const impressions = filtered.reduce((s, c) => s + (c.impressions || 0), 0);
// //     const clicks = filtered.reduce((s, c) => s + (c.clicks || 0), 0);
// //     const ctr = impressions ? (clicks / impressions) * 100 : 0;
// //     const active = filtered.filter(c => c.status === "active").length;
// //     return { impressions, clicks, ctr: ctr.toFixed(2), active };
// //   }, [filtered]);

// //   // ---------- Inline edit ----------
// //   const [editId, setEditId] = useState(null);
// //   const [editName, setEditName] = useState("");
// //   const startEdit = (c) => { setEditId(c.id); setEditName(c.name); };
// //   const commitEdit = () => {
// //     setCampaigns(cs => cs.map(c => c.id === editId ? { ...c, name: editName.trim() || c.name } : c));
// //     setEditId(null); setEditName("");
// //   };

// //   // ---------- Chart data ----------
// //   const chartData = useMemo(() => {
// //     // aggregate weekly impressions (simple avg across filtered)
// //     const weeks = 12;
// //     const arr = Array.from({ length: weeks }).map((_, i) => {
// //       const vals = filtered.map(c => c.weekly?.[i] ?? 0);
// //       const avg = vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length) : 0;
// //       return { week: `W${i + 1}`, avgImpr: Math.round(avg * 100) / 100 };
// //     });
// //     return arr;
// //   }, [filtered]);

// //   const classCard = "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900";

// //   return (
// //     <div className="max-w-7xl mx-auto p-6 space-y-8">
// //       {/* Header */}
// //       <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold">Advisor Dashboard</h1>
// //           <p className="text-gray-600 dark:text-gray-400">Run promotions and track performance.</p>
// //         </div>
// //         <div className="flex gap-2">
// //           <button onClick={() => setShowNew(true)} className="inline-flex items-center rounded-xl px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90">
// //             <PlusCircle className="h-4 w-4 mr-2" /> New Campaign
// //           </button>
// //           <button onClick={() => window.location.reload()} className={`${classCard} px-3 py-2 inline-flex items-center gap-2`}>
// //             <RefreshCw className="h-4 w-4" /> Refresh
// //           </button>
// //         </div>
// //       </header>

// //       {/* Top insights */}
// //       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         <div className={`${classCard} md:col-span-2`}>
// //           <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Your Campaigns</div>

// //           {/* Controls */}
// //           <div className="px-5 pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
// //             <div className="flex items-center gap-2">
// //               <div className="relative">
// //                 <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-500" />
// //                 <input
// //                   value={query}
// //                   onChange={(e) => setQuery(e.target.value)}
// //                   placeholder="Search campaigns…"
// //                   className="pl-8 pr-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
// //                 />
// //               </div>
// //               <div className={`${classCard} px-3 py-2 inline-flex items-center gap-2`}>
// //                 <Filter className="h-4 w-4" />
// //                 <select
// //                   value={status}
// //                   onChange={(e) => setStatus(e.target.value)}
// //                   className="bg-transparent outline-none"
// //                   aria-label="Filter status"
// //                 >
// //                   <option value="all">All statuses</option>
// //                   {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
// //                 </select>
// //               </div>
// //               <div className={`${classCard} px-3 py-2 inline-flex items-center gap-2`}>
// //                 <BarChart3 className="h-4 w-4" />
// //                 <select
// //                   value={`${sortBy.key}:${sortBy.dir}`}
// //                   onChange={(e) => {
// //                     const [k, d] = e.target.value.split(":");
// //                     setSortBy({ key: k, dir: d });
// //                   }}
// //                   className="bg-transparent outline-none"
// //                   aria-label="Sort by"
// //                 >
// //                   <option value="impressions:desc">Impressions ↓</option>
// //                   <option value="impressions:asc">Impressions ↑</option>
// //                   <option value="clicks:desc">Clicks ↓</option>
// //                   <option value="clicks:asc">Clicks ↑</option>
// //                   <option value="ctr:desc">CTR ↓</option>
// //                   <option value="ctr:asc">CTR ↑</option>
// //                 </select>
// //               </div>
// //             </div>
// //             <div className="text-sm text-gray-500">{filtered.length} campaign(s)</div>
// //           </div>

// //           {/* Table */}
// //           <div className="p-5">
// //             <div className="overflow-x-auto">
// //               <table className="w-full text-sm">
// //                 <thead>
// //                   <tr className="text-left text-gray-500">
// //                     <th className="pb-2 font-medium">Name</th>
// //                     <th className="pb-2 font-medium">Status</th>
// //                     <th className="pb-2 font-medium">Impressions</th>
// //                     <th className="pb-2 font-medium">Clicks</th>
// //                     <th className="pb-2 font-medium">CTR</th>
// //                     <th className="pb-2 font-medium"></th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {isLoading ? (
// //                     <tr><td colSpan={6} className="py-8 text-center text-gray-500">Loading…</td></tr>
// //                   ) : filtered.length === 0 ? (
// //                     <tr><td colSpan={6} className="py-8 text-center text-gray-500">No campaigns.</td></tr>
// //                   ) : filtered.map((c) => {
// //                     const ctr = c.impressions ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0.00";
// //                     return (
// //                       <tr key={c.id} className="border-t border-gray-100 dark:border-gray-800">
// //                         <td className="py-3">
// //                           {editId === c.id ? (
// //                             <div className="flex items-center gap-2">
// //                               <input value={editName} onChange={(e) => setEditName(e.target.value)} className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded" />
// //                               <button onClick={commitEdit} className="p-1 rounded bg-emerald-600 text-white"><Check className="h-4 w-4" /></button>
// //                               <button onClick={() => setEditId(null)} className="p-1 rounded border border-gray-300 dark:border-gray-700"><X className="h-4 w-4" /></button>
// //                             </div>
// //                           ) : (
// //                             <span className="font-medium">{c.name}</span>
// //                           )}
// //                         </td>
// //                         <td className="py-3 capitalize">{c.status}</td>
// //                         <td className="py-3">{c.impressions.toLocaleString()}</td>
// //                         <td className="py-3">{c.clicks.toLocaleString()}</td>
// //                         <td className="py-3">{ctr}%</td>
// //                         <td className="py-3 text-right">
// //                           {editId === c.id ? null : (
// //                             <button onClick={() => startEdit(c)} className="inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
// //                               <Pencil className="h-4 w-4 mr-1" /> Rename
// //                             </button>
// //                           )}
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>

// //         <div className={classCard}>
// //           <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Insights</div>
// //           <div className="p-5 space-y-3 text-sm">
// //             <Row icon={<BarChart3 className="h-4 w-4" />} label="Total Impressions" value={totals.impressions.toLocaleString()} />
// //             <Row icon={<MousePointerClick className="h-4 w-4" />} label="Total Clicks" value={totals.clicks.toLocaleString()} />
// //             <Row icon={<TrendingUp className="h-4 w-4" />} label="Average CTR" value={`${totals.ctr}%`} />
// //             <Row icon={<Megaphone className="h-4 w-4" />} label="Active Campaigns" value={totals.active} />
// //           </div>

// //           <div className="px-5 pt-2 pb-5">
// //             <div className="h-40">
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <LineChart data={chartData}>
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="week" />
// //                   <YAxis />
// //                   <Tooltip />
// //                   <Line type="monotone" dataKey="avgImpr" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
// //                 </LineChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* New campaign modal */}
// //       {showNew && <NewCampaignModal onClose={() => setShowNew(false)} onCreate={(c) => setCampaigns(s => [c, ...s])} />}
// //     </div>
// //   );
// // }

// // function Row({ icon, label, value }) {
// //   return (
// //     <div className="flex items-center justify-between">
// //       <span className="inline-flex items-center gap-2">{icon} {label}</span>
// //       <span className="font-medium">{value}</span>
// //     </div>
// //   );
// // }

// // function NewCampaignModal({ onClose, onCreate }) {
// //   const [name, setName] = useState("");
// //   const [status, setStatus] = useState("draft");
// //   const canCreate = name.trim().length >= 3;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center">
// //       <div className="absolute inset-0 bg-black/40" onClick={onClose} />
// //       <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
// //         <button className="absolute right-3 top-3" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
// //         <h3 className="text-lg font-semibold mb-4">Create Campaign</h3>

// //         <div className="space-y-4">
// //           <div>
// //             <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
// //             <input
// //               value={name}
// //               onChange={(e) => setName(e.target.value)}
// //               placeholder="e.g., Winter Offers"
// //               className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
// //             />
// //           </div>

// //           <div>
// //             <label className="text-sm text-gray-600 dark:text-gray-400">Status</label>
// //             <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent">
// //               {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
// //             </select>
// //           </div>

// //           <div className="flex justify-end gap-2 pt-2">
// //             <button onClick={onClose} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">Cancel</button>
// //             <button
// //               disabled={!canCreate}
// //               onClick={() => {
// //                 onCreate({
// //                   id: `c${Math.random().toString(36).slice(2, 7)}`,
// //                   name: name.trim(),
// //                   status,
// //                   impressions: 0, clicks: 0,
// //                   weekly: Array.from({ length: 12 }).map(() => 0),
// //                 });
// //                 onClose();
// //               }}
// //               className={`px-3 py-2 rounded-lg ${canCreate ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-200 text-gray-500"}`}
// //             >
// //               Create
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import React from "react";
// import { Users, ClipboardCheck, TrendingUp, DollarSign } from "lucide-react";
// import Sidebar from "@/components/Layout/Sidebar";
// import StatCard from "@/components/Layout/StatCard";

// export default function AdvisorDashboard() {
//   const links = [
//     { to: "/advisor/clients", label: "Clients", icon: Users },
//     { to: "/advisor/plans", label: "Plans", icon: ClipboardCheck },
//     { to: "/advisor/performance", label: "Performance", icon: TrendingUp },
//   ];

//   const kpis = [
//     { icon: Users, label: "Total Clients", value: "220", color: "primary" },
//     { icon: ClipboardCheck, label: "Active Plans", value: "58", color: "blue" },
//     { icon: TrendingUp, label: "Success Rate", value: "92%", color: "green" },
//     { icon: DollarSign, label: "Earnings", value: "$45,000", color: "purple" },
//   ];

//   return (
//     <div className="flex">
//       <Sidebar links={links} />
//       <main className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
//         <h1 className="text-2xl font-bold mb-6">Advisor Dashboard</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {kpis.map((k) => <StatCard key={k.label} {...k} />)}
//         </div>
//       </main>
//     </div>
//   );
// }










// AdvisorDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Megaphone, BarChart3, PlusCircle, TrendingUp, MousePointerClick, Search, Filter,
  Pencil, Check, X, RefreshCw
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const STATUS = ["active", "paused", "draft", "completed"];

export default function AdvisorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState({ key: "impressions", dir: "desc" });
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 350));
      setCampaigns([
        { id: "c1", name: "Summer Promo", status: "active", impressions: 1200, clicks: 96, weekly: [10,18,14,22,20,19,21,25,24,28,27,30] },
        { id: "c2", name: "Festival Week", status: "draft", impressions: 0, clicks: 0, weekly: [0,0,0,0,0,0,0,0,0,0,0,0] },
        { id: "c3", name: "Monsoon Push", status: "paused", impressions: 540, clicks: 30, weekly: [6,8,12,6,7,5,4,9,10,12,8,5] },
        { id: "c4", name: "Diwali Blast", status: "completed", impressions: 4200, clicks: 420, weekly: [20,30,35,40,45,50,55,60,50,45,40,35] },
      ]);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    let list = campaigns.filter(c =>
      (status === "all" ? true : c.status === status) &&
      (query.trim() ? c.name.toLowerCase().includes(query.toLowerCase()) : true)
    );
    const dir = sortBy.dir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const va = sortBy.key === "ctr" ? (a.impressions ? a.clicks / a.impressions : 0) : a[sortBy.key];
      const vb = sortBy.key === "ctr" ? (b.impressions ? b.clicks / b.impressions : 0) : b[sortBy.key];
      return (va > vb ? 1 : va < vb ? -1 : 0) * dir;
    });
    return list;
  }, [campaigns, status, query, sortBy]);

  const totals = useMemo(() => {
    const impressions = filtered.reduce((s, c) => s + (c.impressions || 0), 0);
    const clicks = filtered.reduce((s, c) => s + (c.clicks || 0), 0);
    const ctr = impressions ? (clicks / impressions) * 100 : 0;
    const active = filtered.filter(c => c.status === "active").length;
    return { impressions, clicks, ctr: ctr.toFixed(2), active };
  }, [filtered]);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const startEdit = (c) => { setEditId(c.id); setEditName(c.name); };
  const commitEdit = () => {
    setCampaigns(cs => cs.map(c => c.id === editId ? { ...c, name: editName.trim() || c.name } : c));
    setEditId(null); setEditName("");
  };

  const chartData = useMemo(() => {
    const weeks = 12;
    const arr = Array.from({ length: weeks }).map((_, i) => {
      const vals = filtered.map(c => c.weekly?.[i] ?? 0);
      const avg = vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length) : 0;
      return { week: `W${i + 1}`, avgImpr: Math.round(avg * 100) / 100 };
    });
    return arr;
  }, [filtered]);

  const classCard = "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Advisor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Run promotions and track performance.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNew(true)} className="inline-flex items-center rounded-xl px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90">
            <PlusCircle className="h-4 w-4 mr-2" /> New Campaign
          </button>
          <button onClick={() => window.location.reload()} className={`${classCard} px-3 py-2 inline-flex items-center gap-2`}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${classCard} md:col-span-2`}>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Your Campaigns</div>
          <div className="px-5 pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search campaigns..."
                  className="pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent min-w-[200px]"
                />
              </div>
              <div className="relative">
                <Filter className="h-4 w-4 absolute left-2 top-2.5 text-gray-500" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="pl-8 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
                >
                  <option value="all">All status</option>
                  {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              Sort by
              <button onClick={() => setSortBy(s => ({ key: "impressions", dir: s.dir === "asc" ? "desc" : "asc" }))}>Impressions</button>
              <button onClick={() => setSortBy(s => ({ key: "clicks", dir: s.dir === "asc" ? "desc" : "asc" }))}>Clicks</button>
              <button onClick={() => setSortBy(s => ({ key: "ctr", dir: s.dir === "asc" ? "desc" : "asc" }))}>CTR</button>
            </div>
          </div>
          <div className="px-5 pb-5">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filtered.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Impressions</th>
                    <th className="pb-3">Clicks</th>
                    <th className="pb-3">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3">
                        {editId === c.id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={commitEdit}
                            autoFocus
                            className="px-1 py-0.5 rounded bg-transparent border border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <span className="flex items-center gap-2">
                            {c.name}
                            <button onClick={() => startEdit(c)}><Pencil className="h-3 w-3" /></button>
                          </span>
                        )}
                      </td>
                      <td className="py-3 capitalize">{c.status}</td>
                      <td className="py-3">{c.impressions}</td>
                      <td className="py-3">{c.clicks}</td>
                      <td className="py-3">{c.impressions ? ((c.clicks / c.impressions) * 100).toFixed(1) + '%' : '0%'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">No campaigns found.</div>
            )}
          </div>
        </div>
        <div className={classCard}>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Stats</div>
          <div className="p-5 space-y-4 text-sm">
            <Row icon={<Megaphone className="h-4 w-4" />} label="Impressions" value={totals.impressions} />
            <Row icon={<MousePointerClick className="h-4 w-4" />} label="Clicks" value={totals.clicks} />
            <Row icon={<BarChart3 className="h-4 w-4" />} label="CTR" value={totals.ctr + '%'} />
            <Row icon={<TrendingUp className="h-4 w-4" />} label="Active" value={totals.active} />
          </div>
        </div>
      </section>
      <section className={classCard}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 font-semibold">Average Impressions</div>
        <div className="p-5 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgImpr" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      {showNew && <NewCampaignModal onClose={() => setShowNew(false)} onCreate={(c) => setCampaigns(s => [c, ...s])} />}
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2">{icon} {label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function NewCampaignModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("draft");
  const canCreate = name.trim().length >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <button className="absolute right-3 top-3" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        <h3 className="text-lg font-semibold mb-4">Create Campaign</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Winter Offers"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent">
              {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">Cancel</button>
            <button
              disabled={!canCreate}
              onClick={() => {
                onCreate({
                  id: `c${Math.random().toString(36).slice(2, 7)}`,
                  name: name.trim(),
                  status,
                  impressions: 0, clicks: 0,
                  weekly: Array.from({ length: 12 }).map(() => 0),
                });
                onClose();
              }}
              className={`px-3 py-2 rounded-lg ${canCreate ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-200 text-gray-500"}`}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}