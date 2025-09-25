
// import { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   Search,
//   MapPin,
//   Calendar,
//   Users,
//   Star,
//   ArrowRight,
//   Clock,
//   Award,
//   Globe,
// } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/Card';
// import { SkeletonCard } from '@/components/ui/LoadingSkeleton';
// import Button from '@/components/ui/Button';
// // ❌ remove this: import api from '@/lib/api';
// import axios from 'axios';

// /* ---------------- Inline Axios client with token auth ---------------- */
// const API_BASE =
//   import.meta.env.VITE_BACKEND_URL ||
//   import.meta.env.VITE_API_URL ||
//   'http://localhost:5000/api';

// const TOKEN_KEYS = [
//   'token','accessToken','jwt','adminToken','superadminToken',
//   'vendorToken','managerToken','userToken',
// ];

// function getStoredToken() {
//   for (const k of TOKEN_KEYS) {
//     const raw = localStorage.getItem(k);
//     if (!raw) continue;
//     try {
//       const p = JSON.parse(raw);
//       if (typeof p === 'string') return p;
//       return (
//         p?.token || p?.accessToken ||
//         p?.data?.token || p?.data?.accessToken || null
//       );
//     } catch {
//       return raw; // plain string
//     }
//   }
//   try {
//     const u = JSON.parse(localStorage.getItem('user') || 'null');
//     return u?.token || u?.accessToken || null;
//   } catch { return null; }
// }

// const API = axios.create({ baseURL: API_BASE, withCredentials: true });
// API.interceptors.request.use((config) => {
//   const t = getStoredToken();
//   if (t) config.headers.Authorization = `Bearer ${t}`;
//   return config;
// });
// /* -------------------------------------------------------------------- */

// /* ----------------------------- helpers (top) ----------------------------- */
// const heroImages = [
//   "/images/Howrah-Bridge.jpg",
//   "/images/Pareshnath-Jain-Temple.jpg",
//   "/images/Victoria-Memorial.jpg",
// ];

// // Normalize different backend shapes into a flat array
// function pickArray(res, key) {
//   const d = res?.data;
//   const arr =
//     d?.[key] ||
//     d?.data?.[key] ||
//     d?.docs ||
//     d?.results ||
//     d?.data ||
//     d;
//   return Array.isArray(arr) ? arr : [];
// }

// const getCategoryEmoji = (category) => {
//   const emojiMap = {
//     heritage: '🏛️',
//     food: '🍽️',
//     art: '🎨',
//     nature: '🌿',
//     adventure: '🚵',
//     cultural: '🎭',
//     'food & drink': '🍷',
//     default: '📸',
//   };
//   return emojiMap[category?.toLowerCase()] || emojiMap.default;
// };

// const formatDuration = (minutes) => {
//   if (!minutes) return '—';
//   if (minutes < 60) return `${minutes}m`;
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;
//   return m ? `${h}h ${m}m` : `${h}h`;
// };

// const formatINR = (price) => {
//   if (typeof price !== 'number') return '₹—';
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0,
//   }).format(price);
// };
// /* ------------------------------------------------------------------------ */

// export default function Home() {
//   const navigate = useNavigate();

//   // Search form state
//   const [searchForm, setSearchForm] = useState({
//     location: '',
//     date: '',
//     guests: '1',
//     category: '',
//   });

//   // Content state
//   const [content, setContent] = useState({
//     featuredPlaces: [],
//     featuredActivities: [],
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // ✅ Fetch homepage content (featured places & activities)
//   const fetchContent = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const [placesRes, activitiesRes] = await Promise.all([
//         API.get('/places', { params: { featured: true, limit: 6 }, silenceToast: true }),
//         API.get('/activities', {
//           params: { featured: true, isPublished: true, limit: 8 },
//           silenceToast: true,
//         }),
//       ]);

//       const places = pickArray(placesRes, 'places');
//       const activities = pickArray(activitiesRes, 'activities');

//       setContent({
//         featuredPlaces: places,
//         featuredActivities: activities,
//       });
//     } catch (e) {
//       console.error('Failed to fetch homepage content:', e);
//       setError('Failed to load content. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchContent();
//   }, [fetchContent]);

//   // ✅ Search handler (enabled)
//   const handleSearch = (e) => {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (searchForm.location.trim()) params.set('q', searchForm.location.trim());
//     if (searchForm.date) params.set('date', searchForm.date);
//     if (searchForm.guests) params.set('guests', searchForm.guests);
//     if (searchForm.category) params.set('category', searchForm.category);
//     navigate(`/search?${params.toString()}`);
//   };

//   // ------------------------- Hero slideshow state -------------------------
//   const [currentIndex, setCurrentIndex] = useState(0);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % heroImages.length);
//     }, 2500);
//     return () => clearInterval(interval);
//   }, []);
//   // ------------------------------------------------------------------------

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <Button onClick={fetchContent}>Try Again</Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-16 ">
//       {/* Hero Section with sliding background */}
//       <section className="relative text-white overflow-hidden">
//         {/* Sliding background images */}
//         <div
//           className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
//           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//           aria-hidden="true"
//         >
//           {heroImages.map((src, i) => (
//             <div
//               key={i}
//               className="w-full h-full flex-shrink-0 bg-cover bg-center"
//               style={{ backgroundImage: `url(${src})` }}
//             />
//           ))}
//         </div>

//         {/* Dark overlay */}
//         <div className="absolute inset-0 bg-black/140" />

//         {/* Content */}
//         <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 mb-6">
//               <Award className="h-4 w-4 text-yellow-300" />
//               <span className="text-sm font-medium">Trusted by 1M+ travelers worldwide</span>
//             </div>

//             <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
//               Discover Amazing
//               <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
//                 Local Experiences
//               </span>
//             </h1>

//             <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
//               Connect with expert local guides and instructors for authentic,
//               unforgettable adventures around the world.
//             </p>

//             {/* ✅ Search Form wired up */}
//             <form onSubmit={handleSearch} className="max-w-5xl mx-auto bg-white/50 backdrop-blur rounded-2xl shadow-2xl p-6" role="search" aria-label="Search experiences">
//               <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                 <div className="relative lg:col-span-2">
//                   <label htmlFor="location" className="sr-only">Where to?</label>
//                   <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <input
//                     id="location"
//                     type="text"
//                     value={searchForm.location}
//                     onChange={(e) => setSearchForm((prev) => ({ ...prev, location: e.target.value }))}
//                     placeholder="Where do you want to go?"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
//                   />
//                 </div>

//                 <div className="relative">
//                   <label htmlFor="date" className="sr-only">When?</label>
//                   <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <input
//                     id="date"
//                     type="date"
//                     value={searchForm.date}
//                     onChange={(e) => setSearchForm((prev) => ({ ...prev, date: e.target.value }))}
//                     min={new Date().toISOString().split('T')[0]}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
//                   />
//                 </div>

//                 <div className="relative">
//                   <label htmlFor="guests" className="sr-only">Guests</label>
//                   <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <select
//                     id="guests"
//                     value={searchForm.guests}
//                     onChange={(e) => setSearchForm((prev) => ({ ...prev, guests: e.target.value }))}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white appearance-none"
//                   >
//                     {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
//                       <option key={num} value={num}>
//                         {num} Guest{num !== 1 ? 's' : ''}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <Button type="submit" size="lg" className="w-full h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
//                   <Search className="mr-2 h-5 w-5" />
//                   Search
//                 </Button>
//               </div>

//               {/* Quick Category Filters */}
//               <div className="flex flex-wrap gap-2 mt-4 justify-center">
//                 {['Cultural', 'Adventure', 'Food & Drink', 'Nature', 'Art & History'].map((category) => (
//                   <button
//                     key={category}
//                     type="button"
//                     onClick={() => setSearchForm((prev) => ({ ...prev, category }))}
//                     className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//                       searchForm.category === category
//                         ? 'bg-primary-600 text-white'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {category}
//                   </button>
//                 ))}
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Nav dots */}
//         <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
//           {heroImages.map((_, i) => (
//             <span
//               key={i}
//               className={`h-1.5 w-6 rounded-full transition-all ${i === currentIndex ? 'bg-white/90' : 'bg-white/40'}`}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//           {[
//             { icon: Globe, label: 'Destinations', value: '500+' },
//             { icon: Users, label: 'Expert Guides', value: '10,000+' },
//             { icon: Star, label: 'Average Rating', value: '4.8' },
//             { icon: Award, label: 'Happy Travelers', value: '1M+' },
//           ].map((stat) => (
//             <div key={stat.label} className="text-center">
//               <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
//                 <stat.icon className="h-6 w-6 text-primary-600" />
//               </div>
//               <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
//               <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Featured Destinations */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 dark:text-white">Popular in Kolkata</h2>
//           <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">A consistent, admin-curated list of top places to visit in Kolkata</p>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
//           </div>
//         ) : content.featuredPlaces.length ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {content.featuredPlaces.map((place) => <PlaceCard key={place._id} place={place} />)}
//           </div>
//         ) : (
//           <EmptyState
//             title="No curated places yet"
//             description="Ask an admin to add the Kolkata top 10."
//             action={{ label: 'Explore all places', href: '/search?type=place' }}
//           />
//         )}
//       </section>

//       {/* Popular Activities */}
//       <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 dark:from-gray-800 dark:to-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 dark:text-white">Popular Activities</h2>
//             <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Unique experiences curated by local experts and highly rated by travelers</p>
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
//             </div>
//           ) : content.featuredActivities.length ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {content.featuredActivities.map((activity) => <ActivityCard key={activity._id} activity={activity} />)}
//             </div>
//           ) : (
//             <EmptyState
//               title="No activities available"
//               description="Be the first to discover amazing experiences"
//               action={{ label: 'Browse activities', href: '/search?type=activity' }}
//             />
//           )}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-blue-800 text-white relative overflow-hidden">
//         <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
//           <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
//             Join millions of travelers discovering unique experiences worldwide. Book with confidence.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <Button as={Link} to="/search" size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
//               Explore Experiences
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//             <Button
//               as={Link}
//               to="/auth/signup"
//               size="lg"
//               variant="outline"
//               className="border-white text-white hover:bg-white hover:text-primary-600"
//             >
//               Become a Guide
//             </Button>
//           </div>

//           <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-white/80">
//             <div className="flex items-center">
//               <Star className="h-4 w-4 text-yellow-300 mr-1" />
//               4.8 average rating
//             </div>
//             <div className="hidden sm:block">•</div>
//             <div>Free cancellation</div>
//             <div className="hidden sm:block">•</div>
//             <div>24/7 support</div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* --------------------------- leaf UI components --------------------------- */

// function PlaceCard({ place }) {
//   const title = place.title || place.name || 'Untitled Destination';
//   return (
//     <Link to={`/places/${place._id}`} className="group block" aria-label={`Explore ${title}`}>
//       <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//         <div className="relative h-56 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <MapPin className="h-16 w-16 text-white/70" />
//           </div>

//           {(place.city || place.location?.city || place.location) && (
//             <div className="absolute top-4 right-4 z-20">
//               <span className="bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
//                 {place.city || place.location?.city || place.location}
//               </span>
//             </div>
//           )}

//           {place.featured && (
//             <div className="absolute top-4 left-4 z-20">
//               <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">FEATURED</span>
//             </div>
//           )}
//         </div>

//         <CardContent className="p-6">
//           <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors dark:text-white line-clamp-2">
//             {title}
//           </h3>

//           <p className="text-gray-600 text-sm mb-4 line-clamp-3 dark:text-gray-300">
//             {place.description || 'Discover this amazing destination with local experts.'}
//           </p>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="flex items-center">
//                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                 <span className="text-sm font-medium ml-1">
//                   {place.rating?.avg ? Number(place.rating.avg).toFixed(1) : 'New'}
//                 </span>
//               </div>
//               {place.rating?.count ? (
//                 <span className="text-sm text-gray-500">({place.rating.count} reviews)</span>
//               ) : null}
//             </div>

//             <div className="flex items-center text-primary-600 font-medium">
//               <span className="text-sm">Explore</span>
//               <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }

// function ActivityCard({ activity }) {
//   const title = activity.title || 'Untitled Activity';
//   return (
//     <Link to={`/activities/${activity._id}`} className="group block" aria-label={`Book ${title}`}>
//       <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
//         <div className="relative h-48 bg-gradient-to-br from-secondary-400 to-secondary-600 overflow-hidden">
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-4xl">{getCategoryEmoji(activity.category)}</div>
//           </div>

//           {activity.category && (
//             <div className="absolute top-3 left-3">
//               <span className="bg-white/90 backdrop-blur text-gray-900 px-2 py-1 rounded-full text-xs font-medium capitalize">
//                 {activity.category}
//               </span>
//             </div>
//           )}

//           <div className="absolute bottom-3 right-3">
//             <div className="flex items-center bg-white/90 backdrop-blur rounded-full px-2 py-1">
//               <Clock className="h-3 w-3 text-gray-600 mr-1" />
//               <span className="text-xs font-medium text-gray-800">
//                 {activity.duration || formatDuration(activity.durationMinutes)}
//               </span>
//             </div>
//           </div>
//         </div>

//         <CardContent className="p-4">
//           <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors dark:text-white text-sm">
//             {title}
//           </h3>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-1">
//               {activity.rating?.avg && (
//                 <>
//                   <Star className="h-3 w-3 text-yellow-400 fill-current" />
//                   <span className="text-xs font-medium">{Number(activity.rating.avg).toFixed(1)}</span>
//                 </>
//               )}
//             </div>

//             <div className="text-right">
//               <div className="text-sm font-bold text-gray-900 dark:text-white">
//                 {formatINR(activity.basePrice)}
//               </div>
//               <div className="text-xs text-gray-500">per person</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }

// function EmptyState({ title, description, action }) {
//   return (
//     <div className="text-center py-12">
//       <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">{title}</h3>
//       <p className="text-gray-600 mb-4 dark:text-gray-400">{description}</p>
//       {action ? (
//         <Button as={Link} to={action.href}>
//           {action.label}
//         </Button>
//       ) : null}
//     </div>
//   );
// }





// get your guide
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Clock,
  Award,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/LoadingSkeleton';
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
      return (
        p?.token || p?.accessToken ||
        p?.data?.token || p?.data?.accessToken || null
      );
    } catch {
      return raw; // plain string
    }
  }
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    return u?.token || u?.accessToken || null;
  } catch { return null; }
}

const API = axios.create({ baseURL: API_BASE, withCredentials: true });
API.interceptors.request.use((config) => {
  const t = getStoredToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
/* -------------------------------------------------------------------- */

/* ----------------------------- helpers (top) ----------------------------- */
const heroImages = [
  "/images/Pareshnath-Jain-Temple.jpg",
  "/images/Victoria-Memorial.jpg",
  "/images/sea.jpg",
  "/images/mountain.jpg",
];

// Normalize different backend shapes into a flat array
function pickArray(res, key) {
  const d = res?.data;
  const arr =
    d?.[key] ||
    d?.data?.[key] ||
    d?.docs ||
    d?.results ||
    d?.data ||
    d;
  return Array.isArray(arr) ? arr : [];
}

const getCategoryEmoji = (category) => {
  const emojiMap = {
    heritage: '🏛️',
    food: '🍽️',
    art: '🎨',
    nature: '🌿',
    adventure: '🚵',
    cultural: '🎭',
    'food & drink': '🍷',
    default: '📸',
  };
  return emojiMap[category?.toLowerCase()] || emojiMap.default;
};

const formatDuration = (minutes) => {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const formatINR = (price) => {
  if (typeof price !== 'number') return '₹—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};
/* ------------------------------------------------------------------------ */

export default function Home() {
  const navigate = useNavigate();

  // Search form state
  const [searchForm, setSearchForm] = useState({
    location: '',
    date: '',
    guests: '1',
    category: '',
  });

  // Content state
  const [content, setContent] = useState({
    featuredPlaces: [],
    featuredActivities: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch homepage content (featured places & activities)
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [placesRes, activitiesRes] = await Promise.all([
        API.get('/places', { params: { featured: true, limit: 6 }, silenceToast: true }),
        API.get('/activities', {
          params: { featured: true, isPublished: true, limit: 8 },
          silenceToast: true,
        }),
      ]);

      const places = pickArray(placesRes, 'places');
      const activities = pickArray(activitiesRes, 'activities');

      setContent({
        featuredPlaces: places,
        featuredActivities: activities,
      });
    } catch (e) {
      console.error('Failed to fetch homepage content:', e);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // ✅ Search handler (enabled)
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchForm.location.trim()) params.set('q', searchForm.location.trim());
    if (searchForm.date) params.set('date', searchForm.date);
    if (searchForm.guests) params.set('guests', searchForm.guests);
    if (searchForm.category) params.set('category', searchForm.category);
    navigate(`/search?${params.toString()}`);
  };

  // ------------------------- Hero slideshow state -------------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  // ------------------------------------------------------------------------

  // Full-page subtle overlay while nothing is rendered yet (GYG-like feel)
  const showPageLoader =
    loading &&
    content.featuredPlaces.length === 0 &&
    content.featuredActivities.length === 0 &&
    !error;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchContent}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 ">
      {/* Page overlay loader (simple, inline, no new file) */}
      {showPageLoader && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-primary-600 animate-spin" />
            <p className="text-sm text-gray-600">Loading experiences…</p>
          </div>
        </div>
      )}

      {/* Hero Section with sliding background */}
      <section className="relative text-white overflow-hidden">
        {/* Sliding background images */}
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          aria-hidden="true"
        >
          {heroImages.map((src, i) => (
            <div
              key={i}
              className="w-full h-full flex-shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/140" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 mb-6">
              <Award className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">Trusted by 1M+ travelers worldwide</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Local Experiences
              </span>
            </h1>

            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Connect with expert local guides and instructors for authentic,
              unforgettable adventures around the world.
            </p>

            {/* ✅ Search Form wired up */}
            <form onSubmit={handleSearch} className="max-w-5xl mx-auto bg-white/50 backdrop-blur rounded-2xl shadow-2xl p-6" role="search" aria-label="Search experiences">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="relative lg:col-span-2">
                  <label htmlFor="location" className="sr-only">Where to?</label>
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="location"
                    type="text"
                    value={searchForm.location}
                    onChange={(e) => setSearchForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Where do you want to go?"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="date" className="sr-only">When?</label>
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="date"
                    type="date"
                    value={searchForm.date}
                    onChange={(e) => setSearchForm((prev) => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="guests" className="sr-only">Guests</label>
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    id="guests"
                    value={searchForm.guests}
                    onChange={(e) => setSearchForm((prev) => ({ ...prev, guests: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" size="lg" className="w-full h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>

              {/* Quick Category Filters */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['Cultural', 'Adventure', 'Food & Drink', 'Nature', 'Art & History'].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSearchForm((prev) => ({ ...prev, category }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      searchForm.category === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Nav dots */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full transition-all ${i === currentIndex ? 'bg-white/90' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Globe, label: 'Destinations', value: '500+' },
            { icon: Users, label: 'Expert Guides', value: '10,000+' },
            { icon: Star, label: 'Average Rating', value: '4.8' },
            { icon: Award, label: 'Happy Travelers', value: '1M+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Destinations (GYG-like) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 dark:text-white">Popular in Kolkata</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">A consistent, admin-curated list of top places to visit in Kolkata</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} variant="shimmer" />)}
          </div>
        ) : content.featuredPlaces.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.featuredPlaces.map((place) => <PlaceCard key={place._id} place={place} />)}
          </div>
        ) : (
          <EmptyState
            title="No curated places yet"
            description="Ask an admin to add the Kolkata top 10."
            action={{ label: 'Explore all places', href: '/search?type=place' }}
          />
        )}
      </section>

      {/* Popular Activities (GYG-like) */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 dark:text-white">Popular Activities</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Unique experiences curated by local experts and highly rated by travelers</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} variant="shimmer" />)}
            </div>
          ) : content.featuredActivities.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.featuredActivities.map((activity) => <ActivityCard key={activity._id} activity={activity} />)}
            </div>
          ) : (
            <EmptyState
              title="No activities available"
              description="Be the first to discover amazing experiences"
              action={{ label: 'Browse activities', href: '/search?type=activity' }}
            />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-blue-800 text-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join millions of travelers discovering unique experiences worldwide. Book with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button as={Link} to="/search" size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
              Explore Experiences
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              as={Link}
              to="/auth/signup"
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              Become a Guide
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-white/80">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-300 mr-1" />
              4.8 average rating
            </div>
            <div className="hidden sm:block">•</div>
            <div>Free cancellation</div>
            <div className="hidden sm:block">•</div>
            <div>24/7 support</div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --------------------------- leaf UI components --------------------------- */
/* GYG-like card styles baked in — no new files */

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

function TagPill({ children }) {
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}

/* Place card */
function PlaceCard({ place }) {
  const title = place.title || place.name || 'Untitled Destination';
  const city = place.city || place.location?.city || place.location;
  const rating = place.rating?.avg;
  const count = place.rating?.count;

  return (
    <Link to={`/places/${place._id || place.id}`} className="group block" aria-label={`Explore ${title}`}>
      <Card className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all">
        <div className="relative h-52 bg-gradient-to-br from-gray-200 to-gray-100">
          {place.featured && (
            <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Featured
            </div>
          )}
          {city && (
            <div className="absolute bottom-3 left-3">
              <TagPill><MapPin className="inline h-3.5 w-3.5 mr-1" />{city}</TagPill>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[15px] font-bold text-gray-900 dark:text-white group-hover:text-primary-600">
              {title}
            </h3>
            <RatingPill rating={rating} count={count} />
          </div>

          <PerksRow items={['Top sights', 'Locals recommend']} />
          {/* If you have an avg price on place, show it
          <PriceLine amount={formatINR(place.avgPrice)} />
          */}
          <div className="mt-3 inline-flex items-center text-primary-600 font-medium">
            <span className="text-sm">Explore</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* Activity card */
function ActivityCard({ activity }) {
  const title = activity.title || 'Untitled Activity';
  const city = activity?.place?.city || activity?.city || activity?.location?.city;
  const duration =
    activity.duration ||
    (activity.durationMinutes ? formatDuration(activity.durationMinutes) : null);
  const rating = activity.rating?.avg;
  const count = activity.rating?.count;

  return (
    <Link to={`/activities/${activity._id || activity.id}`} className="group block" aria-label={`Book ${title}`}>
      <Card className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all">
        <div className="relative h-44 bg-gradient-to-br from-gray-200 to-gray-100">
          {/* category/emoji “image” */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl">{getCategoryEmoji(activity.category)}</div>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {city ? <TagPill>{city}</TagPill> : null}
            {activity.category ? <TagPill className="capitalize">{activity.category}</TagPill> : null}
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
          <PriceLine amount={formatINR(activity.basePrice)} />
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 mb-4 dark:text-gray-400">{description}</p>
      {action ? (
        <Button as={Link} to={action.href}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
