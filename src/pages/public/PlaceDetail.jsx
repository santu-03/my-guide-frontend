// // import { useEffect, useState, useCallback } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import {
// //   MapPin, Star, Image as ImgIcon, BadgeCheck,
// //   Users, Share2, Heart, CheckCircle2, ShieldCheck
// // } from 'lucide-react';

// // import { Card, CardContent } from '@/components/ui/Card';
// // import Button from '@/components/ui/Button';
// // import FavoriteButton from '@/components/ui/FavoriteButton';
// // import BookingButton from '@/components/ui/BookingButton';
// // import { api } from '@/store/auth';

// // const formatINR = (price) =>
// //   typeof price !== 'number'
// //     ? '₹—'
// //     : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

// // export default function PlaceDetail() {
// //   const { id } = useParams();
// //   const [place, setPlace] = useState(null);
// //   const [activities, setActivities] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const fetchPlace = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       const res = await api.get(`/places/${id}`);
// //       const d = res?.data?.data || res?.data || {};
// //       setPlace(d.place || d);
// //     } catch (e) {
// //       console.error('Failed to load place', e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [id]);

// //   const fetchActivities = useCallback(async (city) => {
// //     try {
// //       const params = new URLSearchParams({ isPublished: 'true', limit: '8' });
// //       if (city) params.set('city', city);
// //       const res = await api.get(`/activities?${params}`);
// //       setActivities(res.data?.data || []);
// //     } catch {
// //       setActivities([]);
// //     }
// //   }, []);

// //   useEffect(() => { fetchPlace(); }, [fetchPlace]);
// //   useEffect(() => {
// //     if (place?.city) fetchActivities(place.city);
// //   }, [place, fetchActivities]);

// //   if (loading || !place) {
// //     return <div className="p-10 text-center">Loading place details...</div>;
// //   }

// //   const {
// //     title, city, rating, description,
// //     basePrice, groupSize, duration
// //   } = place;

// //   const price = formatINR(99);

// //   return (
// //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
// //       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* IMAGE + META */}
// //           <div className="lg:col-span-2">
// //             <div className="relative h-72 md:h-96 bg-gray-100 rounded-xl">
// //               <div className="absolute inset-0 grid place-items-center text-7xl text-gray-300">
// //                 <ImgIcon className="h-16 w-16" />
// //               </div>
// //               {place?.featured && (
// //                 <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
// //                   <BadgeCheck className="h-3 w-3 inline-block mr-1" />
// //                   Featured
// //                 </div>
// //               )}
// //               <div className="absolute top-4 right-4">
// //                 <FavoriteButton itemId={id} type="place" />
// //               </div>
// //             </div>

// //             {/* DESCRIPTION */}
// //             <Card className="mt-6">
// //               <CardContent className="p-6 space-y-4">
// //                 <h2 className="text-2xl font-bold">{title}</h2>
// //                 <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
// //                   {rating?.avg && (
// //                     <span className="flex items-center gap-1">
// //                       <Star className="h-4 w-4 text-yellow-400" />
// //                       {rating.avg.toFixed(1)} ({rating.count || 0})
// //                     </span>
// //                   )}
// //                   {city && (
// //                     <span className="flex items-center gap-1">
// //                       <MapPin className="h-4 w-4 text-primary-500" />
// //                       {city}
// //                     </span>
// //                   )}
// //                   {duration && (
// //                     <span className="flex items-center gap-1">
// //                       ⏱️ {duration}
// //                     </span>
// //                   )}
// //                 </div>
// //                 <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
// //                   {description || 'No description available.'}
// //                 </p>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* BOOKING CARD */}
// //           {/* <Card className="shadow-lg sticky top-6">
// //             <CardContent className="p-6 space-y-4">
// //               <h3 className="text-xl font-bold">Book This Tour</h3>

// //               <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 text-sm text-gray-700 dark:text-gray-300">
// //                 <div className="flex items-center gap-2">
// //                   <CheckCircle2 className="h-4 w-4 text-emerald-600" />
// //                   Free cancellation
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                   <CheckCircle2 className="h-4 w-4 text-emerald-600" />
// //                   Reserve now & pay later
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                   <ShieldCheck className="h-4 w-4 text-emerald-600" />
// //                   Instant confirmation
// //                 </div>
// //               </div>

// //               <div className="text-3xl font-bold text-primary-600">
// //                 {formatINR(basePrice)} <span className="text-sm text-gray-500">/ person</span>
// //               </div>

// //               <BookingButton activity={place} fullWidth />

// //               {groupSize && (
// //                 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
// //                   <Users className="h-4 w-4" />
// //                   Up to {groupSize} guests
// //                 </div>
// //               )}

// //               <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
// //                 <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition">
// //                   <Share2 className="h-4 w-4" />
// //                   Share
// //                 </button>
// //                 <Button variant="ghost" size="sm" startIcon={<Heart className="h-4 w-4" />}>
// //                   Save
// //                 </Button>
// //               </div>
// //             </CardContent>
// //           </Card> */}

// //           {/* BOOKING CARD */}
// //            <Card className="self-start sticky top-6 shadow-lg">
// //               <CardContent className="p-6">
// //                 <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-3">
// //                   {title}
// //                 </h3>

// //                 <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
// //                   {rating && (
// //                     <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 text-xs font-semibold border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
// //                       <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
// //                       {Number(rating).toFixed(1)} {count ? `(${count})` : ''}
// //                     </span>
// //                   )}
// //                   {city && (
// //                     <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
// //                       <MapPin className="h-4 w-4 text-primary-500" />
// //                       {city}
// //                     </span>
// //                   )}
// //                   {duration && (
// //                     <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
// //                       <Clock className="h-4 w-4 text-primary-500" />
// //                       {duration}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="mt-5 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl space-y-2">
// //                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
// //                     <CheckCircle2 className="h-4 w-4 text-emerald-600" />
// //                     <span>Free cancellation</span>
// //                   </div>
// //                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
// //                     <CheckCircle2 className="h-4 w-4 text-emerald-600" />
// //                     <span>Reserve now &amp; pay later</span>
// //                   </div>
// //                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
// //                     <ShieldCheck className="h-4 w-4 text-emerald-600" />
// //                     <span>Instant confirmation</span>
// //                   </div>
// //                 </div>

// //                 <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
// //                   <div className="flex items-baseline justify-between">
// //                     <div className="flex items-baseline gap-2">
// //                       <span className="text-xs text-gray-600 dark:text-gray-400">From</span>
// //                       <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{price}</span>
// //                     </div>
// //                     <span className="text-xs text-gray-600 dark:text-gray-400">per person</span>
// //                   </div>
// //                 </div>

// //                 <div className="mt-6 space-y-3">
// //                   <BookingButton 
// //                     //place={place}
// //                     activity={place}
// //                     color="primary"
// //                     size="lg"
// //                     fullWidth
// //                   />

// //                   <Button 
// //                     color="outline" 
// //                     size="lg"
// //                     fullWidth
// //                     startIcon={<Heart className="h-4 w-4" />}
// //                   >
// //                     Save for Later
// //                   </Button>
// //                 </div>

// //                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
// //                   <button className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
// //                     <Share2 className="h-4 w-4" />
// //                     <span>Share</span>
// //                   </button>
// //                   <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
// //                     <Users className="h-4 w-4" />
// //                     <span>{place?.groupSize ? `Up to ${place.groupSize} guests` : 'Flexible group size'}</span>
// //                   </span>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //         </div>

// //         {/* RELATED ACTIVITIES */}
// //         {activities?.length > 0 && (
// //           <section className="mt-12">
// //             <h3 className="text-lg font-bold mb-4">Nearby Activities</h3>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //               {activities.map((a) => (
// //                 <Card key={a.id}>
// //                   <CardContent className="p-4">
// //                     <h4 className="text-md font-semibold mb-1">{a.title}</h4>
// //                     <div className="text-xs text-gray-500">{a.city}</div>
// //                     {/* <Link to={`/activity/${a._id || a.id}`} className="text-primary-600 text-sm mt-2 inline-block">
// //                       View Activity →
// //                     </Link> */}
// //                   </CardContent>
// //                 </Card>
// //               ))}
// //             </div>
// //           </section>
// //         )}
// //       </section>
// //     </div>
// //   );
// // }
// // src/pages/public/PlaceDetail.jsx
// import { useEffect, useState, useCallback } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//   MapPin, Star, Image as ImgIcon, BadgeCheck,
//   Users, Share2, Heart, CheckCircle2, ShieldCheck, Clock
// } from 'lucide-react';

// import { Card, CardContent } from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
// import FavoriteButton from '@/components/ui/FavoriteButton';
// import BookingButton from '@/components/ui/BookingButton';
// import { api } from '@/store/auth';

// const formatINR = (price) =>
//   typeof price !== 'number'
//     ? '₹—'
//     : new Intl.NumberFormat('en-IN', { 
//         style: 'currency', 
//         currency: 'INR', 
//         maximumFractionDigits: 0 
//       }).format(price);

// export default function PlaceDetail() {
//   const { id } = useParams();
//   const [place, setPlace] = useState(null);
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPlace = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/places/${id}`);
//       const d = res?.data?.data || res?.data || {};
//       setPlace(d.place || d);
//     } catch (e) {
//       console.error('Failed to load place', e);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   const fetchActivities = useCallback(async (city, placeId) => {
//     try {
//       const params = new URLSearchParams({ 
//         isPublished: 'true', 
//         approved: 'true',
//         limit: '8' 
//       });
//       if (city) params.set('city', city);
//       if (placeId) params.set('place', placeId);
//       const res = await api.get(`/activities?${params}`);
//       setActivities(res.data?.data || []);
//     } catch {
//       setActivities([]);
//     }
//   }, []);

//   useEffect(() => { 
//     fetchPlace(); 
//   }, [fetchPlace]);

//   useEffect(() => {
//     if (place) {
//       fetchActivities(place.city, place._id || place.id);
//     }
//   }, [place, fetchActivities]);

//   if (loading || !place) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Loading place details...</p>
//         </div>
//       </div>
//     );
//   }

//   const {
//     title, city, description,
//     basePrice, groupSize, duration
//   } = place;

//   const rating = place?.rating?.avg;
//   const count = place?.rating?.count;
//   const price = formatINR(basePrice || 99);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* IMAGE + META */}
//           <div className="lg:col-span-2">
//             <div className="relative h-72 md:h-96 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
//               <div className="absolute inset-0 grid place-items-center text-gray-300 dark:text-gray-600">
//                 <ImgIcon className="h-16 w-16" />
//               </div>
//               {place?.featured && (
//                 <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
//                   <BadgeCheck className="h-3 w-3 inline-block mr-1" />
//                   Featured
//                 </div>
//               )}
//               <div className="absolute top-4 right-4">
//                 <FavoriteButton itemId={id} type="place" />
//               </div>
//             </div>

//             {/* DESCRIPTION */}
//             <Card className="mt-6">
//               <CardContent className="p-6 space-y-4">
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {title}
//                 </h2>
//                 <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
//                   {rating && (
//                     <span className="flex items-center gap-1">
//                       <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
//                       {rating.toFixed(1)} {count ? `(${count})` : ''}
//                     </span>
//                   )}
//                   {city && (
//                     <span className="flex items-center gap-1">
//                       <MapPin className="h-4 w-4 text-primary-500" />
//                       {city}
//                     </span>
//                   )}
//                   {duration && (
//                     <span className="flex items-center gap-1">
//                       <Clock className="h-4 w-4 text-primary-500" />
//                       {duration}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
//                   {description || 'No description available.'}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* BOOKING CARD */}
//           <Card className="self-start sticky top-6 shadow-lg">
//             <CardContent className="p-6">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-3">
//                 {title}
//               </h3>

//               <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
//                 {rating && (
//                   <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 text-xs font-semibold border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
//                     <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
//                     {Number(rating).toFixed(1)} {count ? `(${count})` : ''}
//                   </span>
//                 )}
//                 {city && (
//                   <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
//                     <MapPin className="h-4 w-4 text-primary-500" />
//                     {city}
//                   </span>
//                 )}
//                 {duration && (
//                   <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
//                     <Clock className="h-4 w-4 text-primary-500" />
//                     {duration}
//                   </span>
//                 )}
//               </div>

//               <div className="mt-5 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl space-y-2">
//                 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//                   <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//                   <span>Free cancellation</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//                   <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//                   <span>Reserve now &amp; pay later</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//                   <ShieldCheck className="h-4 w-4 text-emerald-600" />
//                   <span>Instant confirmation</span>
//                 </div>
//               </div>

//               <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
//                 <div className="flex items-baseline justify-between">
//                   <div className="flex items-baseline gap-2">
//                     <span className="text-xs text-gray-600 dark:text-gray-400">From</span>
//                     <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
//                       {price}
//                     </span>
//                   </div>
//                   <span className="text-xs text-gray-600 dark:text-gray-400">per person</span>
//                 </div>
//               </div>

//               <div className="mt-6 space-y-3">
//                 <BookingButton 
//                   activity={place}
//                   color="primary"
//                   size="lg"
//                   fullWidth
//                 />

//                 <Button 
//                   color="outline" 
//                   size="lg"
//                   fullWidth
//                   startIcon={<Heart className="h-4 w-4" />}
//                 >
//                   Save for Later
//                 </Button>
//               </div>

//               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
//                 <button className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
//                   <Share2 className="h-4 w-4" />
//                   <span>Share</span>
//                 </button>
//                 <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                   <Users className="h-4 w-4" />
//                   <span>{groupSize ? `Up to ${groupSize} guests` : 'Flexible group size'}</span>
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RELATED ACTIVITIES */}
//         {activities?.length > 0 && (
//           <section className="mt-12">
//             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
//               Nearby Activities
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {activities.map((a) => (
//                 <Card key={a._id || a.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//                   <CardContent className="p-4">
//                     <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
//                       {a.title}
//                     </h4>
//                     <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
//                       {a.city && (
//                         <>
//                           <MapPin className="h-3 w-3" />
//                           <span>{a.city}</span>
//                         </>
//                       )}
//                     </div>
//                     <Link 
//                       to={`/activities/${a._id || a.id}`} 
//                       className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
//                     >
//                       View Details
//                       <span>→</span>
//                     </Link>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         )}
//       </section>
//     </div>
//   );
// }
// src/pages/public/PlaceDetail.jsx - FIXED for place bookings
// src/pages/public/PlaceDetail.jsx - FIXED for place bookings
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Star, Image as ImgIcon, BadgeCheck,
  Users, Share2, Heart, CheckCircle2, ShieldCheck, Clock
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FavoriteButton from '@/components/ui/FavoriteButton';
import BookingButton from '@/components/ui/BookingButton';
import { api } from '@/store/auth';

const formatINR = (price) =>
  typeof price !== 'number'
    ? '₹—'
    : new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        maximumFractionDigits: 0 
      }).format(price);

export default function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlace = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/places/${id}`);
      const d = res?.data?.data || res?.data || {};
      setPlace(d.place || d);
    } catch (e) {
      console.error('Failed to load place', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchActivities = useCallback(async (city, placeId) => {
    try {
      const params = new URLSearchParams({ 
        isPublished: 'true', 
        approved: 'true',
        limit: '8' 
      });
      if (city) params.set('city', city);
      if (placeId) params.set('place', placeId);
      const res = await api.get(`/activities?${params}`);
      setActivities(res.data?.data || []);
    } catch {
      setActivities([]);
    }
  }, []);

  useEffect(() => { 
    fetchPlace(); 
  }, [fetchPlace]);

  useEffect(() => {
    if (place) {
      fetchActivities(place.city, place._id || place.id);
    }
  }, [place, fetchActivities]);

  if (loading || !place) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading place details...</p>
        </div>
      </div>
    );
  }

  const {
    title, city, description,
    basePrice, groupSize, duration
  } = place;

  const rating = place?.rating?.avg;
  const count = place?.rating?.count;
  const price = formatINR(basePrice || 99);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* IMAGE + META */}
          <div className="lg:col-span-2">
            <div className="relative h-72 md:h-96 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
              <div className="absolute inset-0 grid place-items-center text-gray-300 dark:text-gray-600">
                <ImgIcon className="h-16 w-16" />
              </div>
              {place?.featured && (
                <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                  <BadgeCheck className="h-3 w-3 inline-block mr-1" />
                  Featured
                </div>
              )}
              <div className="absolute top-4 right-4">
                <FavoriteButton itemId={id} type="place" />
              </div>
            </div>

            {/* DESCRIPTION */}
            <Card className="mt-6">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      {rating.toFixed(1)} {count ? `(${count})` : ''}
                    </span>
                  )}
                  {city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary-500" />
                      {city}
                    </span>
                  )}
                  {duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary-500" />
                      {duration}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {description || 'No description available.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* BOOKING CARD */}
          <Card className="self-start sticky top-6 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-3">
                {title}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                {rating && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 text-xs font-semibold border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                    <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                    {Number(rating).toFixed(1)} {count ? `(${count})` : ''}
                  </span>
                )}
                {city && (
                  <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-primary-500" />
                    {city}
                  </span>
                )}
                {duration && (
                  <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Clock className="h-4 w-4 text-primary-500" />
                    {duration}
                  </span>
                )}
              </div>

              <div className="mt-5 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Reserve now &amp; pay later</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Instant confirmation</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">From</span>
                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {price}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">per person</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {/* ⚠️ IMPORTANT: Add isPlace prop to BookingButton */}
                <BookingButton 
                  activity={place}
                  isPlace={true}
                  color="primary"
                  size="lg"
                  fullWidth
                />

                <Button 
                  color="outline" 
                  size="lg"
                  fullWidth
                  startIcon={<Heart className="h-4 w-4" />}
                >
                  Save for Later
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
                <button className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{groupSize ? `Up to ${groupSize} guests` : 'Flexible group size'}</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RELATED ACTIVITIES */}
        {activities?.length > 0 && (
          <section className="mt-12">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Activities at this Place
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activities.map((a) => (
                <Card key={a._id || a.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {a.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {a.city && (
                        <>
                          <MapPin className="h-3 w-3" />
                          <span>{a.city}</span>
                        </>
                      )}
                    </div>
                    <Link 
                      to={`/activities/${a._id || a.id}`} 
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View Details
                      <span>→</span>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}