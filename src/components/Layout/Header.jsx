// import { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import {
//   Search, Menu, X, LogOut, Bell, ChevronDown, Sun, Moon,
//   Sparkles, User, Clock, TrendingUp
// } from 'lucide-react';
// import { useAuthStore } from '@/store/auth';
// import { useUIStore } from '@/store/ui';
// import Button from '@/components/ui/Button';

// /* ---------------- Role → dashboard mapping ---------------- */
// const roleToDashboard = {
//   admin: "/dashboard/admin",
//   advisor: "/dashboard/advisor",
//   guide: "/dashboard/guide",
//   instructor: "/dashboard/instructor",
//   traveller: "/dashboard/traveller",
// };

// /* ---------------- Premium button styles ---------------- */
// const premiumSolid =
//   "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold " +
//   "text-white shadow-lg shadow-primary-500/20 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 " +
//   "hover:from-primary-600 hover:to-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 " +
//   "active:scale-[0.98] transition";

// const premiumGhost =
//   "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold " +
//   "border border-gray-200/70 bg-white/80 text-gray-900 hover:bg-white/95 " +
//   "dark:border-gray-700/70 dark:bg-gray-800/70 dark:text-gray-100 dark:hover:bg-gray-800/90 " +
//   "shadow-sm backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 transition";

// /* ---------------- Mock data (replace with API later) ---------------- */
// const TRENDING = Object.freeze([
//   'Rome city tour',
//   'Florence food tour',
//   'Colosseum tickets',
//   'Vatican skip the line',
//   'Amalfi boat trip',
//   'Tuscany wine tasting',
// ]);

// const SEED_SUGGESTIONS = Object.freeze([
//   'Rome, Italy',
//   'Florence, Italy',
//   'Venice gondola',
//   'Milan cathedral',
//   'Naples pizza tour',
//   'Pompei day trip',
//   'Cinque Terre hike',
//   'Sicily beaches',
//   'Turin museums',
//   'Bologna food market',
// ]);

// const MOCK_NOTIFICATIONS = Object.freeze([
//   { id: 1, title: 'Booking Confirmed', message: 'Your Rome City Tour is confirmed for tomorrow', time: '2h ago', unread: true },
//   { id: 2, title: 'Tour Reminder', message: 'Your Florence Food Tour starts in 1 hour', time: '1d ago', unread: false }
// ]);

// const RECENTS_KEY = 'tg_recent_searches_v1';
// const MAX_RECENTS = 8;

// const Header = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   /* ---------------- Stores (pick specific fields to minimize re-renders) ---------------- */
//   const user = useAuthStore(s => s.user);
//   const isAuthenticated = useAuthStore(s => s.isAuthenticated);
//   const logout = useAuthStore(s => s.logout);

//   const isMobileMenuOpen = useUIStore(s => s.isMobileMenuOpen);
//   const setMobileMenuOpen = useUIStore(s => s.setMobileMenuOpen);
//   const searchQuery = useUIStore(s => s.searchQuery) ?? '';
//   const setSearchQuery = useUIStore(s => s.setSearchQuery);

//   /* ---------------- UI State ---------------- */
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem('theme');
//     if (saved) return saved === 'dark';
//     return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
//   });

//   // Suggestions state
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [activeIdx, setActiveIdx] = useState(-1);
//   const [debouncedQ, setDebouncedQ] = useState(searchQuery);
//   const [recents, setRecents] = useState(() => {
//     try {
//       const r = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
//       return Array.isArray(r) ? r.slice(0, MAX_RECENTS) : [];
//     } catch { return []; }
//   });

//   /* ---------------- Refs ---------------- */
//   const userMenuRef = useRef(null);
//   const notificationRef = useRef(null);
//   const searchWrapRef = useRef(null);
//   const inputRef = useRef(null);

//   /* ---------------- Effects ---------------- */
//   // Persist dark mode immediately on <html>
//   useEffect(() => {
//     const root = document.documentElement;
//     root.classList.toggle('dark', darkMode);
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   // Close popovers/suggestions on route change
//   useEffect(() => {
//     setShowNotifications(false);
//     setShowUserMenu(false);
//     setShowSuggestions(false);
//     setActiveIdx(-1);
//   }, [location]);

//   // Outside click + ESC for ALL popovers
//   useEffect(() => {
//     if (!showUserMenu && !showNotifications && !showSuggestions) return;

//     const onPointerDown = (e) => {
//       const inUser = userMenuRef.current?.contains(e.target);
//       const inNotif = notificationRef.current?.contains(e.target);
//       const inSearch = searchWrapRef.current?.contains(e.target);
//       if (!inUser && !inNotif && !inSearch) {
//         setShowUserMenu(false);
//         setShowNotifications(false);
//         setShowSuggestions(false);
//         setActiveIdx(-1);
//       }
//     };
//     const onKey = (e) => {
//       if (e.key === 'Escape') {
//         setShowUserMenu(false);
//         setShowNotifications(false);
//         setShowSuggestions(false);
//         setActiveIdx(-1);
//         inputRef.current?.blur();
//       }
//     };

//     document.addEventListener('pointerdown', onPointerDown, { passive: true });
//     document.addEventListener('keydown', onKey);
//     return () => {
//       document.removeEventListener('pointerdown', onPointerDown);
//       document.removeEventListener('keydown', onKey);
//     };
//   }, [showUserMenu, showNotifications, showSuggestions]);

//   // Debounce search for smoother suggestions
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedQ(searchQuery.trim()), 120);
//     return () => clearTimeout(t);
//   }, [searchQuery]);

//   /* ---------------- Suggestions Logic ---------------- */
//   const filtered = useMemo(() => {
//     const q = debouncedQ.toLowerCase();
//     if (!q) return [];

//     const ranked = SEED_SUGGESTIONS
//       .filter(s => s.toLowerCase().includes(q))
//       .sort((a, b) => {
//         const A = a.toLowerCase(), B = b.toLowerCase();
//         const aStarts = A.startsWith(q), bStarts = B.startsWith(q);
//         if (aStarts && !bStarts) return -1;
//         if (bStarts && !aStarts) return 1;
//         return A.localeCompare(B);
//       });

//     const smart = [`Search “${debouncedQ}”`];
//     return [...smart, ...ranked].slice(0, 8);
//   }, [debouncedQ]);

//   const popular = useMemo(() => TRENDING.slice(0, 6), []);
//   const unreadCount = useMemo(() => MOCK_NOTIFICATIONS.filter(n => n.unread).length, []);

//   /* ---------------- Handlers ---------------- */
//   const saveRecent = useCallback((value) => {
//     const v = value.trim();
//     if (!v) return;
//     const next = [v, ...recents.filter(r => r.toLowerCase() !== v.toLowerCase())].slice(0, MAX_RECENTS);
//     setRecents(next);
//     localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
//   }, [recents]);

//   const clearRecents = useCallback(() => {
//     setRecents([]);
//     localStorage.removeItem(RECENTS_KEY);
//   }, []);

//   const navigateSearch = useCallback((value) => {
//     const q = value.trim();
//     if (!q) return;
//     setSearchQuery(q);
//     saveRecent(q);
//     setShowSuggestions(false);
//     setActiveIdx(-1);
//     navigate(`/search?q=${encodeURIComponent(q)}`);
//   }, [navigate, saveRecent, setSearchQuery]);

//   const suggestionItems = useCallback(() => {
//     if (debouncedQ) return filtered;
//     return [...recents, ...popular];
//   }, [debouncedQ, filtered, recents, popular]);

//   const handleSubmit = useCallback((e) => {
//     e.preventDefault();
//     if (activeIdx >= 0) {
//       const items = suggestionItems();
//       const choice = items[activeIdx];
//       if (choice) return navigateSearch(choice.startsWith('Search “') ? debouncedQ : choice);
//     }
//     navigateSearch(searchQuery);
//   }, [activeIdx, suggestionItems, navigateSearch, searchQuery, debouncedQ]);

//   const onKeyDownSearch = useCallback((e) => {
//     const items = suggestionItems();
//     if (!items.length) return;

//     if (e.key === 'ArrowDown') {
//       e.preventDefault();
//       setShowSuggestions(true);
//       setActiveIdx(i => (i + 1) % items.length);
//     } else if (e.key === 'ArrowUp') {
//       e.preventDefault();
//       setShowSuggestions(true);
//       setActiveIdx(i => (i <= 0 ? items.length - 1 : i - 1));
//     } else if (e.key === 'Escape') {
//       setShowSuggestions(false);
//       setActiveIdx(-1);
//     }
//   }, [suggestionItems]);

//   const highlight = (label, q) => {
//     if (!q) return <span>{label}</span>;
//     const i = label.toLowerCase().indexOf(q.toLowerCase());
//     if (i === -1) return <span>{label}</span>;
//     const before = label.slice(0, i);
//     const match  = label.slice(i, i + q.length);
//     const after  = label.slice(i + q.length);
//     return (
//       <span>
//         {before}
//         <mark className="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">{match}</mark>
//         {after}
//       </span>
//     );
//   };

//   const renderGroup = (title, items, icon) => {
//     if (!items.length) return null;
//     return (
//       <div className="py-2">
//         <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
//           {icon}{title}
//         </div>
//         {items.map((label, idxInGroup) => {
//           const globalIndex = suggestionItems().indexOf(label);
//           const isActive = globalIndex === activeIdx;

//           return (
//             <button
//               key={`${title}-${label}-${idxInGroup}`}
//               type="button"
//               onMouseEnter={() => setActiveIdx(globalIndex)}
//               onMouseDown={(e) => e.preventDefault()}
//               onClick={() => navigateSearch(label.startsWith('Search “') ? debouncedQ : label)}
//               className={`w-full text-left px-3 py-2.5 flex items-center gap-2 rounded-lg
//                 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
//                 transition-colors`}
//             >
//               <Search className="h-4 w-4 text-gray-500" />
//               <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
//                 {label.startsWith('Search “')
//                   ? <span>{label}</span>
//                   : highlight(label, debouncedQ)}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     );
//   };

//   const toggleDarkMode = useCallback(() => setDarkMode(v => !v), []);
//   const toggleMobileMenu = useCallback(() => setMobileMenuOpen(!isMobileMenuOpen), [isMobileMenuOpen, setMobileMenuOpen]);

//   /* ---------------- Render ---------------- */
//   return (
//     <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">

//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3 group" aria-label="Go to home">
//             <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
//               <span className="text-white font-bold text-lg">TG</span>
//             </div>
//             <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
//               TourGuide
//             </span>
//           </Link>

//           {/* Search (Desktop) */}
//           <div ref={searchWrapRef} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
//             <form className="w-full relative" role="search" aria-label="Site search" onSubmit={handleSubmit}>
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" aria-hidden />
//               <input
//                 ref={inputRef}
//                 type="search"
//                 inputMode="search"
//                 placeholder="Search destinations, activities..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setShowSuggestions(true)}
//                 onKeyDown={onKeyDownSearch}
//                 className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 shadow-sm"
//                 aria-label="Search"
//                 autoComplete="off"
//               />
//             </form>

//             {/* Suggestions Panel */}
//             {showSuggestions && (
//               <div
//                 className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
//                 role="listbox"
//                 aria-label="Search suggestions"
//               >
//                 <div className="max-h-[70vh] overflow-y-auto py-2">
//                   {debouncedQ ? (
//                     <>
//                       {renderGroup('Suggestions', filtered, <Search className="h-3.5 w-3.5 text-gray-500" />)}
//                     </>
//                   ) : (
//                     <>
//                       {renderGroup('Recent', recents, <Clock className="h-3.5 w-3.5 text-gray-500" />)}
//                       <div className="flex justify-end px-3">
//                         {!!recents.length && (
//                           <button
//                             type="button"
//                             onClick={clearRecents}
//                             className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                           >
//                             Clear recent
//                           </button>
//                         )}
//                       </div>
//                       {renderGroup('Popular searches', popular, <TrendingUp className="h-3.5 w-3.5 text-gray-500" />)}
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Actions */}
//           <div className="flex items-center space-x-3 sm:space-x-4">
//             {/* Dark Mode – premium pill toggle */}
//             <button
//               onClick={toggleDarkMode}
//               className="group relative p-[2px] rounded-full bg-gradient-to-r from-primary-500 to-primary-700 shadow-md"
//               aria-label="Toggle dark mode"
//               type="button"
//             >
//               <span className="flex items-center justify-between w-[72px] h-9 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur px-1.5 relative">
//                 <span
//                   className={
//                     "absolute top-1 left-1 h-7 w-7 rounded-full bg-white dark:bg-gray-700 shadow transition-transform duration-300 " +
//                     (darkMode ? "translate-x-[2.25rem]" : "translate-x-0")
//                   }
//                 />
//                 <Sun className={"h-4 w-4 z-10 " + (darkMode ? "opacity-60" : "opacity-100")} />
//                 <Moon className={"h-4 w-4 z-10 " + (darkMode ? "opacity-100" : "opacity-60")} />
//               </span>
//             </button>

//             {/* Notifications (mock) */}
//             {isAuthenticated && (
//               <div className="relative" ref={notificationRef}>
//                 <button
//                   onClick={() => setShowNotifications(v => !v)}
//                   className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                   aria-haspopup="menu"
//                   aria-expanded={showNotifications}
//                   aria-label="Open notifications"
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
//                   <div
//                     className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden"
//                     role="menu"
//                     aria-label="Notifications"
//                   >
//                     <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
//                       Notifications
//                     </div>
//                     <div className="max-h-96 overflow-y-auto">
//                       {MOCK_NOTIFICATIONS.map((n) => (
//                         <div
//                           key={n.id}
//                           className={`p-4 border-b dark:border-gray-700 last:border-none ${n.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
//                           role="menuitem"
//                           tabIndex={0}
//                         >
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

//             {/* User Menu / Auth Buttons */}
//             {isAuthenticated ? (
//               <div className="relative" ref={userMenuRef}>
//                 <button
//                   onClick={() => setShowUserMenu(v => !v)}
//                   className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//                   aria-haspopup="menu"
//                   aria-expanded={showUserMenu}
//                   type="button"
//                 >
//                   <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
//                     {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//                   </div>
//                   <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
//                 </button>

//                 {showUserMenu && (
//                   <div
//                     className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden"
//                     role="menu"
//                     aria-label="User menu"
//                   >
//                     <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                       <div className="font-semibold text-gray-900 dark:text-white">{user?.name}</div>
//                       <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
//                     </div>
//                     <div className="py-2">
//                       <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" role="menuitem">
//                         Profile
//                       </Link>
//                       {/* ✅ Role-based Dashboard */}
//                       {user?.role && roleToDashboard[user.role] && (
//                         <Link
//                           to={roleToDashboard[user.role]}
//                           className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
//                           role="menuitem"
//                         >
//                           Dashboard
//                         </Link>
//                       )}

//                     </div>
//                     <div className="border-t border-gray-200 dark:border-gray-700">
//                       <button
//                         onClick={async () => { await logout(); setShowUserMenu(false); navigate('/'); }}
//                         className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
//                         role="menuitem"
//                         type="button"
//                       >
//                         <LogOut className="inline mr-2 h-4 w-4" /> Sign Out
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link to="/auth/login" className={premiumGhost}>
//                   <User className="h-4 w-4" />
//                   Sign In
//                 </Link>
//                 <Button as={Link} to="/auth/signup" size="sm" className={premiumSolid}>
//                   <Sparkles className="h-4 w-4" />
//                   Get Started
//                 </Button>
//               </div>
//             )}

//             {/* Mobile menu button */}
//             <button
//               onClick={toggleMobileMenu}
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
// };

// export default memo(Header);
import { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Menu, X, LogOut, Bell, ChevronDown, Sun, Moon,
  Sparkles, User, Clock, TrendingUp
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import Button from '@/components/ui/Button';

/* ---------------- Role → dashboard mapping ---------------- */
const roleToDashboard = Object.freeze({
  admin: "/dashboard/admin",
  advisor: "/dashboard/advisor",
  guide: "/dashboard/guide",
  instructor: "/dashboard/instructor",
  traveller: "/dashboard/traveller",
});

/* ---------------- Premium button styles ---------------- */
const premiumSolid =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold " +
  "text-white shadow-lg shadow-primary-500/20 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 " +
  "hover:from-primary-600 hover:to-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 " +
  "active:scale-[0.98] transition";

const premiumGhost =
  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold " +
  "border border-gray-200/70 bg-white/80 text-gray-900 hover:bg-white/95 " +
  "dark:border-gray-700/70 dark:bg-gray-800/70 dark:text-gray-100 dark:hover:bg-gray-800/90 " +
  "shadow-sm backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 transition";

/* ---------------- Mock data (replace with API later) ---------------- */
const TRENDING = Object.freeze([
  'Rome city tour', 'Florence food tour', 'Colosseum tickets',
  'Vatican skip the line', 'Amalfi boat trip', 'Tuscany wine tasting',
]);

const SEED_SUGGESTIONS = Object.freeze([
  'Rome, Italy', 'Florence, Italy', 'Venice gondola', 'Milan cathedral',
  'Naples pizza tour', 'Pompei day trip', 'Cinque Terre hike',
  'Sicily beaches', 'Turin museums', 'Bologna food market',
]);

const MOCK_NOTIFICATIONS = Object.freeze([
  { id: 1, title: 'Booking Confirmed', message: 'Your Rome City Tour is confirmed for tomorrow', time: '2h ago', unread: true },
  { id: 2, title: 'Tour Reminder', message: 'Your Florence Food Tour starts in 1 hour', time: '1d ago', unread: false }
]);

const RECENTS_KEY = 'tg_recent_searches_v1';
const MAX_RECENTS = 8;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- Stores ---------------- */
  const { user, isAuthenticated, logout } = useAuthStore(s => ({
    user: s.user,
    isAuthenticated: s.isAuthenticated,
    logout: s.logout,
  }));
  const { isMobileMenuOpen, setMobileMenuOpen, searchQuery = '', setSearchQuery } = useUIStore();

  /* ---------------- UI State ---------------- */
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Theme
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : window.matchMedia?.('(prefers-color-scheme: dark)').matches
  );

  // Search recents
  const [recents, setRecents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]').slice(0, MAX_RECENTS);
    } catch { return []; }
  });

  const [debouncedQ, setDebouncedQ] = useState(searchQuery);

  /* ---------------- Refs ---------------- */
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchWrapRef = useRef(null);
  const inputRef = useRef(null);

  /* ---------------- Effects ---------------- */
  // Dark mode persistence
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Reset popovers on route change
  useEffect(() => {
    setShowNotifications(false);
    setShowUserMenu(false);
    setShowSuggestions(false);
    setActiveIdx(-1);
  }, [location]);

  // Close on outside click / ESC
  useEffect(() => {
    if (!(showUserMenu || showNotifications || showSuggestions)) return;

    const handleClick = (e) => {
      if (
        !userMenuRef.current?.contains(e.target) &&
        !notificationRef.current?.contains(e.target) &&
        !searchWrapRef.current?.contains(e.target)
      ) {
        setShowUserMenu(false);
        setShowNotifications(false);
        setShowSuggestions(false);
        setActiveIdx(-1);
      }
    };
    const handleKey = (e) => e.key === 'Escape' && handleClick(e);

    document.addEventListener('pointerdown', handleClick, { passive: true });
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showUserMenu, showNotifications, showSuggestions]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchQuery.trim()), 150);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* ---------------- Suggestions Logic ---------------- */
  const filtered = useMemo(() => {
    const q = debouncedQ.toLowerCase();
    if (!q) return [];
    const ranked = SEED_SUGGESTIONS
      .filter(s => s.toLowerCase().includes(q))
      .sort((a, b) => a.localeCompare(b));
    return [`Search “${debouncedQ}”`, ...ranked].slice(0, 8);
  }, [debouncedQ]);

  const popular = TRENDING.slice(0, 6);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length;

  /* ---------------- Handlers ---------------- */
  const saveRecent = useCallback((value) => {
    const v = value.trim();
    if (!v) return;
    const next = [v, ...recents.filter(r => r.toLowerCase() !== v.toLowerCase())].slice(0, MAX_RECENTS);
    setRecents(next);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  }, [recents]);

  const clearRecents = useCallback(() => {
    setRecents([]);
    localStorage.removeItem(RECENTS_KEY);
  }, []);

  const navigateSearch = useCallback((value) => {
    const q = value.trim();
    if (!q) return;
    setSearchQuery(q);
    saveRecent(q);
    setShowSuggestions(false);
    setActiveIdx(-1);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }, [navigate, saveRecent, setSearchQuery]);

  const suggestionItems = useMemo(
    () => (debouncedQ ? filtered : [...recents, ...popular]),
    [debouncedQ, filtered, recents, popular]
  );

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (activeIdx >= 0 && suggestionItems[activeIdx]) {
      const choice = suggestionItems[activeIdx];
      return navigateSearch(choice.startsWith('Search “') ? debouncedQ : choice);
    }
    navigateSearch(searchQuery);
  }, [activeIdx, suggestionItems, navigateSearch, searchQuery, debouncedQ]);

  const onKeyDownSearch = useCallback((e) => {
    if (!suggestionItems.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setShowSuggestions(true);
      setActiveIdx(i =>
        e.key === 'ArrowDown'
          ? (i + 1) % suggestionItems.length
          : (i <= 0 ? suggestionItems.length - 1 : i - 1)
      );
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIdx(-1);
    }
  }, [suggestionItems]);

  const highlight = useCallback((label, q) => {
    if (!q) return <>{label}</>;
    const i = label.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return <>{label}</>;
    return (
      <>
        {label.slice(0, i)}
        <mark className="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">{label.slice(i, i + q.length)}</mark>
        {label.slice(i + q.length)}
      </>
    );
  }, []);

  const renderGroup = useCallback((title, items, icon) => {
    if (!items.length) return null;
    return (
      <div className="py-2">
        <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
          {icon}{title}
        </div>
        {items.map((label, idx) => {
          const isActive = suggestionItems.indexOf(label) === activeIdx;
          return (
            <button
              key={`${title}-${label}-${idx}`}
              type="button"
              onMouseEnter={() => setActiveIdx(suggestionItems.indexOf(label))}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => navigateSearch(label.startsWith('Search “') ? debouncedQ : label)}
              className={`w-full text-left px-3 py-2.5 flex items-center gap-2 rounded-lg
                ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                transition-colors`}
            >
              <Search className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                {label.startsWith('Search “') ? label : highlight(label, debouncedQ)}
              </span>
            </button>
          );
        })}
      </div>
    );
  }, [activeIdx, suggestionItems, navigateSearch, debouncedQ, highlight]);

  /* ---------------- Render ---------------- */
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 shadow-sm">
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

          {/* Search (Desktop) */}
          <div ref={searchWrapRef} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <form className="w-full relative" role="search" aria-label="Site search" onSubmit={handleSubmit}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" aria-hidden />
              <input
                ref={inputRef}
                type="search"
                placeholder="Search destinations, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={onKeyDownSearch}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 shadow-sm"
                autoComplete="off"
              />
            </form>

            {/* Suggestions */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="max-h-[70vh] overflow-y-auto py-2">
                  {debouncedQ
                    ? renderGroup('Suggestions', filtered, <Search className="h-3.5 w-3.5 text-gray-500" />)
                    : <>
                        {renderGroup('Recent', recents, <Clock className="h-3.5 w-3.5 text-gray-500" />)}
                        {!!recents.length && (
                          <div className="flex justify-end px-3">
                            <button onClick={clearRecents} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                              Clear recent
                            </button>
                          </div>
                        )}
                        {renderGroup('Popular searches', popular, <TrendingUp className="h-3.5 w-3.5 text-gray-500" />)}
                      </>
                  }
                </div>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(v => !v)}
              className="group relative p-[2px] rounded-full bg-gradient-to-r from-primary-500 to-primary-700 shadow-md"
              aria-label="Toggle dark mode"
            >
              <span className="flex items-center justify-between w-[72px] h-9 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur px-1.5 relative">
                <span className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-white dark:bg-gray-700 shadow transition-transform duration-300 ${darkMode ? "translate-x-[2.25rem]" : ""}`} />
                <Sun className={`h-4 w-4 z-10 ${darkMode ? "opacity-60" : "opacity-100"}`} />
                <Moon className={`h-4 w-4 z-10 ${darkMode ? "opacity-100" : "opacity-60"}`} />
              </span>
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(v => !v)}
                  className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={showNotifications}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {MOCK_NOTIFICATIONS.map(n => (
                        <div key={n.id} className={`p-4 border-b dark:border-gray-700 last:border-none ${n.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{n.title}</div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{n.message}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu / Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-gray-900 dark:text-white">{user?.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
                    </div>
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Profile</Link>
                      {user?.role && roleToDashboard[user.role] && (
                        <Link to={roleToDashboard[user.role]} className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                          Dashboard
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={async () => { await logout(); setShowUserMenu(false); navigate('/'); }}
                        className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="inline mr-2 h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/login" className={premiumGhost}>
                  <User className="h-4 w-4" /> Sign In
                </Link>
                <Button as={Link} to="/auth/signup" size="sm" className={premiumSolid}>
                  <Sparkles className="h-4 w-4" /> Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
