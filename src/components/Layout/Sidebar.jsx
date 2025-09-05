// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Home, Menu, X } from "lucide-react";

// export default function Sidebar({ links = [], variant = "dark" }) {
//   const [open, setOpen] = useState(false);

//   // Background classes based on variant
//   const bgClass =
//     variant === "dark"
//       ? "bg-gray-900 text-gray-200"
//       : "bg-white text-gray-800 border-r border-gray-200";

//   const linkHoverClass =
//     variant === "dark"
//       ? "hover:text-white"
//       : "hover:text-primary-600";

//   return (
//     <>
//       {/* Mobile Toggle Button */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="md:hidden fixed top-4 left-4 z-50 bg-primary-600 text-white p-2 rounded-lg"
//       >
//         {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`fixed md:static top-0 left-0 h-full w-64 p-6 space-y-6 transform transition-transform duration-300 z-40 ${bgClass} ${
//           open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         }`}
//       >
//         <Link
//           to="/"
//           className="flex items-center gap-2 font-bold text-lg"
//           onClick={() => setOpen(false)}
//         >
//           <Home className="h-5 w-5" /> Home
//         </Link>

//         <nav className="space-y-4">
//           {links.map(({ to, label, icon: Icon }) => (
//             <Link
//               key={to}
//               to={to}
//               className={`flex items-center gap-2 transition-colors ${linkHoverClass}`}
//               onClick={() => setOpen(false)}
//             >
//               <Icon className="h-5 w-5" /> {label}
//             </Link>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// }

// FILE: Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Menu,
  X,
  LogOut,
  Settings,
  Users,
  ClipboardList,
  Calendar,
  MapPin,
  DollarSign,
  Star,
} from "lucide-react";

const roleMenus = {
  admin: [
    {
      section: "Management",
      items: [
        { to: "/admin/users", label: "Users", icon: Users },
        { to: "/admin/activities", label: "Activities", icon: ClipboardList },
        { to: "/admin/places", label: "Places", icon: MapPin },
      ],
    },
    {
      section: "System",
      items: [{ to: "/admin/settings", label: "Settings", icon: Settings }],
    },
  ],
  advisor: [
    {
      section: "Campaigns",
      items: [
        { to: "/advisor/campaigns", label: "My Campaigns", icon: ClipboardList },
        { to: "/advisor/reports", label: "Reports", icon: Star },
      ],
    },
  ],
  guide: [
    {
      section: "Tours",
      items: [
        { to: "/guide/tours", label: "My Tours", icon: MapPin },
        { to: "/guide/bookings", label: "Bookings", icon: Calendar },
        { to: "/guide/earnings", label: "Earnings", icon: DollarSign },
      ],
    },
  ],
  instructor: [
    {
      section: "Teaching",
      items: [
        { to: "/instructor/activities", label: "Activities", icon: ClipboardList },
        { to: "/instructor/calendar", label: "Calendar", icon: Calendar },
      ],
    },
  ],
  traveller: [
    {
      section: "Explore",
      items: [
        { to: "/traveller/bookings", label: "My Bookings", icon: Calendar },
        { to: "/traveller/wishlist", label: "Wishlist", icon: Star },
        { to: "/traveller/reviews", label: "Reviews", icon: Star },
      ],
    },
  ],
};

export default function Sidebar({
  role,
  links,
  variant = "dark",
  footerLinks = [
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/logout", label: "Logout", icon: LogOut },
  ],
  collapsible = true,
}) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const bgClass =
    variant === "dark"
      ? "bg-gray-900 text-gray-200"
      : "bg-white text-gray-800 border-r border-gray-200";

  const linkHoverClass =
    variant === "dark" ? "hover:text-white" : "hover:text-primary-600";

  const rawLinks = links || roleMenus[role] || [];
  const normalizedLinks = rawLinks[0]?.items
    ? rawLinks
    : [{ section: null, items: rawLinks }];

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
        aria-expanded={open}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary-600 text-white p-2 rounded-lg shadow-md"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={`fixed md:static top-0 left-0 h-full ${
          collapsed ? "w-20" : "w-64"
        } p-6 flex flex-col justify-between transform transition-transform duration-300 z-40 ${bgClass} ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        role="navigation"
        aria-label="Sidebar"
      >
        <div>
          <Link
            to="/"
            className={`flex items-center gap-2 font-bold text-lg mb-6 ${
              collapsed ? "justify-center" : ""
            }`}
            onClick={() => setOpen(false)}
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            {!collapsed && "Home"}
          </Link>

          <nav className="space-y-6">
            {normalizedLinks.map((group, idx) => (
              <div key={idx}>
                {!collapsed && group.section && (
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    {group.section}
                  </div>
                )}
                <div className="space-y-2">
                  {group.items.map(({ to, label, icon: Icon }) => {
                    const active = location.pathname.startsWith(to);
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          active
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                            : linkHoverClass
                        } ${collapsed ? "justify-center" : ""}`}
                        onClick={() => setOpen(false)}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        {!collapsed && <span>{label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="space-y-2 mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          {footerLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${linkHoverClass} ${
                collapsed ? "justify-center" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full text-sm mt-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              {collapsed ? "Expand →" : "← Collapse"}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
