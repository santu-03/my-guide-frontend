// import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import DashboardLayout from "@/components/Layout/DashboardLayout";
// import StatCard from "@/components/Layout/StatCard";
// import {
//   Heart,
//   MapPin,
//   Trash2,
//   RefreshCw,
//   Search,
//   Calendar,
//   Gift,
//   Loader2,
//   IndianRupee,
// } from "lucide-react";
// import Button from "@/components/ui/Button";
// import toast from "react-hot-toast";
// import { api, useAuthStore } from "@/store/auth";

// /* ---------- Helpers ---------- */
// const inr = (n) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(n || 0);

// /* Normalizes wishlist to a flat list for the "All" tab */
// function flattenWishlist(wl) {
//   const places = (wl?.places || []).map((p) => ({
//     type: "place",
//     _id: p._id || p.id,
//     title: p.title || p.name || "Untitled Place",
//     city: p.city || p.location || "",
//     price: undefined,
//     image:
//       p.images?.[0]?.url ||
//       p.coverImage?.url ||
//       "/placeholder-image.jpg",
//   }));
//   const activities = (wl?.activities || []).map((a) => ({
//     type: "activity",
//     _id: a._id || a.id,
//     title: a.title || "Untitled Activity",
//     city: a.city || a.place?.city || "",
//     price: typeof a.basePrice === "number" ? a.basePrice : a.price,
//     image:
//       a.images?.[0]?.url ||
//       a.coverImage?.url ||
//       "/placeholder-image.jpg",
//   }));
//   return [...places, ...activities];
// }

// export default function Wishlist() {
//   const navigate = useNavigate();
//   const { user } = useAuthStore();

//   // Data state
//   const [wishlist, setWishlist] = useState({ places: [], activities: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // UI state
//   const [tab, setTab] = useState("all"); // "all" | "places" | "activities"
//   const [query, setQuery] = useState("");
//   const [removing, setRemoving] = useState(() => new Set());
//   const mountedRef = useRef(true);

//   const loadWishlist = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const res = await api.get("/wishlist");
//       const data = {
//         places: res?.data?.data?.places ?? [],
//         activities: res?.data?.data?.activities ?? [],
//       };
//       if (mountedRef.current) setWishlist(data);
//     } catch (e) {
//       console.error("Wishlist load error:", e);
//       setError("Failed to load wishlist");
//       toast.error("Failed to load wishlist");
//     } finally {
//       if (mountedRef.current) setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     mountedRef.current = true;
//     loadWishlist();
//     return () => {
//       mountedRef.current = false;
//     };
//   }, [loadWishlist]);

//   const removeItem = useCallback(
//     async (id, type) => {
//       // optimistic
//       setRemoving((s) => new Set(s).add(id));
//       const prev = wishlist;
//       const next = {
//         places:
//           type === "place"
//             ? prev.places.filter((p) => (p._id || p.id) !== id)
//             : prev.places,
//         activities:
//           type === "activity"
//             ? prev.activities.filter((a) => (a._id || a.id) !== id)
//             : prev.activities,
//       };
//       setWishlist(next);
//       try {
//         await api.post("/wishlist/toggle", { itemId: id, type });
//         toast.success(
//           type === "place" ? "Place removed" : "Activity removed"
//         );
//       } catch (e) {
//         console.error("Remove failed:", e);
//         if (mountedRef.current) setWishlist(prev); // rollback
//         toast.error("Could not update wishlist");
//       } finally {
//         if (mountedRef.current)
//           setRemoving((s) => {
//             const copy = new Set(s);
//             copy.delete(id);
//             return copy;
//           });
//       }
//     },
//     [wishlist]
//   );

//   const clearAll = useCallback(async () => {
//     const flat = flattenWishlist(wishlist);
//     if (!flat.length) return;
//     // optimistic clear
//     const prev = wishlist;
//     setWishlist({ places: [], activities: [] });
//     try {
//       await Promise.all(
//         flat.map((it) =>
//           api.post("/wishlist/toggle", { itemId: it._id, type: it.type })
//         )
//       );
//       toast.success("Wishlist cleared");
//     } catch (e) {
//       console.error("Clear all failed:", e);
//       if (mountedRef.current) setWishlist(prev); // rollback
//       toast.error("Failed to clear wishlist");
//     }
//   }, [wishlist]);

//   /* ---------- Derivations ---------- */
//   const counts = useMemo(
//     () => ({
//       places: wishlist.places?.length || 0,
//       activities: wishlist.activities?.length || 0,
//       total:
//         (wishlist.places?.length || 0) +
//         (wishlist.activities?.length || 0),
//     }),
//     [wishlist]
//   );

//   const estimatedValue = useMemo(() => {
//     const total = (wishlist.activities || []).reduce(
//       (sum, a) =>
//         sum +
//         (typeof a.basePrice === "number" ? a.basePrice : a.price || 0),
//       0
//     );
//     return total;
//   }, [wishlist]);

//   const flatItems = useMemo(() => flattenWishlist(wishlist), [wishlist]);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const base =
//       tab === "places"
//         ? flatItems.filter((i) => i.type === "place")
//         : tab === "activities"
//         ? flatItems.filter((i) => i.type === "activity")
//         : flatItems;

//     if (!q) return base;
//     return base.filter(
//       (i) =>
//         i.title.toLowerCase().includes(q) ||
//         (i.city || "").toLowerCase().includes(q)
//     );
//   }, [flatItems, tab, query]);

//   /* ---------- Render ---------- */
//   return (
//     <DashboardLayout role="traveller" title="Wishlist" user={user}>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white inline-flex items-center gap-2">
//             <Heart className="h-6 w-6 text-red-500" />
//             My Wishlist
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Save and manage your favorite places & activities
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button
//             onClick={loadWishlist}
//             variant="outline"
//             disabled={loading}
//             className="inline-flex items-center gap-2"
//           >
//             <RefreshCw
//               className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
//             />
//             Refresh
//           </Button>
//           <Button
//             onClick={clearAll}
//             disabled={loading || counts.total === 0}
//             className="inline-flex items-center gap-2"
//             variant="destructive"
//           >
//             <Trash2 className="h-4 w-4" />
//             Clear All
//           </Button>
//         </div>
//       </div>

//       {/* Stats */}
//       {/* Enhanced Stats with Gradient Cards */}
// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//   <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
//     <div className="flex items-center justify-between mb-2">
//       <Heart className="h-8 w-8 opacity-80" />
//       <div className="text-right">
//         <div className="text-3xl font-bold">{counts.total}</div>
//         <div className="text-sm opacity-90">Total Saved</div>
//       </div>
//     </div>
//   </div>

//   <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
//     <div className="flex items-center justify-between mb-2">
//       <MapPin className="h-8 w-8 opacity-80" />
//       <div className="text-right">
//         <div className="text-3xl font-bold">{counts.places}</div>
//         <div className="text-sm opacity-90">Places</div>
//       </div>
//     </div>
//   </div>

//   <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
//     <div className="flex items-center justify-between mb-2">
//       <Calendar className="h-8 w-8 opacity-80" />
//       <div className="text-right">
//         <div className="text-3xl font-bold">{counts.activities}</div>
//         <div className="text-sm opacity-90">Activities</div>
//       </div>
//     </div>
//   </div>

//   <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
//     <div className="flex items-center justify-between mb-2">
//       <IndianRupee className="h-8 w-8 opacity-80" />
//       <div className="text-right">
//         <div className="text-2xl font-bold">{inr(estimatedValue)}</div>
//         <div className="text-sm opacity-90">Est. Value</div>
//       </div>
//     </div>
//   </div>
// </div>
//       {/* Controls */}
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 mb-8">
//         <div className="flex flex-col md:flex-row md:items-center gap-3 p-4">
//           <div className="inline-flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
//             {[
//               { key: "all", label: `All (${counts.total})` },
//               { key: "places", label: `Places (${counts.places})` },
//               { key: "activities", label: `Activities (${counts.activities})` },
//             ].map((t) => (
//               <button
//                 key={t.key}
//                 onClick={() => setTab(t.key)}
//                 className={`px-4 py-2 text-sm font-medium transition-colors ${
//                   tab === t.key
//                     ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
//                     : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40"
//                 }`}
//                 type="button"
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>

//           <div className="relative md:ml-auto w-full md:w-80">
//             <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search saved items…"
//               className="pl-9 pr-3 py-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <div
//               key={i}
//               className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
//             />
//           ))}
//         </div>
//       ) : counts.total === 0 ? (
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-12 text-center">
//           <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//             Your wishlist is empty
//           </h3>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Add places and activities you love, and find them here later.
//           </p>
//           <div className="flex items-center justify-center gap-3">
//             <Link
//               to="/search"
//               className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
//             >
//               Explore Now
//             </Link>
//             <Link
//               to="/"
//               className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
//             >
//               Go Home
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filtered.map((item) => (
//             <div
//               key={`${item.type}-${item._id}`}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 overflow-hidden hover:shadow-md transition"
//             >
//               <div className="relative h-40">
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.src = "/placeholder-image.jpg";
//                   }}
//                 />
//                 <button
//                   onClick={() => removeItem(item._id, item.type)}
//                   disabled={removing.has(item._id)}
//                   className="absolute right-3 top-3 p-2 bg-white/90 dark:bg-gray-900/80 rounded-full shadow hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-60"
//                   title="Remove"
//                   type="button"
//                 >
//                   {removing.has(item._id) ? (
//                     <Loader2 className="h-4 w-4 animate-spin text-red-600" />
//                   ) : (
//                     <Trash2 className="h-4 w-4 text-red-600" />
//                   )}
//                 </button>

//                 <div className="absolute left-3 top-3">
//                   <span className="px-2 py-1 rounded-md text-xs font-semibold bg-white/90 dark:bg-gray-900/80">
//                     {item.type === "place" ? "Place" : "Activity"}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-4">
//                 <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
//                   {item.title}
//                 </h3>

//                 <div className="mt-2 flex items-center justify-between">
//                   <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 gap-1">
//                     <MapPin className="h-4 w-4" />
//                     <span className="truncate max-w-[12rem]">{item.city || "—"}</span>
//                   </div>
//                   <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                     {typeof item.price === "number" ? inr(item.price) : ""}
//                   </div>
//                 </div>

//                 <div className="mt-4 grid grid-cols-2 gap-2">
//                   {item.type === "place" ? (
//                     <Link
//                       to={`/places/${item._id}`}
//                       className="px-3 py-2 text-center rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition"
//                     >
//                       View Place
//                     </Link>
//                   ) : (
//                     <Link
//                       to={`/activities/${item._id}`}
//                       className="px-3 py-2 text-center rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition"
//                     >
//                       View Activity
//                     </Link>
//                   )}
//                   {item.type === "activity" ? (
//                     <Link
//                       to={`/booking?activity=${item._id}`}
//                       className="px-3 py-2 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
//                     >
//                       Book
//                     </Link>
//                   ) : (
//                     <Link
//                       to={`/search?q=${encodeURIComponent(item.city || "")}`}
//                       className="px-3 py-2 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
//                     >
//                       Explore Nearby
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Footer CTA */}
//       <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
//           <h3 className="font-semibold text-gray-900 dark:text-white mb-2 inline-flex items-center gap-2">
//             <Gift className="h-5 w-5" />
//             Tips
//           </h3>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Use the search to quickly find saved items by title or city. Remove items you’re done with to keep this tidy.
//           </p>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  Heart,
  MapPin,
  Trash2,
  RefreshCw,
  Search,
  Calendar,
  Gift,
  Loader2,
  IndianRupee,
} from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { api, useAuthStore } from "@/store/auth";

/* ---------- Helpers ---------- */
const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

// ✅ Helper to get image URL (handles both string arrays and object arrays)
const getImageUrl = (images) => {
  if (!images || !images.length) return '/placeholder-image.jpg';
  const first = images[0];
  if (typeof first === 'string') return first;
  return first?.url || first?.secure_url || first?.Location || first?.location || '/placeholder-image.jpg';
};

/* Normalizes wishlist to a flat list for the "All" tab */
function flattenWishlist(wl) {
  const places = (wl?.places || []).map((p) => ({
    type: "place",
    _id: p._id || p.id,
    title: p.title || p.name || "Untitled Place",
    city: p.city || p.location || "",
    price: undefined,
    image: getImageUrl(p.images || [p.coverImage]),
  }));
  const activities = (wl?.activities || []).map((a) => ({
    type: "activity",
    _id: a._id || a.id,
    title: a.title || "Untitled Activity",
    city: a.city || a.place?.city || "",
    price: typeof a.basePrice === "number" ? a.basePrice : a.price,
    image: getImageUrl(a.images || [a.coverImage]),
  }));
  return [...places, ...activities];
}

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Data state
  const [wishlist, setWishlist] = useState({ places: [], activities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [tab, setTab] = useState("all"); // "all" | "places" | "activities"
  const [query, setQuery] = useState("");
  const [removing, setRemoving] = useState(() => new Set());
  const mountedRef = useRef(true);

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/wishlist");
      const data = {
        places: res?.data?.data?.places ?? [],
        activities: res?.data?.data?.activities ?? [],
      };
      if (mountedRef.current) setWishlist(data);
    } catch (e) {
      console.error("Wishlist load error:", e);
      setError("Failed to load wishlist");
      toast.error("Failed to load wishlist");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadWishlist();
    return () => {
      mountedRef.current = false;
    };
  }, [loadWishlist]);

  const removeItem = useCallback(
    async (id, type) => {
      // optimistic
      setRemoving((s) => new Set(s).add(id));
      const prev = wishlist;
      const next = {
        places:
          type === "place"
            ? prev.places.filter((p) => (p._id || p.id) !== id)
            : prev.places,
        activities:
          type === "activity"
            ? prev.activities.filter((a) => (a._id || a.id) !== id)
            : prev.activities,
      };
      setWishlist(next);
      try {
        await api.post("/wishlist/toggle", { itemId: id, type });
        toast.success(
          type === "place" ? "Place removed" : "Activity removed"
        );
      } catch (e) {
        console.error("Remove failed:", e);
        if (mountedRef.current) setWishlist(prev); // rollback
        toast.error("Could not update wishlist");
      } finally {
        if (mountedRef.current)
          setRemoving((s) => {
            const copy = new Set(s);
            copy.delete(id);
            return copy;
          });
      }
    },
    [wishlist]
  );

  const clearAll = useCallback(async () => {
    const flat = flattenWishlist(wishlist);
    if (!flat.length) return;
    // optimistic clear
    const prev = wishlist;
    setWishlist({ places: [], activities: [] });
    try {
      await Promise.all(
        flat.map((it) =>
          api.post("/wishlist/toggle", { itemId: it._id, type: it.type })
        )
      );
      toast.success("Wishlist cleared");
    } catch (e) {
      console.error("Clear all failed:", e);
      if (mountedRef.current) setWishlist(prev); // rollback
      toast.error("Failed to clear wishlist");
    }
  }, [wishlist]);

  /* ---------- Derivations ---------- */
  const counts = useMemo(
    () => ({
      places: wishlist.places?.length || 0,
      activities: wishlist.activities?.length || 0,
      total:
        (wishlist.places?.length || 0) +
        (wishlist.activities?.length || 0),
    }),
    [wishlist]
  );

  const estimatedValue = useMemo(() => {
    const total = (wishlist.activities || []).reduce(
      (sum, a) =>
        sum +
        (typeof a.basePrice === "number" ? a.basePrice : a.price || 0),
      0
    );
    return total;
  }, [wishlist]);

  const flatItems = useMemo(() => flattenWishlist(wishlist), [wishlist]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base =
      tab === "places"
        ? flatItems.filter((i) => i.type === "place")
        : tab === "activities"
        ? flatItems.filter((i) => i.type === "activity")
        : flatItems;

    if (!q) return base;
    return base.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.city || "").toLowerCase().includes(q)
    );
  }, [flatItems, tab, query]);

  /* ---------- Render ---------- */
  return (
    <DashboardLayout role="traveller" title="Wishlist" user={user}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white inline-flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Save and manage your favorite places & activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadWishlist}
            variant="outline"
            disabled={loading}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={clearAll}
            disabled={loading || counts.total === 0}
            className="inline-flex items-center gap-2"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Enhanced Stats with Gradient Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Heart className="h-8 w-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{counts.total}</div>
              <div className="text-sm opacity-90">Total Saved</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="h-8 w-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{counts.places}</div>
              <div className="text-sm opacity-90">Places</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{counts.activities}</div>
              <div className="text-sm opacity-90">Activities</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <IndianRupee className="h-8 w-8 opacity-80" />
            <div className="text-right">
              <div className="text-2xl font-bold">{inr(estimatedValue)}</div>
              <div className="text-sm opacity-90">Est. Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-3 p-4">
          <div className="inline-flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {[
              { key: "all", label: `All (${counts.total})` },
              { key: "places", label: `Places (${counts.places})` },
              { key: "activities", label: `Activities (${counts.activities})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                }`}
                type="button"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative md:ml-auto w-full md:w-80">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saved items…"
              className="pl-9 pr-3 py-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : counts.total === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-12 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add places and activities you love, and find them here later.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/search"
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            >
              Explore Now
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              Go Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={`${item.type}-${item._id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 overflow-hidden hover:shadow-md transition"
            >
              <div className="relative h-40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.jpg";
                  }}
                />
                <button
                  onClick={() => removeItem(item._id, item.type)}
                  disabled={removing.has(item._id)}
                  className="absolute right-3 top-3 p-2 bg-white/90 dark:bg-gray-900/80 rounded-full shadow hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-60"
                  title="Remove"
                  type="button"
                >
                  {removing.has(item._id) ? (
                    <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-600" />
                  )}
                </button>

                <div className="absolute left-3 top-3">
                  <span className="px-2 py-1 rounded-md text-xs font-semibold bg-white/90 dark:bg-gray-900/80">
                    {item.type === "place" ? "Place" : "Activity"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {item.title}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate max-w-[12rem]">{item.city || "—"}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {typeof item.price === "number" ? inr(item.price) : ""}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {item.type === "place" ? (
                    <Link
                      to={`/places/${item._id}`}
                      className="px-3 py-2 text-center rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition"
                    >
                      View Place
                    </Link>
                  ) : (
                    <Link
                      to={`/activities/${item._id}`}
                      className="px-3 py-2 text-center rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition"
                    >
                      View Activity
                    </Link>
                  )}
                  {item.type === "activity" ? (
                    <Link
                      to={`/booking?activity=${item._id}`}
                      className="px-3 py-2 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                    >
                      Book
                    </Link>
                  ) : (
                    <Link
                      to={`/search?q=${encodeURIComponent(item.city || "")}`}
                      className="px-3 py-2 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                    >
                      Explore Nearby
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 inline-flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Tips
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use the search to quickly find saved items by title or city. Remove items you're done with to keep this tidy.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}