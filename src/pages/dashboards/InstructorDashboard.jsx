// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import { Calendar, ClipboardList, Users } from 'lucide-react';
// // import Button from '@/components/ui/Button';
// // import { Card, CardHeader, CardContent } from '@/components/ui/Card';

// // export default function InstructorDashboard() {
// //   const sessions = [
// //     { id: 's1', title: 'Beginner Photography Walk', date: '2025-09-18', enrolled: 5 },
// //     { id: 's2', title: 'City Cycling Basics', date: '2025-09-24', enrolled: 8 },
// //   ];

// //   return (
// //     <div className="max-w-7xl mx-auto p-6 space-y-8">
// //       <header className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
// //           <p className="text-gray-600 dark:text-gray-400">Manage activities and upcoming sessions.</p>
// //         </div>
// //         <div className="flex gap-3">
// //           <Button as={Link} to="/activities/new">
// //             <ClipboardList className="h-4 w-4 mr-2" /> New Activity
// //           </Button>
// //           <Button as={Link} to="/calendar" variant="secondary">
// //             <Calendar className="h-4 w-4 mr-2" /> Calendar
// //           </Button>
// //         </div>
// //       </header>

// //       <Card>
// //         <CardHeader className="font-semibold">Upcoming Sessions</CardHeader>
// //         <CardContent className="space-y-3">
// //           {sessions.map((s) => (
// //             <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
// //               <div>
// //                 <div className="font-semibold">{s.title}</div>
// //                 <div className="text-sm text-gray-600 dark:text-gray-400">{s.date}</div>
// //               </div>
// //               <div className="inline-flex items-center gap-2 text-sm">
// //                 <Users className="h-4 w-4" /> {s.enrolled} enrolled
// //               </div>
// //             </div>
// //           ))}
// //           {sessions.length === 0 && (
// //             <div className="text-sm text-gray-500">No sessions scheduled.</div>
// //           )}
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }
// import React from "react";
// import { ClipboardList, Calendar, Users, ThumbsUp } from "lucide-react";
// import Sidebar from "@/components/Layout/Sidebar";
// import StatCard from "@/components/Layout/StatCard";

// export default function InstructorDashboard() {
//   const links = [
//     { to: "/instructor/activities", label: "Activities", icon: ClipboardList },
//     { to: "/instructor/calendar", label: "Calendar", icon: Calendar },
//   ];

//   const kpis = [
//     { icon: ClipboardList, label: "Total Activities", value: "32", color: "primary" },
//     { icon: Calendar, label: "Upcoming Sessions", value: "7", color: "blue" },
//     { icon: Users, label: "Enrolled Users", value: "240", color: "green" },
//     { icon: ThumbsUp, label: "Avg Feedback", value: "4.6/5", color: "purple" },
//   ];

//   return (
//     <div className="flex">
//       <Sidebar links={links} />
//       <main className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
//         <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {kpis.map((k) => <StatCard key={k.label} {...k} />)}
//         </div>
//       </main>
//     </div>
//   );
// }










// InstructorDashboard.jsx
import React from "react";
import { ClipboardList, Calendar, Users, ThumbsUp } from "lucide-react";
import Sidebar from "@/components/Layout/Sidebar";
import StatCard from "@/components/Layout/StatCard";

export default function InstructorDashboard() {
  const links = [
    { to: "/instructor/activities", label: "Activities", icon: ClipboardList },
    { to: "/instructor/calendar", label: "Calendar", icon: Calendar },
  ];

  const kpis = [
    { icon: ClipboardList, label: "Total Activities", value: "32", color: "primary" },
    { icon: Calendar, label: "Upcoming Sessions", value: "7", color: "blue" },
    { icon: Users, label: "Enrolled Users", value: "240", color: "green" },
    { icon: ThumbsUp, label: "Avg Feedback", value: "4.6/5", color: "purple" },
  ];

  return (
    <div className="flex">
      <Sidebar links={links} />
      <main className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((k) => <StatCard key={k.label} {...k} />)}
        </div>
      </main>
    </div>
  );
}