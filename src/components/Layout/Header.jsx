// import { memo, useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   Search, Menu, X, LogOut, Bell, ChevronDown, Sun, Moon,
//   Sparkles, User, Clock, TrendingUp
// } from "lucide-react";
// import { useAuthStore } from "@/store/auth";
// import { useUIStore } from "@/store/ui";
// import Button from "@/components/ui/Button";

// /* Role → dashboard path */
// const roleToDashboard = Object.freeze({
//   admin: "/dashboard/admin",
//   advisor: "/dashboard/advisor",
//   guide: "/dashboard/guide",
//   instructor: "/dashboard/instructor",
//   traveller: "/dashboard/traveller",
// });

// /* Pretty buttons for auth actions */
// const premiumSolid =
//   "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white " +
//   "shadow-lg shadow-primary-500/20 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 " +
//   "hover:from-primary-600 hover:to-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 " +
//   "active:scale-[0.98] transition";
// const premiumGhost =
//   "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold border border-gray-200/70 " +
//   "bg-white/80 text-gray-900 hover:bg-white/95 dark:border-gray-700/70 dark:bg-gray-800/70 dark:text-gray-100 " +
//   "dark:hover:bg-gray-800/90 shadow-sm backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 transition";

// /* Mock seeds for suggestions (swap with API later) */
// const TRENDING = Object.freeze([
//   "Rome city tour", "Florence food tour", "Colosseum tickets",
//   "Vatican skip the line", "Amalfi boat trip", "Tuscany wine tasting",
// ]);
// const SEED_SUGGESTIONS = Object.freeze([
//   "Rome, Italy", "Florence, Italy", "Venice gondola", "Milan cathedral",
//   "Naples pizza tour", "Pompei day trip", "Cinque Terre hike",
//   "Sicily beaches", "Turin museums", "Bologna food market",
// ]);
// const MOCK_NOTIFICATIONS = Object.freeze([
//   { id: 1, title: "Booking Confirmed", message: "Your Rome City Tour is confirmed for tomorrow", time: "2h ago", unread: true },
//   { id: 2, title: "Tour Reminder", message: "Your Florence Food Tour starts in 1 hour", time: "1d ago", unread: false },
// ]);

// const RECENTS_KEY = "tg_recent_searches_v1";
// const MAX_RECENTS = 8;

// function Header() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   /* Stores */
//   const { user, isAuthenticated, logout } = useAuthStore((s) => ({
//     user: s.user,
//     isAuthenticated: s.isAuthenticated,
//     logout: s.logout,
//   }));
//   const {
//     isMobileMenuOpen = false,
//     setMobileMenuOpen = () => {},
//     searchQuery = "",
//     setSearchQuery = () => {},
//   } = useUIStore?.() || {};

//   /* UI state */
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [activeIdx, setActiveIdx] = useState(-1);

//   /* Theme (persist on <html>) */
//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem("theme");
//     return saved ? saved === "dark" : !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;
//   });
//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("theme", darkMode ? "dark" : "light");
//   }, [darkMode]);

//   /* Recents + debounce */
//   const [recents, setRecents] = useState(() => {
//     try {
//       const r = JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]");
//       return Array.isArray(r) ? r.slice(0, MAX_RECENTS) : [];
//     } catch { return []; }
//   });
//   const [debouncedQ, setDebouncedQ] = useState(searchQuery);
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedQ((searchQuery || "").trim()), 150);
//     return () => clearTimeout(t);
//   }, [searchQuery]);

//   /* Close popovers on route change / outside click / ESC */
//   const userMenuRef = useRef(null);
//   const notificationRef = useRef(null);
//   const searchWrapRef = useRef(null);
//   useEffect(() => {
//     setShowNotifications(false);
//     setShowUserMenu(false);
//     setShowSuggestions(false);
//     setActiveIdx(-1);
//   }, [location]);
//   useEffect(() => {
//     if (!(showUserMenu || showNotifications || showSuggestions)) return;
//     const onDown = (e) => {
//       if (
//         !userMenuRef.current?.contains(e.target) &&
//         !notificationRef.current?.contains(e.target) &&
//         !searchWrapRef.current?.contains(e.target)
//       ) {
//         setShowUserMenu(false);
//         setShowNotifications(false);
//         setShowSuggestions(false);
//         setActiveIdx(-1);
//       }
//     };
//     const onKey = (e) => e.key === "Escape" && onDown(e);
//     document.addEventListener("pointerdown", onDown, { passive: true });
//     document.addEventListener("keydown", onKey);
//     return () => {
//       document.removeEventListener("pointerdown", onDown);
//       document.removeEventListener("keydown", onKey);
//     };
//   }, [showUserMenu, showNotifications, showSuggestions]);

//   /* Suggestions */
//   const filtered = useMemo(() => {
//     const q = debouncedQ.toLowerCase();
//     if (!q) return [];
//     const ranked = SEED_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).sort((a, b) => a.localeCompare(b));
//     return [`Search “${debouncedQ}”`, ...ranked].slice(0, 8);
//   }, [debouncedQ]);
//   const suggestionItems = useMemo(
//     () => (debouncedQ ? filtered : [...recents, ...TRENDING.slice(0, 6)]),
//     [debouncedQ, filtered, recents]
//   );

//   const saveRecent = useCallback((value) => {
//     const v = value.trim();
//     if (!v) return;
//     const next = [v, ...recents.filter((r) => r.toLowerCase() !== v.toLowerCase())].slice(0, MAX_RECENTS);
//     setRecents(next);
//     localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
//   }, [recents]);

//   const clearRecents = useCallback(() => {
//     setRecents([]);
//     localStorage.removeItem(RECENTS_KEY);
//   }, []);

//   const navigateSearch = useCallback((value) => {
//     const q = (value || "").trim();
//     if (!q) return;
//     setSearchQuery(q);
//     saveRecent(q);
//     setShowSuggestions(false);
//     setActiveIdx(-1);
//     navigate(`/search?q=${encodeURIComponent(q)}`);
//   }, [navigate, saveRecent, setSearchQuery]);

//   const onKeyDownSearch = useCallback((e) => {
//     if (!suggestionItems.length) return;
//     if (e.key === "ArrowDown" || e.key === "ArrowUp") {
//       e.preventDefault();
//       setShowSuggestions(true);
//       setActiveIdx((i) =>
//         e.key === "ArrowDown" ? (i + 1) % suggestionItems.length : (i <= 0 ? suggestionItems.length - 1 : i - 1)
//       );
//     }
//     if (e.key === "Escape") {
//       setShowSuggestions(false);
//       setActiveIdx(-1);
//     }
//   }, [suggestionItems]);

//   const handleSubmit = useCallback((e) => {
//     e.preventDefault();
//     if (activeIdx >= 0 && suggestionItems[activeIdx]) {
//       const choice = suggestionItems[activeIdx];
//       navigateSearch(choice.startsWith("Search “") ? debouncedQ : choice);
//       return;
//     }
//     navigateSearch(debouncedQ || searchQuery);
//   }, [activeIdx, suggestionItems, navigateSearch, debouncedQ, searchQuery]);

//   const highlight = useCallback((label, q) => {
//     if (!q) return <>{label}</>;
//     const i = label.toLowerCase().indexOf(q.toLowerCase());
//     if (i === -1) return <>{label}</>;
//     return (
//       <>
//         {label.slice(0, i)}
//         <mark className="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">
//           {label.slice(i, i + q.length)}
//         </mark>
//         {label.slice(i + q.length)}
//       </>
//     );
//   }, []);

//   const renderGroup = useCallback((title, items, icon) => {
//     if (!items.length) return null;
//     return (
//       <div className="py-2">
//         <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
//           {icon}{title}
//         </div>
//         {items.map((label, idx) => {
//           const isActive = suggestionItems.indexOf(label) === activeIdx;
//           return (
//             <button
//               key={`${title}-${label}-${idx}`}
//               type="button"
//               onMouseEnter={() => setActiveIdx(suggestionItems.indexOf(label))}
//               onMouseDown={(e) => e.preventDefault()}
//               onClick={() => navigateSearch(label.startsWith("Search “") ? debouncedQ : label)}
//               className={`w-full text-left px-3 py-2.5 flex items-center gap-2 rounded-lg
//                 ${isActive ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"}
//                 transition-colors`}
//             >
//               <Search className="h-4 w-4 text-gray-500" />
//               <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
//                 {label.startsWith("Search “") ? label : highlight(label, debouncedQ)}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     );
//   }, [activeIdx, suggestionItems, navigateSearch, debouncedQ, highlight]);

//   const unreadCount = useMemo(
//     () => MOCK_NOTIFICATIONS.filter((n) => n.unread).length,
//     []
//   );

//   return (
//     <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">

//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3 group" aria-label="Go to home">
//             <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
//               <span className="text-white font-bold text-lg">TG</span>
//             </div>
//             <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">TourGuide</span>
//           </Link>

//           {/* Search (desktop) */}
//           <div ref={searchWrapRef} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
//             <form className="w-full relative" role="search" aria-label="Site search" onSubmit={handleSubmit}>
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" aria-hidden />
//               <input
//                 type="search"
//                 placeholder="Search destinations, activities..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setShowSuggestions(true)}
//                 onKeyDown={onKeyDownSearch}
//                 className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 shadow-sm"
//                 autoComplete="off"
//               />
//             </form>

//             {showSuggestions && (
//               <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
//                 <div className="max-h-[70vh] overflow-y-auto py-2">
//                   {debouncedQ ? (
//                     renderGroup("Suggestions", filtered, <Search className="h-3.5 w-3.5 text-gray-500" />)
//                   ) : (
//                     <>
//                       {renderGroup("Recent", recents, <Clock className="h-3.5 w-3.5 text-gray-500" />)}
//                       {!!recents.length && (
//                         <div className="flex justify-end px-3">
//                           <button
//                             onClick={clearRecents}
//                             className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                           >
//                             Clear recent
//                           </button>
//                         </div>
//                       )}
//                       {renderGroup("Popular searches", TRENDING.slice(0, 6), <TrendingUp className="h-3.5 w-3.5 text-gray-500" />)}
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right actions */}
//           <div className="flex items-center space-x-3 sm:space-x-4">
//             {/* Dark mode toggle */}
//             <button
//               onClick={() => setDarkMode((v) => !v)}
//               className="group relative p-[2px] rounded-full bg-gradient-to-r from-primary-500 to-primary-700 shadow-md"
//               aria-label="Toggle dark mode"
//               type="button"
//             >
//               <span className="flex items-center justify-between w-[72px] h-9 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur px-1.5 relative">
//                 <span className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-white dark:bg-gray-700 shadow transition-transform duration-300 ${darkMode ? "translate-x-[2.25rem]" : ""}`} />
//                 <Sun className={`h-4 w-4 z-10 ${darkMode ? "opacity-60" : "opacity-100"}`} />
//                 <Moon className={`h-4 w-4 z-10 ${darkMode ? "opacity-100" : "opacity-60"}`} />
//               </span>
//             </button>

//             {/* Notifications */}
//             {isAuthenticated && (
//               <div className="relative" ref={notificationRef}>
//                 <button
//                   onClick={() => setShowNotifications((v) => !v)}
//                   className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                   aria-haspopup="menu"
//                   aria-expanded={showNotifications}
//                   type="button"
//                 >
//                   <Bell className="h-5 w-5" />
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </button>

//                 {showNotifications && (
//                   <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden" role="menu" aria-label="Notifications">
//                     <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
//                       Notifications
//                     </div>
//                     <div className="max-h-96 overflow-y-auto">
//                       {MOCK_NOTIFICATIONS.map((n) => (
//                         <div key={n.id} className={`p-4 border-b dark:border-gray-700 last:border-none ${n.unread ? "bg-blue-50 dark:bg-blue-900/20" : ""}`} role="menuitem" tabIndex={0}>
//                           <div className="font-medium text-gray-900 dark:text-white text-sm">{n.title}</div>
//                           <p className="text-gray-600 dark:text-gray-300 text-sm">{n.message}</p>
//                           <span className="text-xs text-gray-500 dark:text-gray-400">{n.time}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* User / Auth */}
//             {isAuthenticated ? (
//               <UserMenu
//                 refNode={userMenuRef}
//                 user={user}
//                 onLogout={async () => { await logout(); setShowUserMenu(false); navigate("/"); }}
//                 show={showUserMenu}
//                 setShow={setShowUserMenu}
//               />
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link to="/auth/login" className={premiumGhost}>
//                   <User className="h-4 w-4" /> Sign In
//                 </Link>
//                 <Button as={Link} to="/auth/signup" size="sm" className={premiumSolid}>
//                   <Sparkles className="h-4 w-4" /> Get Started
//                 </Button>
//               </div>
//             )}

//             {/* Mobile menu button (hook up your drawer off-canvas if you have one) */}
//             <button
//               onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//               aria-label="Toggle mobile menu"
//               type="button"
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// function UserMenu({ refNode, user, show, setShow, onLogout }) {
//   return (
//     <div className="relative" ref={refNode}>
//       <button
//         onClick={() => setShow((v) => !v)}
//         className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//         aria-haspopup="menu"
//         aria-expanded={show}
//         type="button"
//       >
//         <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
//           {user?.name?.charAt(0)?.toUpperCase() || "U"}
//         </div>
//         <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${show ? "rotate-180" : ""}`} />
//       </button>

//       {show && (
//         <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden" role="menu" aria-label="User menu">
//           <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//             <div className="font-semibold text-gray-900 dark:text-white">{user?.name}</div>
//             <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
//           </div>
//           <div className="py-2">
//             <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" role="menuitem">Profile</Link>
//             {user?.role && roleToDashboard[user.role] && (
//               <Link to={roleToDashboard[user.role]} className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" role="menuitem">
//                 Dashboard
//               </Link>
//             )}
//           </div>
//           <div className="border-t border-gray-200 dark:border-gray-700">
//             <button
//               onClick={onLogout}
//               className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
//               role="menuitem"
//               type="button"
//             >
//               <LogOut className="inline mr-2 h-4 w-4" /> Sign Out
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default memo(Header);
import { memo, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search, Menu, X, LogOut, Bell, ChevronDown, Sun, Moon,
  Sparkles, User, Clock, TrendingUp
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import Button from "@/components/ui/Button";

// Constants
const ROLE_TO_DASHBOARD = Object.freeze({
  admin: "/dashboard/admin",
  advisor: "/dashboard/advisor",
  guide: "/dashboard/guide",
  instructor: "/dashboard/instructor",
  traveller: "/dashboard/traveller",
});

const PREMIUM_SOLID_CLASSES =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white " +
  "shadow-lg shadow-primary-500/20 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 " +
  "hover:from-primary-600 hover:to-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 " +
  "active:scale-[0.98] transition";

const PREMIUM_GHOST_CLASSES =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold border border-gray-200/70 " +
  "bg-white/80 text-gray-900 hover:bg-white/95 dark:border-gray-700/70 dark:bg-gray-800/70 dark:text-gray-100 " +
  "dark:hover:bg-gray-800/90 shadow-sm backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 transition";

const TRENDING_SEARCHES = Object.freeze([
  "Rome city tour", "Florence food tour", "Colosseum tickets",
  "Vatican skip the line", "Amalfi boat trip", "Tuscany wine tasting",
]);

const SEED_SUGGESTIONS = Object.freeze([
  "Rome, Italy", "Florence, Italy", "Venice gondola", "Milan cathedral",
  "Naples pizza tour", "Pompei day trip", "Cinque Terre hike",
  "Sicily beaches", "Turin museums", "Bologna food market",
]);

const MOCK_NOTIFICATIONS = Object.freeze([
  {
    id: 1,
    title: "Booking Confirmed",
    message: "Your Rome City Tour is confirmed for tomorrow",
    time: "2h ago",
    unread: true
  },
  {
    id: 2,
    title: "Tour Reminder",
    message: "Your Florence Food Tour starts in 1 hour",
    time: "1d ago",
    unread: false
  },
]);

const RECENTS_KEY = "tg_recent_searches_v1";
const MAX_RECENTS = 8;

// Custom hooks
function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return [darkMode, setDarkMode];
}

function useRecentSearches() {
  const [recents, setRecents] = useState(() => {
    try {
      const r = JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]");
      return Array.isArray(r) ? r.slice(0, MAX_RECENTS) : [];
    } catch {
      return [];
    }
  });

  const saveRecent = useCallback((value) => {
    const v = value.trim();
    if (!v) return;
    const next = [v, ...recents.filter((r) => r.toLowerCase() !== v.toLowerCase())].slice(0, MAX_RECENTS);
    setRecents(next);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  }, [recents]);

  const clearRecents = useCallback(() => {
    setRecents([]);
    localStorage.removeItem(RECENTS_KEY);
  }, []);

  return { recents, saveRecent, clearRecents };
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Components
function SearchSuggestions({
  show,
  searchQuery,
  recents,
  onSelect,
  onClearRecents,
  activeIndex,
  onSetActiveIndex
}) {
  const debouncedQuery = useDebounce(searchQuery, 150);

  const filteredSuggestions = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return [];
    const ranked = SEED_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q));
    return [`Search "${debouncedQuery}"`, ...ranked].slice(0, 8);
  }, [debouncedQuery]);

  const suggestionItems = useMemo(
    () => (debouncedQuery ? filteredSuggestions : [...recents, ...TRENDING_SEARCHES.slice(0, 6)]),
    [debouncedQuery, filteredSuggestions, recents]
  );

  const highlight = useCallback((label, query) => {
    if (!query) return <>{label}</>;
    const i = label.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return <>{label}</>;
    return (
      <>
        {label.slice(0, i)}
        <mark className="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">
          {label.slice(i, i + query.length)}
        </mark>
        {label.slice(i + query.length)}
      </>
    );
  }, []);

  const renderGroup = useCallback((title, items, icon) => {
    if (!items.length) return null;
    return (
      <div className="py-2">
        <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
          {icon} {title}
        </div>
        {items.map((label, idx) => {
          const isActive = suggestionItems.indexOf(label) === activeIndex;
          return (
            <button
              key={`${title}-${label}-${idx}`}
              type="button"
              onMouseEnter={() => onSetActiveIndex(suggestionItems.indexOf(label))}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(label.startsWith("Search") ? debouncedQuery : label)}
              className={`w-full text-left px-3 py-2.5 flex items-center gap-2 rounded-lg transition-colors
                ${isActive ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              <Search className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                {label.startsWith("Search") ? label : highlight(label, debouncedQuery)}
              </span>
            </button>
          );
        })}
      </div>
    );
  }, [activeIndex, suggestionItems, onSelect, debouncedQuery, highlight, onSetActiveIndex]);

  if (!show) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">
      <div className="max-h-[70vh] overflow-y-auto py-2">
        {debouncedQuery ? (
          renderGroup("Suggestions", filteredSuggestions, <Search className="h-3.5 w-3.5" />)
        ) : (
          <>
            {renderGroup("Recent", recents, <Clock className="h-3.5 w-3.5" />)}
            {!!recents.length && (
              <div className="flex justify-end px-3 py-1">
                <button
                  onClick={onClearRecents}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Clear recent
                </button>
              </div>
            )}
            {renderGroup("Popular searches", TRENDING_SEARCHES.slice(0, 6), <TrendingUp className="h-3.5 w-3.5" />)}
          </>
        )}
      </div>
    </div>
  );
}

function NotificationDropdown({ show, notifications }) {
  if (!show) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
        Notifications
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b dark:border-gray-700 last:border-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50
              ${notification.unread ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
          >
            <div className="font-medium text-gray-900 dark:text-white text-sm">
              {notification.title}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {notification.message}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserMenu({ show, user, onLogout, onClose }) {
  if (!show) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="font-semibold text-gray-900 dark:text-white">{user?.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
      </div>

      <div className="py-2">
        <Link
          to="/profile"
          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={onClose}
        >
          Profile
        </Link>
        {user?.role && ROLE_TO_DASHBOARD[user.role] && (
          <Link
            to={ROLE_TO_DASHBOARD[user.role]}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            Dashboard
          </Link>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => { onLogout(); onClose(); }}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          type="button"
        >
          <LogOut className="inline mr-2 h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Store state
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen, setMobileMenuOpen, searchQuery, setSearchQuery } = useUIStore() || {};

  // Local state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Custom hooks
  const [darkMode, setDarkMode] = useTheme();
  const { recents, saveRecent, clearRecents } = useRecentSearches();

  // Refs
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchWrapRef = useRef(null);

  // Close dropdowns on route change or outside click
  useEffect(() => {
    setShowNotifications(false);
    setShowUserMenu(false);
    setShowSuggestions(false);
    setActiveIndex(-1);
  }, [location]);

  useEffect(() => {
    if (!(showUserMenu || showNotifications || showSuggestions)) return;

    const handleClickOutside = (e) => {
      if (
        !userMenuRef.current?.contains(e.target) &&
        !notificationRef.current?.contains(e.target) &&
        !searchWrapRef.current?.contains(e.target)
      ) {
        setShowUserMenu(false);
        setShowNotifications(false);
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClickOutside(e);
    };

    document.addEventListener("pointerdown", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showUserMenu, showNotifications, showSuggestions]);

  // Search functionality
  const navigateSearch = useCallback((value) => {
    const query = value?.trim();
    if (!query) return;

    setSearchQuery?.(query);
    saveRecent(query);
    setShowSuggestions(false);
    setActiveIndex(-1);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [navigate, saveRecent, setSearchQuery]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    const query = searchQuery?.trim();
    if (query) {
      navigateSearch(query);
    }
  }, [searchQuery, navigateSearch]);

  const handleSearchKeyDown = useCallback((e) => {
    // Handle keyboard navigation in suggestions
    // Implementation would go here
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout, navigate]);

  const unreadCount = useMemo(
    () => MOCK_NOTIFICATIONS.filter((n) => n.unread).length,
    []
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 dark:bg-gray-900/70  border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" aria-label="Go to home">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">TG</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
              TourGuide
            </span>
          </Link>

          {/* Logo */}
          {/* <Link to="/" className="flex items-center space-x-3 group" aria-label="Go to home">
            <img
              src="/images/LOGO.png"   
              alt="TourGuide Logo"
              className="w-40 h-auto  group-hover:scale-105 transition-transform"
            />
            
          </Link> */}



          {/* Search (desktop) */}
          <div ref={searchWrapRef} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <form
              className="w-full relative"
              onSubmit={handleSearchSubmit}
              role="search"
              aria-label="Site search"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input
                type="search"
                placeholder="Search destinations, activities..."
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-colors"
                autoComplete="off"
              />
            </form>

            <SearchSuggestions
              show={showSuggestions}
              searchQuery={searchQuery || ""}
              recents={recents}
              onSelect={navigateSearch}
              onClearRecents={clearRecents}
              activeIndex={activeIndex}
              onSetActiveIndex={setActiveIndex}
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">

            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="group relative p-[2px] rounded-full bg-gradient-to-r from-primary-500 to-primary-700 shadow-md hover:shadow-lg transition-shadow"
              aria-label="Toggle dark mode"
              type="button"
            >
              <span className="flex items-center justify-between w-[72px] h-9 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur px-1.5 relative">
                <span className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-white dark:bg-gray-700 shadow-lg transition-transform duration-300 ${darkMode ? "translate-x-[2.25rem]" : ""
                  }`} />
                <Sun className={`h-4 w-4 z-10 transition-opacity ${darkMode ? "opacity-60" : "opacity-100"}`} />
                <Moon className={`h-4 w-4 z-10 transition-opacity ${darkMode ? "opacity-100" : "opacity-60"}`} />
              </span>
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(prev => !prev)}
                  className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="View notifications"
                  type="button"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <NotificationDropdown
                  show={showNotifications}
                  notifications={MOCK_NOTIFICATIONS}
                />
              </div>
            )}

            {/* User menu or auth buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(prev => !prev)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="User menu"
                  type="button"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? "rotate-180" : ""
                    }`} />
                </button>

                <UserMenu
                  show={showUserMenu}
                  user={user}
                  onLogout={handleLogout}
                  onClose={() => setShowUserMenu(false)}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/login" className={PREMIUM_GHOST_CLASSES}>
                  <User className="h-4 w-4" /> Sign In
                </Link>
                <Button as={Link} to="/auth/signup" size="sm" className={PREMIUM_SOLID_CLASSES}>
                  <Sparkles className="h-4 w-4" /> Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen?.(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
              type="button"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);