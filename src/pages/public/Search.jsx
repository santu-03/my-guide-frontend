// import { useEffect, useState, useCallback, useMemo } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import { Search as SearchIcon, SlidersHorizontal, Grid3X3, List, ChevronDown, X, MapPin, Star, Clock } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/Card';
// import { SkeletonList } from '@/components/ui/LoadingSkeleton';
// import Button from '@/components/ui/Button';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// /* -------- Inline Axios client with token auth -------- */
// const API_BASE =
//   import.meta.env.VITE_BACKEND_URL ||
//   import.meta.env.VITE_API_URL ||
//   'http://localhost:5000/api';

// const TOKEN_KEYS = ['token','accessToken','jwt','adminToken','superadminToken','vendorToken','managerToken','userToken'];
// const getStoredToken = () => {
//   for (const k of TOKEN_KEYS) {
//     const raw = localStorage.getItem(k); if (!raw) continue;
//     try { const p = JSON.parse(raw); return typeof p === 'string' ? p : (p?.token || p?.accessToken || p?.data?.token || p?.data?.accessToken || null); }
//     catch { return raw; }
//   }
//   try { const u = JSON.parse(localStorage.getItem('user') || 'null'); return u?.token || u?.accessToken || null; }
//   catch { return null; }
// };

// const API = axios.create({ baseURL: API_BASE, withCredentials: true });
// API.interceptors.request.use((config) => {
//   const t = getStoredToken(); if (t) config.headers.Authorization = `Bearer ${t}`; return config;
// });
// /* ----------------------------------------------------- */

// const SORT_OPTIONS = [
//   { value: 'relevance', label: 'Most Relevant' },
//   { value: 'price_low', label: 'Price: Low to High' },
//   { value: 'price_high', label: 'Price: High to Low' },
//   { value: 'rating', label: 'Highest Rated' },
//   { value: 'popularity', label: 'Most Popular' },
// ];

// const PRICE_RANGES = [
//   { value: '0-50', label: 'Under ₹50' },
//   { value: '50-100', label: '₹50 – ₹100' },
//   { value: '100-500', label: '₹100 – ₹500' },
//   { value: '500-1000', label: '₹500 – ₹1,000' },
//   { value: '1000+', label: 'Over ₹1,000' },
// ];

// const CATEGORIES = [
//   { value: 'cultural', label: 'Cultural Tours', icon: '🏛️' },
//   { value: 'food', label: 'Food & Drink', icon: '🍽️' },
//   { value: 'adventure', label: 'Adventure', icon: '🏔️' },
//   { value: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
//   { value: 'art', label: 'Art & History', icon: '🎨' },
//   { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
// ];

// const Search = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   // URL params -> state
//   const query = searchParams.get('q') || '';
//   const dateParam = searchParams.get('date') || '';
//   const guestsParam = searchParams.get('guests') || '';
//   const typeParam = searchParams.get('type') || '';
//   const categoryParam = searchParams.get('category') || '';
//   const sortParam = searchParams.get('sort') || 'relevance';

//   const [loading, setLoading] = useState(true);
//   const [results, setResults] = useState({ places: [], activities: [] });
//   const [totalResults, setTotalResults] = useState(0);
//   const [showFilters, setShowFilters] = useState(false);
//   const [viewMode, setViewMode] = useState('grid');

//   const [filters, setFilters] = useState({
//     query,
//     date: dateParam,
//     guests: guestsParam || '1',
//     type: typeParam,
//     category: categoryParam,
//     sort: sortParam,
//     priceRange: '',
//     rating: '',
//     duration: '',
//   });
//   const [appliedFilters, setAppliedFilters] = useState(filters);

//   // allow approved (places) OR isPublished (activities) and admin source
//   const onlyAdminApproved = (arr = []) =>
//     arr.filter(
//       (x) =>
//         (x?.approved === true || x?.isApproved === true || x?.isPublished === true) &&
//         (x?.source === 'admin' || x?.createdByRole === 'admin' || x?.createdBy?.role === 'admin')
//     );

//   const fetchResults = useCallback(async (searchFilters) => {
//     try {
//       setLoading(true);

//       // build common params
//       const common = new URLSearchParams();
//       if (searchFilters.query) common.set('q', searchFilters.query);
//       if (searchFilters.date) common.set('date', searchFilters.date);
//       if (searchFilters.guests) common.set('guests', searchFilters.guests);
//       if (searchFilters.category) common.set('category', searchFilters.category);
//       if (searchFilters.sort) common.set('sort', searchFilters.sort);
//       if (searchFilters.priceRange) common.set('priceRange', searchFilters.priceRange);
//       if (searchFilters.rating) common.set('rating', searchFilters.rating);
//       if (searchFilters.duration) common.set('duration', searchFilters.duration);
//       common.set('source', 'admin');

//       // split per collection
//       const placeParams = new URLSearchParams(common);
//       placeParams.set('approved', 'true');

//       const activityParams = new URLSearchParams(common);
//       activityParams.set('isPublished', 'true');

//       const reqs = [];

//       // Places
//       reqs.push(
//         !searchFilters.type || searchFilters.type === 'place'
//           ? api.get(`/places?${placeParams.toString()}&limit=20`, { silenceToast: true }).catch(() => ({ data: { data: [] } }))
//           : Promise.resolve({ data: { data: [] } })
//       );

//       // Activities
//       reqs.push(
//         !searchFilters.type || searchFilters.type === 'activity'
//           ? api
//               .get(`/activities?${activityParams.toString()}&limit=20`, { silenceToast: true })
//               .catch(() => ({ data: { data: [] } }))
//           : Promise.resolve({ data: { data: [] } })
//       );

//       const [placesRes, activitiesRes] = await Promise.all(reqs);
//       const rawPlaces = Array.isArray(placesRes?.data?.data) ? placesRes.data.data : [];
//       const rawActivities = Array.isArray(activitiesRes?.data?.data) ? activitiesRes.data.data : [];

//       const places = onlyAdminApproved(rawPlaces);
//       const activities = onlyAdminApproved(rawActivities);

//       setResults({ places, activities });
//       setTotalResults(places.length + activities.length);
//     } catch (err) {
//       console.error('Search failed:', err);
//       setResults({ places: [], activities: [] });
//       setTotalResults(0);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchResults(appliedFilters);
//   }, [fetchResults, appliedFilters]);

//   const updateURL = useCallback(
//     (newFilters) => {
//       const params = new URLSearchParams();
//       Object.entries(newFilters).forEach(([key, value]) => {
//         if (!value) return;
//         if (key === 'sort' && value === 'relevance') return;
//         params.set(key, value);
//       });
//       setSearchParams(params);
//     },
//     [setSearchParams]
//   );

//   const applyFilters = () => {
//     setAppliedFilters(filters);
//     updateURL(filters);
//     setShowFilters(false);
//   };

//   const clearFilters = () => {
//     const cleared = {
//       query: filters.query,
//       date: '',
//       guests: '1',
//       type: '',
//       category: '',
//       sort: 'relevance',
//       priceRange: '',
//       rating: '',
//       duration: '',
//     };
//     setFilters(cleared);
//     setAppliedFilters(cleared);
//     updateURL(cleared);
//   };

//   const activeFilterCount = useMemo(
//     () =>
//       Object.entries(appliedFilters).filter(([key, value]) => {
//         if (!value) return false;
//         if (key === 'query' || key === 'guests') return false;
//         if (key === 'sort' && value === 'relevance') return false;
//         return true;
//       }).length,
//     [appliedFilters]
//   );

//   const formatPrice = (price) => {
//     if (typeof price !== 'number') return '₹—';
//     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes) return '—';
//     if (minutes < 60) return `${minutes}m`;
//     const h = Math.floor(minutes / 60);
//     const m = minutes % 60;
//     return m ? `${h}h ${m}m` : `${h}h`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Title / Meta */}
//         <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
//               {query ? `Search results for “${query}”` : 'Explore Experiences'}
//             </h1>
//             <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
//               {loading ? 'Searching…' : `${totalResults.toLocaleString()} experiences found`}
//             </div>
//           </div>

//           {/* Sort + View + Filters */}
//           <div className="flex items-center gap-2">
//             {/* Sort */}
//             <div className="relative">
//               <select
//                 value={filters.sort}
//                 onChange={(e) => {
//                   const nf = { ...filters, sort: e.target.value };
//                   setFilters(nf);
//                   setAppliedFilters(nf);
//                   updateURL(nf);
//                 }}
//                 className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
//               >
//                 {SORT_OPTIONS.map((o) => (
//                   <option key={o.value} value={o.value}>
//                     {o.label}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//             </div>

//             {/* View mode */}
//             <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
//               <button
//                 type="button"
//                 onClick={() => setViewMode('grid')}
//                 className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
//                 aria-label="Grid view"
//               >
//                 <Grid3X3 className="h-4 w-4" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setViewMode('list')}
//                 className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
//                 aria-label="List view"
//               >
//                 <List className="h-4 w-4" />
//               </button>
//             </div>

//             {/* Filters trigger */}
//             <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
//               <SlidersHorizontal className="h-4 w-4 mr-2" />
//               Filters
//               {activeFilterCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
//                   {activeFilterCount}
//                 </span>
//               )}
//             </Button>
//           </div>
//         </div>

//         <div className="flex gap-8">
//           {/* Filters Sidebar */}
//           <div className={`${showFilters ? 'block' : 'hidden lg:block'} w-full lg:w-80 flex-shrink-0`}>
//             <Card className="sticky top-24">
//               <div className="p-6 border-b border-gray-200 dark:border-gray-600">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
//                   <div className="flex items-center space-x-2">
//                     {activeFilterCount > 0 && (
//                       <button type="button" onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">
//                         Clear all
//                       </button>
//                     )}
//                     <button
//                       type="button"
//                       onClick={() => setShowFilters(false)}
//                       className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
//                 {/* Category */}
//                 <div>
//                   <label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">Categories</label>
//                   <div className="space-y-2">
//                     {CATEGORIES.map((cat) => (
//                       <label key={cat.value} className="flex items-center cursor-pointer">
//                         <input
//                           type="radio"
//                           name="category"
//                           value={cat.value}
//                           checked={filters.category === cat.value}
//                           onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//                           className="mr-3 text-primary-600 focus:ring-primary-500"
//                         />
//                         <span className="text-2xl mr-2">{cat.icon}</span>
//                         <span className="text-sm text-gray-700 dark:text-gray-300">{cat.label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Price Range */}
//                 <div>
//                   <label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">Price Range</label>
//                   <div className="space-y-2">
//                     {PRICE_RANGES.map((range) => (
//                       <label key={range.value} className="flex items-center cursor-pointer">
//                         <input
//                           type="radio"
//                           name="priceRange"
//                           value={range.value}
//                           checked={filters.priceRange === range.value}
//                           onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
//                           className="mr-3 text-primary-600 focus:ring-primary-500"
//                         />
//                         <span className="text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Rating */}
//                 <div>
//                   <label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">Minimum Rating</label>
//                   <div className="space-y-2">
//                     {[4.5, 4.0, 3.5, 3.0].map((r) => (
//                       <label key={r} className="flex items-center cursor-pointer">
//                         <input
//                           type="radio"
//                           name="rating"
//                           value={r}
//                           checked={filters.rating === r.toString()}
//                           onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
//                           className="mr-3 text-primary-600 focus:ring-primary-500"
//                         />
//                         <div className="flex items-center">
//                           <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
//                           <span className="text-sm text-gray-700 dark:text-gray-300">{r}+ Stars</span>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Apply */}
//                 <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
//                   <Button
//                     onClick={applyFilters}
//                     className="w-full"
//                     disabled={JSON.stringify(filters) === JSON.stringify(appliedFilters)}
//                   >
//                     Apply Filters
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Results */}
//           <div className="flex-1 min-w-0">
//             {loading ? (
//               <div className="space-y-8">
//                 <SkeletonList count={6} />
//               </div>
//             ) : totalResults === 0 ? (
//               <EmptySearchResults query={query} onClearFilters={clearFilters} hasActiveFilters={activeFilterCount > 0} />
//             ) : (
//               <div className="space-y-12">
//                 {/* Places */}
//                 {results.places.length > 0 && (
//                   <section>
//                     <div className="flex items-center justify-between mb-6">
//                       <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                         Destinations ({results.places.length})
//                       </h2>
//                       {results.places.length > 4 && (
//                         <Link
//                           to={`/search?${new URLSearchParams({ ...appliedFilters, type: 'place' }).toString()}`}
//                           className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
//                         >
//                           View all destinations
//                           <ArrowRight className="h-4 w-4 ml-1" />
//                         </Link>
//                       )}
//                     </div>

//                     <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
//                       {results.places.map((place) => (
//                         <PlaceCard key={place._id} place={place} viewMode={viewMode} />
//                       ))}
//                     </div>
//                   </section>
//                 )}

//                 {/* Activities */}
//                 {results.activities.length > 0 && (
//                   <section>
//                     <div className="flex items-center justify-between mb-6">
//                       <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                         Activities ({results.activities.length})
//                       </h2>
//                       {results.activities.length > 8 && (
//                         <Link
//                           to={`/search?${new URLSearchParams({ ...appliedFilters, type: 'activity' }).toString()}`}
//                           className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
//                         >
//                           View all activities
//                           <ArrowRight className="h-4 w-4 ml-1" />
//                         </Link>
//                       )}
//                     </div>

//                     <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}`}>
//                       {results.activities.map((activity) => (
//                         <ActivityCard
//                           key={activity._id}
//                           activity={activity}
//                           viewMode={viewMode}
//                           formatPrice={formatPrice}
//                           formatDuration={formatDuration}
//                         />
//                       ))}
//                     </div>
//                   </section>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Place Card
// const PlaceCard = ({ place, viewMode }) => (
//   <Link
//     to={`/places/${place._id}`}
//     className={`group block ${viewMode === 'list' ? 'mb-4' : ''}`}
//     aria-label={`Explore ${place.title}`}
//   >
//     <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${viewMode === 'list' ? 'flex' : ''}`}>
//       <div className={`relative bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-56'}`}>
//         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <MapPin className="h-16 w-16 text-white/70" />
//         </div>

//         {/* Admin badge */}
//         <div className="absolute top-3 left-3 z-20">
//           <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-[10px] font-semibold">
//             Admin curated
//           </span>
//         </div>

//         {place?.location?.city && (
//           <div className="absolute top-3 right-3 z-20">
//             <span className="bg-white/90 backdrop-blur text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
//               {place.location.city}
//             </span>
//           </div>
//         )}

//         {place.trending && (
//           <div className="absolute bottom-3 left-3 z-20">
//             <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
//               <TrendingUp className="h-3 w-3 mr-1" />
//               TRENDING
//             </span>
//           </div>
//         )}
//       </div>

//       <CardContent className={`${viewMode === 'list' ? 'flex-1' : ''} p-4`}>
//         <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors dark:text-white line-clamp-2">
//           {place.title || 'Untitled Destination'}
//         </h3>

//         <p className="text-gray-600 text-sm mb-3 line-clamp-2 dark:text-gray-300">
//           {place.description || 'Discover this amazing destination with local experts.'}
//         </p>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             {place.rating?.avg != null && (
//               <div className="flex items-center">
//                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                 <span className="text-sm font-medium ml-1">{Number(place.rating.avg).toFixed(1)}</span>
//               </div>
//             )}
//             {place.rating?.count != null && <span className="text-sm text-gray-500">({place.rating.count})</span>}
//           </div>

//           <div className="flex items-center text-primary-600 font-medium">
//             <span className="text-sm">Explore</span>
//             <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   </Link>
// );

// // Activity Card
// const ActivityCard = ({ activity, viewMode, formatPrice, formatDuration }) => (
//   <Link
//     to={`/activities/${activity._id}`}
//     className={`group block ${viewMode === 'list' ? 'mb-4' : ''}`}
//     aria-label={`Book ${activity.title}`}
//   >
//     <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${viewMode === 'list' ? 'flex' : ''}`}>
//       <div className={`relative bg-gradient-to-br from-secondary-400 to-secondary-600 overflow-hidden ${viewMode === 'list' ? 'w-40 flex-shrink-0' : 'h-40'}`}>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="text-3xl">{getCategoryEmoji(activity.category)}</div>
//         </div>

//         {/* Admin badge */}
//         <div className="absolute top-2 left-2 z-20">
//           <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-[10px] font-semibold">
//             Admin curated
//           </span>
//         </div>

//         {activity.category && (
//           <div className="absolute top-2 right-2">
//             <span className="bg-white/90 backdrop-blur text-gray-900 px-2 py-1 rounded-full text-xs font-medium capitalize">
//               {String(activity.category).replace('_', ' ')}
//             </span>
//           </div>
//         )}

//         <div className="absolute bottom-2 right-2">
//           <div className="flex items-center bg-white/90 backdrop-blur rounded-full px-2 py-1">
//             <Clock className="h-3 w-3 text-gray-600 mr-1" />
//             <span className="text-xs font-medium text-gray-800">
//               {formatDuration(activity.durationMinutes)}
//             </span>
//           </div>
//         </div>
//       </div>

//       <CardContent className={`${viewMode === 'list' ? 'flex-1' : ''} p-4`}>
//         <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors dark:text-white text-sm">
//           {activity.title || 'Untitled Activity'}
//         </h3>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-1">
//             {activity.rating?.avg != null && (
//               <>
//                 <Star className="h-3 w-3 text-yellow-400 fill-current" />
//                 <span className="text-xs font-medium">{Number(activity.rating.avg).toFixed(1)}</span>
//                 {activity.rating?.count != null && (
//                   <span className="text-xs text-gray-500">({activity.rating.count})</span>
//                 )}
//               </>
//             )}
//           </div>

//           <div className="text-right">
//             <div className="text-sm font-bold text-gray-900 dark:text-white">
//               {formatPrice(Number(activity.price ?? activity.basePrice ?? 0))}
//             </div>
//             <div className="text-xs text-gray-500">per person</div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   </Link>
// );

// // Empty Results
// const EmptySearchResults = ({ query, onClearFilters, hasActiveFilters }) => (
//   <div className="text-center py-12">
//     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//       <SearchIcon className="h-10 w-10 text-gray-400" />
//     </div>

//     <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">
//       {query ? `No results found for "${query}"` : 'No experiences found'}
//     </h3>

//     <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
//       {hasActiveFilters
//         ? 'Try adjusting your filters or search terms to find more options.'
//         : 'Try a different search term or browse our popular destinations.'}
//     </p>

//     <div className="space-y-3">
//       {hasActiveFilters && (
//         <Button variant="outline" onClick={onClearFilters}>
//           Clear all filters
//         </Button>
//       )}

//       <div className="flex flex-wrap justify-center gap-2 mt-4">
//         {['Rome', 'Paris', 'Tokyo', 'New York', 'London'].map((city) => (
//           <Link
//             key={city}
//             to={`/search?q=${city}`}
//             className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full transition-colors"
//           >
//             {city}
//           </Link>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// /* ---------- helpers ---------- */
// const getCategoryEmoji = (category) => {
//   const emojiMap = {
//     cultural: '🏛️',
//     food: '🍽️',
//     adventure: '🏔️',
//     nature: '🌿',
//     art: '🎨',
//     entertainment: '🎭',
//     default: '📸',
//   };
//   return emojiMap[String(category || '').toLowerCase()] || emojiMap.default;
// };

// export default Search;







// get your guide 
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search as SearchIcon,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  X,
  ArrowRight,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SkeletonList } from '@/components/ui/LoadingSkeleton';
import Button from '@/components/ui/Button';
import axios from 'axios';

/* ---------------- Inline Axios client with token auth ---------------- */
const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const TOKEN_KEYS = [
  'token','accessToken','jwt','adminToken','superadminToken',
  'vendorToken','managerToken','userToken',
];

function getStoredToken() {
  for (const k of TOKEN_KEYS) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    try {
      const p = JSON.parse(raw);
      if (typeof p === 'string') return p;
      return p?.token || p?.accessToken || p?.data?.token || p?.data?.accessToken || null;
    } catch { return raw; }
  }
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    return u?.token || u?.accessToken || null;
  } catch { return null; }
}

const api = axios.create({ baseURL: API_BASE, withCredentials: true });
api.interceptors.request.use((config) => {
  const t = getStoredToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
/* -------------------------------------------------------------------- */

/* ----------------------- Filter dictionaries ------------------------ */
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },       // default
  { value: 'rating_desc', label: 'Highest Rated' },     // -> sortBy=rating, order=desc
  { value: 'price_asc', label: 'Price: Low to High' },  // -> sortBy=price, order=asc
  { value: 'price_desc', label: 'Price: High to Low' }, // -> sortBy=price, order=desc
  { value: 'popular', label: 'Most Popular' },          // -> sortBy=popularity, order=desc
];

const PRICE_RANGES = [
  { value: '0-50', label: 'Under ₹50' },
  { value: '50-100', label: '₹50 – ₹100' },
  { value: '100-500', label: '₹100 – ₹500' },
  { value: '500-1000', label: '₹500 – ₹1,000' },
  { value: '1000+', label: 'Over ₹1,000' },
];

const CATEGORIES = [
  { value: 'cultural', label: 'Cultural Tours', icon: '🏛️' },
  { value: 'food', label: 'Food & Drink', icon: '🍽️' },
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
  { value: 'art', label: 'Art & History', icon: '🎨' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
];

/* ----------------------- helpers for mapping ------------------------ */
function toPriceMinMax(range) {
  if (!range) return {};
  if (range.endsWith('+')) return { minPrice: Number(range.replace('+','')) };
  const [a, b] = range.split('-').map(Number);
  return { minPrice: isNaN(a) ? undefined : a, maxPrice: isNaN(b) ? undefined : b };
}

function toDurationMinMax(bucket) {
  // buckets: 'short','halfday','fullday','multiday'
  switch (bucket) {
    case 'short': return { minDuration: 0, maxDuration: 120 };      // 0–2h
    case 'halfday': return { minDuration: 121, maxDuration: 300 };  // 2–5h
    case 'fullday': return { minDuration: 301, maxDuration: 600 };  // 5–10h
    case 'multiday': return { minDuration: 601 };                    // >10h
    default: return {};
  }
}

function sortMapping(value) {
  switch (value) {
    case 'rating_desc': return { sortBy: 'rating', order: 'desc' };
    case 'price_asc':   return { sortBy: 'price', order: 'asc' };
    case 'price_desc':  return { sortBy: 'price', order: 'desc' };
    case 'popular':     return { sortBy: 'popularity', order: 'desc' };
    default:            return {}; // relevance → backend decides
  }
}

function robustPick(res, key) {
  const d = res?.data;
  const arr =
    d?.[key] ||
    d?.data?.[key] ||
    d?.data ||
    d?.docs ||
    d?.results ||
    d;
  return Array.isArray(arr) ? arr : [];
}

const formatINR = (price) =>
  typeof price !== 'number'
    ? '₹—'
    : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const formatDuration = (minutes) => {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const getCategoryEmoji = (category) => {
  const emojiMap = {
    heritage: '🏛️', food: '🍽️', art: '🎨', nature: '🌿', adventure: '🚵', cultural: '🎭', 'food & drink': '🍷', default: '📸',
  };
  return emojiMap[category?.toLowerCase()] || emojiMap.default;
};
/* -------------------------------------------------------------------- */

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  // read URL
  const query = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || ''; // '', 'place', 'activity'
  const categoryParam = (searchParams.get('category') || '').toLowerCase();
  const priceParam = searchParams.get('priceRange') || '';
  const ratingParam = searchParams.get('rating') || '';
  const durationParam = searchParams.get('duration') || '';
  const sortParam = searchParams.get('sort') || 'relevance';

  // state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState({ places: [], activities: [] });
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'grid');
  useEffect(() => localStorage.setItem('viewMode', viewMode), [viewMode]);

  const [filters, setFilters] = useState({
    q: query,
    type: typeParam,             // '', 'place', 'activity'
    category: categoryParam,     // slug
    priceRange: priceParam,      // '100-500', '1000+'
    rating: ratingParam,         // '4','4.5','5'
    duration: durationParam,     // 'short','halfday','fullday','multiday'
    sort: sortParam,             // 'relevance','rating_desc','price_asc','price_desc','popular'
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // debounce
  const debounceRef = useRef();
  const debouncedApply = (next) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAppliedFilters(next);
      updateURL(next);
    }, 200);
  };

  // build params for each endpoint from appliedFilters
  const buildCommonParams = (f) => {
    const p = new URLSearchParams();
    if (f.q) p.set('q', f.q.trim());
    if (f.category) p.set('category', f.category.toLowerCase());
    if (f.rating) p.set('minRating', f.rating); // backend should treat as >=
    const { minPrice, maxPrice } = toPriceMinMax(f.priceRange);
    if (minPrice !== undefined) p.set('minPrice', String(minPrice));
    if (maxPrice !== undefined) p.set('maxPrice', String(maxPrice));
    const { minDuration, maxDuration } = toDurationMinMax(f.duration);
    if (minDuration !== undefined) p.set('minDuration', String(minDuration));
    if (maxDuration !== undefined) p.set('maxDuration', String(maxDuration));
    const s = sortMapping(f.sort);
    if (s.sortBy) p.set('sortBy', s.sortBy);
    if (s.order) p.set('order', s.order);
    p.set('_t', Date.now().toString()); // cache bust
    return p;
  };

  const LIMIT_PLACES = 24;
  const LIMIT_ACTIVITIES = 24;

  const fetchResults = useCallback(
    async (f) => {
      try {
        setLoading(true);
        setError('');

        const paramsPlaces = buildCommonParams(f);
        paramsPlaces.set('approved', 'true');
        paramsPlaces.set('limit', String(LIMIT_PLACES));

        const paramsActivities = buildCommonParams(f);
        paramsActivities.set('isPublished', 'true');
        paramsActivities.set('limit', String(LIMIT_ACTIVITIES));

        const wantPlaces = !f.type || f.type === 'place';
        const wantActivities = !f.type || f.type === 'activity';

        const reqs = [
          wantPlaces ? api.get(`/places?${paramsPlaces.toString()}`, { silenceToast: true }).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          wantActivities ? api.get(`/activities?${paramsActivities.toString()}`, { silenceToast: true }).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ];

        const [placesRes, activitiesRes] = await Promise.all(reqs);

        const newPlaces = robustPick(placesRes, 'places');
        const newActivities = robustPick(activitiesRes, 'activities');

        setResults({ places: newPlaces, activities: newActivities });
        setTotalResults(newPlaces.length + newActivities.length);
      } catch (e) {
        console.error('search failed', e);
        setError('Could not load results. Please try again.');
        setResults({ places: [], activities: [] });
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // run on initial & whenever appliedFilters change
  useEffect(() => { fetchResults(appliedFilters); }, [fetchResults, appliedFilters]);

  const updateURL = useCallback((f) => {
    const params = new URLSearchParams();
    if (f.q) params.set('q', f.q);
    if (f.type) params.set('type', f.type);
    if (f.category) params.set('category', f.category);
    if (f.priceRange) params.set('priceRange', f.priceRange);
    if (f.rating) params.set('rating', f.rating);
    if (f.duration) params.set('duration', f.duration);
    if (f.sort && f.sort !== 'relevance') params.set('sort', f.sort);
    setSearchParams(params);
  }, [setSearchParams]);

  const clearFilters = () => {
    const cleared = { q: filters.q, type: '', category: '', priceRange: '', rating: '', duration: '', sort: 'relevance' };
    setFilters(cleared);
    setAppliedFilters(cleared);
    updateURL(cleared);
  };

  const activeFilterEntries = useMemo(
    () => Object.entries(appliedFilters).filter(([k, v]) => !!v && !['q'].includes(k) && !(k === 'sort' && v === 'relevance')),
    [appliedFilters]
  );

  const removeChip = (k) => {
    const next = { ...appliedFilters, [k]: '' };
    setAppliedFilters(next);
    setFilters((f) => ({ ...f, [k]: '' }));
    updateURL(next);
  };

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {filters.q ? `Search results for “${filters.q}”` : 'Explore Experiences'}
            </h1>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {loading ? 'Searching…' : `${totalResults.toLocaleString()} experiences found`}
            </div>
          </div>

          {/* view + sort + filters button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 inline-flex items-center gap-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                title="Grid view"
              >
                <Grid3X3 className="h-4 w-4" /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 inline-flex items-center gap-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                title="List view"
              >
                <List className="h-4 w-4" /> List
              </button>
            </div>

            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => {
                  const next = { ...filters, sort: e.target.value };
                  setFilters(next);
                  debouncedApply(next);
                }}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                aria-label="Sort results"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* mobile-only filters button */}
            <Button onClick={() => setShowFilters(true)} className="inline-flex items-center gap-2 lg:hidden" aria-expanded={showFilters}>
              <SlidersHorizontal className="h-4 w-4" />
              Filters {activeFilterEntries.length ? `(${activeFilterEntries.length})` : ''}
            </Button>
          </div>
        </div>

        {/* active chips */}
        {activeFilterEntries.length > 0 && (
          <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterEntries.map(([k, v]) => (
                <Chip key={k} onRemove={() => removeChip(k)}>
                  {k === 'priceRange' ? `Price ${v}` :
                   k === 'rating' ? `${v}+ stars` :
                   k === 'duration' ? v :
                   k === 'type' ? (v === 'activity' ? 'Activities' : 'Places') :
                   v}
                </Chip>
              ))}
              <Button variant="outline" size="sm" onClick={clearFilters} className="ml-auto">Clear</Button>
            </div>
          </div>
        )}

        {/* error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div className="text-sm">
              {error}{' '}
              <button className="underline" onClick={() => fetchResults(appliedFilters)}>
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* sidebar (desktop) */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FiltersPanel
              filters={filters}
              setFilters={setFilters}
              apply={(next) => debouncedApply(next)}
              applyNow={() => { setAppliedFilters(filters); updateURL(filters); }}
            />
          </div>

          {/* results */}
          <div className="flex-1 min-w-0">
            {loading && results.places.length === 0 && results.activities.length === 0 ? (
              <div className="space-y-8"><SkeletonList count={6} /></div>
            ) : (results.places.length + results.activities.length) === 0 ? (
              <EmptySearchResults query={filters.q} onClearFilters={clearFilters} hasActiveFilters={activeFilterEntries.length > 0} />
            ) : (
              <div className="space-y-12">
                {/* places */}
                {(!appliedFilters.type || appliedFilters.type === 'place') && results.places.length > 0 && (
                  <section aria-label="Destinations">
                    <HeaderWithCount title="Destinations" count={results.places.length}>
                      {results.places.length > 4 && (
                        <Link
                          to={`/search?${new URLSearchParams({ ...appliedFilters, type: 'place' }).toString()}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                        >
                          View all destinations
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      )}
                    </HeaderWithCount>

                    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                      {results.places.map((place) => (
                        <PlaceCard key={place._id || place.id} place={place} viewMode={viewMode} />
                      ))}
                    </div>
                  </section>
                )}

                {/* activities */}
                {(!appliedFilters.type || appliedFilters.type === 'activity') && results.activities.length > 0 && (
                  <section aria-label="Activities">
                    <HeaderWithCount title="Activities" count={results.activities.length}>
                      {results.activities.length > 8 && (
                        <Link
                          to={`/search?${new URLSearchParams({ ...appliedFilters, type: 'activity' }).toString()}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                        >
                          View all activities
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      )}
                    </HeaderWithCount>

                    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                      {results.activities.map((activity) => (
                        <ActivityCard key={activity._id || activity.id} activity={activity} viewMode={viewMode} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Filters</h3>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setShowFilters(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>

            <FiltersPanel
              filters={filters}
              setFilters={setFilters}
              apply={(next) => debouncedApply(next)}
              applyNow={() => { setAppliedFilters(filters); updateURL(filters); setShowFilters(false); }}
              mobile
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- Filters panel --------------------------- */
function FiltersPanel({ filters, setFilters, apply, applyNow, mobile = false }) {
  const row = (children) => <div className="space-y-2">{children}</div>;

  return (
    <Card>
      <CardContent className="p-4 space-y-6">
        {/* type */}
        {row(
          <>
            <label className="block text-sm font-medium mb-1">Type</label>
            <div className="flex gap-2">
              {[
                { v: '', label: 'All' },
                { v: 'place', label: 'Places' },
                { v: 'activity', label: 'Activities' },
              ].map((t) => (
                <button
                  key={t.v || 'all'}
                  onClick={() => { const next = { ...filters, type: t.v }; setFilters(next); apply(next); }}
                  className={`px-3 py-1.5 rounded-full text-sm border ${filters.type === t.v ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  aria-pressed={filters.type === t.v}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* category */}
        {row(
          <>
            <label className="block text-sm font-medium mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    const next = { ...filters, category: filters.category === c.value ? '' : c.value };
                    setFilters(next); apply(next);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm border ${filters.category === c.value ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  aria-pressed={filters.category === c.value}
                >
                  <span className="mr-1">{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* price */}
        {row(
          <>
            <label className="block text-sm font-medium mb-1">Price</label>
            <div className="space-y-2">
              {PRICE_RANGES.map((r) => (
                <label key={r.value} className="flex items-center">
                  <input
                    type="radio"
                    name={`price${mobile ? '-m' : ''}`}
                    value={r.value}
                    checked={filters.priceRange === r.value}
                    onChange={(e) => { const next = { ...filters, priceRange: e.target.value }; setFilters(next); apply(next); }}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`price${mobile ? '-m' : ''}`}
                  value=""
                  checked={filters.priceRange === ''}
                  onChange={() => { const next = { ...filters, priceRange: '' }; setFilters(next); apply(next); }}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">Any</span>
              </label>
            </div>
          </>
        )}

        {/* rating */}
        {row(
          <>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="space-y-2">
              {[5, 4.5, 4].map((r) => (
                <label key={r} className="flex items-center">
                  <input
                    type="radio"
                    name={`rating${mobile ? '-m' : ''}`}
                    value={String(r)}
                    checked={filters.rating === String(r)}
                    onChange={(e) => { const next = { ...filters, rating: e.target.value }; setFilters(next); apply(next); }}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm">{r}+ Stars</span>
                  </div>
                </label>
              ))}
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`rating${mobile ? '-m' : ''}`}
                  value=""
                  checked={filters.rating === ''}
                  onChange={() => { const next = { ...filters, rating: '' }; setFilters(next); apply(next); }}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">Any</span>
              </label>
            </div>
          </>
        )}

        {/* duration */}
        {row(
          <>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <div className="space-y-2">
              {[
                { v: 'short', label: 'Up to 2 hours' },
                { v: 'halfday', label: '2–5 hours' },
                { v: 'fullday', label: '5–10 hours' },
                { v: 'multiday', label: '10+ hours' },
              ].map((d) => (
                <label key={d.v} className="flex items-center">
                  <input
                    type="radio"
                    name={`duration${mobile ? '-m' : ''}`}
                    value={d.v}
                    checked={filters.duration === d.v}
                    onChange={(e) => { const next = { ...filters, duration: e.target.value }; setFilters(next); apply(next); }}
                    className="mr-3 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{d.label}</span>
                </label>
              ))}
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`duration${mobile ? '-m' : ''}`}
                  value=""
                  checked={filters.duration === ''}
                  onChange={() => { const next = { ...filters, duration: '' }; setFilters(next); apply(next); }}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">Any</span>
              </label>
            </div>
          </>
        )}

        <div className="pt-2">
          <Button onClick={applyNow} className="w-full">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* --------------------------- UI bits (cards) -------------------------- */
function HeaderWithCount({ title, count, children }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {title} ({count})
      </h2>
      {children}
    </div>
  );
}

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {children}
      <button onClick={onRemove} className="ml-1 rounded-full p-0.5 hover:bg-gray-200" aria-label="Remove filter">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function RatingPill({ rating, count }) {
  if (!rating && !count) return null;
  const r = rating ? Number(rating).toFixed(1) : 'New';
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 text-xs font-semibold">
      <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
      <span>{r}</span>
      {count ? <span className="text-emerald-600/70">({count})</span> : null}
    </span>
  );
}

function PerksRow({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
      {items.map((p, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          {p}
        </span>
      ))}
    </div>
  );
}

function PriceLine({ amount, per = 'per person' }) {
  if (!amount) return null;
  return (
    <div className="mt-2 flex items-baseline gap-1">
      <span className="text-xs text-gray-500">From</span>
      <span className="text-lg font-extrabold text-gray-900 dark:text-white">{amount}</span>
      <span className="text-xs text-gray-500">{per}</span>
    </div>
  );
}

function ActivityCard({ activity }) {
  const title = activity?.title || 'Untitled Activity';
  const city = activity?.place?.city || activity?.city || activity?.location?.city;
  const duration =
    activity?.duration ||
    (activity?.durationMinutes ? formatDuration(activity.durationMinutes) : null);
  const rating = activity?.rating?.avg;
  const count = activity?.rating?.count;

  return (
    <Link to={`/activities/${activity._id || activity.id}`} className="group block" aria-label={`Book ${title}`}>
      <Card className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all">
        <div className="relative h-44 bg-gradient-to-br from-gray-200 to-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl">{getCategoryEmoji(activity?.category)}</div>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {city ? <Pill>{city}</Pill> : null}
            {activity?.category ? <Pill className="capitalize">{activity.category}</Pill> : null}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[15px] font-bold text-gray-900 dark:text-white group-hover:text-primary-600">
              {title}
            </h3>
            <RatingPill rating={rating} count={count} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            {duration ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                {duration}
              </span>
            ) : null}
            {city ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                {city}
              </span>
            ) : null}
          </div>

          <PerksRow items={['Free cancellation', 'Reserve now & pay later']} />
          <PriceLine amount={formatINR(activity?.basePrice)} />
        </CardContent>
      </Card>
    </Link>
  );
}

function PlaceCard({ place }) {
  const title = place?.title || place?.name || 'Untitled destination';
  const city = place?.city || place?.location?.city || place?.location;
  const rating = place?.rating?.avg;
  const count = place?.rating?.count;

  return (
    <Link to={`/places/${place._id || place.id}`} className="group block" aria-label={`Explore ${title}`}>
      <Card className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all">
        <div className="relative h-52 bg-gradient-to-br from-gray-200 to-gray-100">
          {place?.featured ? (
            <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Featured
            </div>
          ) : null}
          {city ? (
            <div className="absolute bottom-3 left-3">
              <Pill><MapPin className="inline h-3.5 w-3.5 mr-1" />{city}</Pill>
            </div>
          ) : null}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[15px] font-bold text-gray-900 dark:text-white group-hover:text-primary-600">
              {title}
            </h3>
            <RatingPill rating={rating} count={count} />
          </div>

          <PerksRow items={['Top sights', 'Locals recommend']} />
          <div className="mt-3 inline-flex items-center text-primary-600 font-medium">
            <span className="text-sm">Explore</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Pill({ children, className = '' }) {
  return (
    <span className={`rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 ${className}`}>
      {children}
    </span>
  );
}

function EmptySearchResults({ query, onClearFilters, hasActiveFilters }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-primary-700 mb-4">
        <SearchIcon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">No results</h3>
      <p className="text-gray-600 dark:text-gray-400">
        {query ? <>Couldn’t find matches for “{query}”.</> : 'Try adjusting your filters.'}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        {hasActiveFilters ? (
          <Button variant="outline" onClick={onClearFilters}>Clear filters</Button>
        ) : (
          <Link to="/"><Button>Go to Home</Button></Link>
        )}
      </div>
    </div>
  );
}
