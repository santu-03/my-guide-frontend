
// // // import { useState, useCallback, useEffect } from 'react';
// // // import { useParams, Link } from 'react-router-dom';
// // // import {
// // //   Star, MapPin, Clock, Users, CheckCircle2, Share2, Heart, ShieldCheck, BadgeCheck,
// // // } from 'lucide-react';
// // // import { Card, CardContent } from '@/components/ui/Card';
// // // import { LoadingSkeleton, SkeletonText, SkeletonButton } from '@/components/ui/LoadingSkeleton';
// // // import Button from '@/components/ui/Button';
// // // import FavoriteButton from '@/components/ui/FavoriteButton';
// // // import BookingButton from '@/components/ui/BookingButton';
// // // import { api } from '@/store/auth';

// // // const formatINR = (price) =>
// // //   typeof price !== 'number'
// // //     ? '₹—'
// // //     : new Intl.NumberFormat('en-IN', { 
// // //         style: 'currency', 
// // //         currency: 'INR', 
// // //         maximumFractionDigits: 0 
// // //       }).format(price);

// // // const formatDuration = (minutes) => {
// // //   if (!minutes) return '—';
// // //   if (minutes < 60) return `${minutes}m`;
// // //   const h = Math.floor(minutes / 60);
// // //   const m = minutes % 60;
// // //   return m ? `${h}h ${m}m` : `${h}h`;
// // // };

// // // const getCategoryEmoji = (category) => {
// // //   const emojiMap = {
// // //     heritage: '🏛️',
// // //     food: '🍽️',
// // //     art: '🎨',
// // //     nature: '🌿',
// // //     adventure: '🚵',
// // //     cultural: '🎭',
// // //     'food & drink': '🍷',
// // //     default: '📸',
// // //   };
// // //   return emojiMap[category?.toLowerCase()] || emojiMap.default;
// // // };

// // // export default function ActivityDetail() {
// // //   const { id } = useParams();

// // //   const [activity, setActivity] = useState(null);
// // //   const [related, setRelated] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [relLoading, setRelLoading] = useState(true);
// // //   const [error, setError] = useState('');

// // //   const fetchActivity = useCallback(async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError('');
// // //       const res = await api.get(`/activities/${id}`, { silenceToast: true });
// // //       const d = res?.data?.data || res?.data || {};
// // //       const act = d.activity || d;
// // //       setActivity(act);
// // //     } catch (e) {
// // //       console.error('Failed to load activity', e);
// // //       setError('Could not load this activity.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [id]);

// // //   const fetchRelated = useCallback(async (category, city) => {
// // //     try {
// // //       setRelLoading(true);
// // //       const params = new URLSearchParams();
// // //       if (category) params.set('category', category);
// // //       if (city) params.set('city', city);
// // //       params.set('isPublished', 'true');
// // //       params.set('approved', 'true');
// // //       params.set('featured', 'true');
// // //       params.set('limit', '8');

// // //       const res = await api.get(`/activities?${params.toString()}`, { silenceToast: true });
// // //       const arr =
// // //         Array.isArray(res?.data?.data) ? res.data.data :
// // //         res?.data?.activities || res?.data?.docs || res?.data?.results || [];
// // //       setRelated((arr || []).filter(x => x._id !== id));
// // //     } catch {
// // //       setRelated([]);
// // //     } finally {
// // //       setRelLoading(false);
// // //     }
// // //   }, [id]);

// // //   useEffect(() => { 
// // //     fetchActivity(); 
// // //   }, [fetchActivity]);

// // //   useEffect(() => {
// // //     if (!activity) return;
// // //     const city = activity?.place?.city || activity?.city || activity?.location?.city;
// // //     fetchRelated(activity?.category, city);
// // //   }, [activity, fetchRelated]);

// // //   if (loading) return <ActivitySkeleton />;

// // //   if (error || !activity) {
// // //     return (
// // //       <div className="max-w-3xl mx-auto px-4 py-16 text-center">
// // //         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
// // //           Activity not found
// // //         </h2>
// // //         <p className="text-gray-600 dark:text-gray-400 mb-6">
// // //           {error || 'Please try again later.'}
// // //         </p>
// // //         <Button as={Link} to="/search">Back to Search</Button>
// // //       </div>
// // //     );
// // //   }

// // //   const title = activity.title || 'Untitled Activity';
// // //   const rating = activity?.rating?.avg;
// // //   const count = activity?.rating?.count;
// // //   const city = activity?.place?.city || activity?.city || activity?.location?.city;
// // //   const duration =
// // //     activity.duration || (activity.durationMinutes ? formatDuration(activity.durationMinutes) : null);

// // //   const price = formatINR(activity?.basePrice || 99);

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
// // //       {/* HERO */}
// // //       <section className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
// // //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //             {/* Media */}
// // //             <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 h-72 md:h-96 relative shadow-md">
// // //               <div className="absolute inset-0 grid place-items-center text-7xl select-none">
// // //                 {getCategoryEmoji(activity.category)}
// // //               </div>
// // //               {activity?.featured && (
// // //                 <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
// // //                   <BadgeCheck className="h-3.5 w-3.5" /> Popular
// // //                 </div>
// // //               )}
// // //               <div className="absolute right-3 top-3">
// // //                 <FavoriteButton itemId={id} type="activity" />
// // //               </div>
// // //             </div>

// // //             {/* Booking Card */}
// // //             <Card className="self-start sticky top-6 shadow-lg">
// // //               <CardContent className="p-6">
// // //                 <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-3">
// // //                   {title}
// // //                 </h3>

// // //                 <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
// // //                   {rating && (
// // //                     <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 text-xs font-semibold border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
// // //                       <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
// // //                       {Number(rating).toFixed(1)} {count ? `(${count})` : ''}
// // //                     </span>
// // //                   )}
// // //                   {city && (
// // //                     <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
// // //                       <MapPin className="h-4 w-4 text-primary-500" />
// // //                       {city}
// // //                     </span>
// // //                   )}
// // //                   {duration && (
// // //                     <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
// // //                       <Clock className="h-4 w-4 text-primary-500" />
// // //                       {duration}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="mt-5 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl space-y-2">
// // //                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
// // //                     <CheckCircle2 className="h-4 w-4 text-emerald-600" />
// // //                     <span>Free cancellation</span>
// // //                   </div>
// // //                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
// // //                     <CheckCircle2 className="h-4 w-4 text-emerald-600" />
// // //                     <span>Reserve now &amp; pay later</span>
// // //                   </div>
// // //                   <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
// // //                     <ShieldCheck className="h-4 w-4 text-emerald-600" />
// // //                     <span>Instant confirmation</span>
// // //                   </div>
// // //                 </div>

// // //                 <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
// // //                   <div className="flex items-baseline justify-between">
// // //                     <div className="flex items-baseline gap-2">
// // //                       <span className="text-xs text-gray-600 dark:text-gray-400">From</span>
// // //                       <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
// // //                         {price}
// // //                       </span>
// // //                     </div>
// // //                     <span className="text-xs text-gray-600 dark:text-gray-400">per person</span>
// // //                   </div>
// // //                 </div>

// // //                 <div className="mt-6 space-y-3">
// // //                   <BookingButton 
// // //                     activity={activity}
// // //                     color="primary"
// // //                     size="lg"
// // //                     fullWidth
// // //                   />

// // //                   <Button 
// // //                     color="outline" 
// // //                     size="lg"
// // //                     fullWidth
// // //                     startIcon={<Heart className="h-4 w-4" />}
// // //                   >
// // //                     Save for Later
// // //                   </Button>
// // //                 </div>

// // //                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
// // //                   <button className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
// // //                     <Share2 className="h-4 w-4" />
// // //                     <span>Share</span>
// // //                   </button>
// // //                   <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
// // //                     <Users className="h-4 w-4" />
// // //                     <span>Up to {activity?.groupSize || 10} guests</span>
// // //                   </span>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </div>

// // //           {/* Title for mobile */}
// // //           <div className="mt-6 lg:hidden">
// // //             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
// // //             <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
// // //               {rating && (
// // //                 <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 text-xs font-semibold">
// // //                   <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
// // //                   {Number(rating).toFixed(1)} {count ? `(${count})` : ''}
// // //                 </span>
// // //               )}
// // //               {city && (
// // //                 <span className="inline-flex items-center gap-1.5">
// // //                   <MapPin className="h-4 w-4" />
// // //                   {city}
// // //                 </span>
// // //               )}
// // //               {duration && (
// // //                 <span className="inline-flex items-center gap-1.5">
// // //                   <Clock className="h-4 w-4" />
// // //                   {duration}
// // //                 </span>
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* BODY */}
// // //       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
// // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // //           <div className="lg:col-span-2 space-y-8">
// // //             <Card>
// // //               <CardContent className="p-6">
// // //                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
// // //                   About this activity
// // //                 </h3>
// // //                 <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
// // //                   {activity.description || 'No description available yet.'}
// // //                 </p>

// // //                 {Array.isArray(activity.highlights) && activity.highlights.length > 0 && (
// // //                   <div className="mt-5">
// // //                     <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
// // //                       Highlights
// // //                     </h4>
// // //                     <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
// // //                       {activity.highlights.map((h, i) => <li key={i}>{h}</li>)}
// // //                     </ul>
// // //                   </div>
// // //                 )}

// // //                 {Array.isArray(activity.includes) && activity.includes.length > 0 && (
// // //                   <div className="mt-5">
// // //                     <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
// // //                       Includes
// // //                     </h4>
// // //                     <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
// // //                       {activity.includes.map((h, i) => <li key={i}>{h}</li>)}
// // //                     </ul>
// // //                   </div>
// // //                 )}
// // //               </CardContent>
// // //             </Card>

// // //             {city && (
// // //               <Card>
// // //                 <CardContent className="p-6">
// // //                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
// // //                     Location
// // //                   </h3>
// // //                   <div className="text-gray-700 dark:text-gray-300">
// // //                     <MapPin className="inline h-4 w-4 mr-1" /> {city}
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //             )}
// // //           </div>

// // //           <div className="space-y-6">
// // //             <Card>
// // //               <CardContent className="p-5 text-sm text-gray-700 dark:text-gray-300">
// // //                 <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
// // //                   Good to know
// // //                 </h4>
// // //                 <ul className="list-disc list-inside space-y-1">
// // //                   <li>Free cancellation available for most options.</li>
// // //                   <li>Reserve now &amp; pay later to secure your spot.</li>
// // //                   <li>Instant confirmation for many activities.</li>
// // //                 </ul>
// // //               </CardContent>
// // //             </Card>
// // //           </div>
// // //         </div>

// // //         {/* Related */}
// // //         <div className="mt-12">
// // //           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
// // //             You might also like
// // //           </h3>
// // //           {relLoading ? (
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // //               {Array.from({ length: 4 }).map((_, i) => (
// // //                 <Card key={i}>
// // //                   <CardContent className="p-4">
// // //                     <LoadingSkeleton className="h-36 mb-3" variant="shimmer" />
// // //                     <SkeletonText lines={2} />
// // //                   </CardContent>
// // //                 </Card>
// // //               ))}
// // //             </div>
// // //           ) : related.length ? (
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// // //               {related.map((a) => (
// // //                 <Card key={a._id} className="overflow-hidden hover:shadow-md transition">
// // //                   <div className="h-36 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 grid place-items-center text-4xl">
// // //                     {getCategoryEmoji(a.category)}
// // //                   </div>
// // //                   <CardContent className="p-4">
// // //                     <div className="flex items-center justify-between gap-2 mb-2">
// // //                       <h4 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white">
// // //                         <Link 
// // //                           to={`/activities/${a._id}`} 
// // //                           className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
// // //                         >
// // //                           {a.title || 'Activity'}
// // //                         </Link>
// // //                       </h4>
// // //                       {a?.rating?.avg && (
// // //                         <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 text-[10px] font-semibold shrink-0">
// // //                           <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
// // //                           {Number(a.rating.avg).toFixed(1)}
// // //                         </span>
// // //                       )}
// // //                     </div>

// // //                     <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
// // //                       {formatINR(a?.basePrice || 99)} · {a.city || a?.place?.city || '—'}
// // //                     </div>

// // //                     <div className="mt-3">
// // //                       <BookingButton activity={a} size="sm" color="primary" fullWidth />
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
// // //               ))}
// // //             </div>
// // //           ) : (
// // //             <div className="text-sm text-gray-500 dark:text-gray-400">
// // //               No related activities found.
// // //             </div>
// // //           )}
// // //         </div>
// // //       </section>
// // //     </div>
// // //   );
// // // }

// // // function ActivitySkeleton() {
// // //   return (
// // //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
// // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //         <LoadingSkeleton className="h-72 md:h-96 rounded-2xl lg:col-span-2" variant="shimmer" />
// // //         <Card>
// // //           <CardContent className="p-5">
// // //             <SkeletonText lines={3} />
// // //             <div className="mt-4">
// // //               <SkeletonText lines={2} />
// // //             </div>
// // //             <div className="mt-6 grid grid-cols-2 gap-2">
// // //               <SkeletonButton fullWidth />
// // //               <SkeletonButton fullWidth />
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //       <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //         <Card className="lg:col-span-2">
// // //           <CardContent className="p-6">
// // //             <SkeletonText lines={6} />
// // //           </CardContent>
// // //         </Card>
// // //         <Card>
// // //           <CardContent className="p-6">
// // //             <SkeletonText lines={5} />
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import React, { useState, useCallback, useEffect } from "react";
// // import { useParams, Link } from "react-router-dom";
// // import { Star, MapPin, Clock, Users, CheckCircle2, Share2, Heart, ShieldCheck, BadgeCheck } from "lucide-react";
// // import { Card, CardContent } from "@/components/ui/Card";
// // import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
// // import Button from "@/components/ui/Button";
// // import FavoriteButton from "@/components/ui/FavoriteButton";
// // import { api } from "@/store/auth";

// // const formatINR_A = (price) =>
// //   typeof price !== "number"
// //     ? "₹—"
// //     : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
// // const formatDuration_A = (minutes) => {
// //   if (!minutes) return "—";
// //   if (minutes < 60) return `${minutes}m`;
// //   const h = Math.floor(minutes / 60);
// //   const m = minutes % 60;
// //   return m ? `${h}h ${m}m` : `${h}h`;
// // };
// // const getCategoryEmoji = (category) => {
// //   const emojiMap = { heritage: "🏛️", food: "🍽️", art: "🎨", nature: "🌿", adventure: "🚵", cultural: "🎭", "food & drink": "🍷", default: "📸" };
// //   return emojiMap[category?.toLowerCase()] || emojiMap.default;
// // };

// // export default function ActivityDetail() {
// //   const { id } = useParams();
// //   const [activity, setActivity] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const fetchActivity = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       setError("");
// //       const res = await api.get(`/activities/${id}`, { silenceToast: true });
// //       const d = res?.data?.data || res?.data || {};
// //       const act = d.activity || d;
// //       setActivity(act);
// //     } catch (e) {
// //       setError("Could not load this activity.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [id]);

// //   useEffect(() => {
// //     fetchActivity();
// //   }, [fetchActivity]);

// //   if (loading) return <LoadingSkeleton />;

// //   if (error || !activity) {
// //     return (
// //       <div className="max-w-3xl mx-auto px-4 py-16 text-center">
// //         <h2 className="text-2xl font-bold mb-2">Activity not found</h2>
// //         <p className="text-gray-600 mb-6">{error || "Please try again later."}</p>
// //         <Button as={Link} to="/search">Back to Search</Button>
// //       </div>
// //     );
// //   }

// //   const title = activity.title || "Untitled Activity";
// //   const rating = activity?.rating?.avg;
// //   const count = activity?.rating?.count;
// //   const city = activity?.place?.city || activity?.city || activity?.location?.city;
// //   const duration = activity.duration || (activity.durationMinutes ? formatDuration_A(activity.durationMinutes) : null);
// //   const price = formatINR(activity?.price || activity?.basePrice || 0);

// //   return (
// //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
// //       <section className="bg-white dark:bg-gray-900 border-b">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //             <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 h-72 md:h-96 relative shadow-md">
// //               <div className="absolute inset-0 grid place-items-center text-7xl select-none">{getCategoryEmoji(activity.category)}</div>
// //               {activity?.featured && (
// //                 <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
// //                   <BadgeCheck className="h-3.5 w-3.5" /> Popular
// //                 </div>
// //               )}
// //               <div className="absolute right-3 top-3">
// //                 <FavoriteButton itemId={id} type="activity" />
// //               </div>
// //             </div>

// //             <Card className="self-start sticky top-6 shadow-lg">
// //               <CardContent className="p-6">
// //                 <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-3">{title}</h3>
// //                 <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
// //                   {rating && (
// //                     <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 text-xs font-semibold border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
// //                       <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
// //                       {Number(rating).toFixed(1)} {count ? `(${count})` : ""}
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
// //                   <Button
// //                     as={Link}
// //                     to={`/booking?activity=${id}`}
// //                     color="primary"
// //                     size="lg"
// //                     fullWidth
// //                   >
// //                     Book Now
// //                   </Button>
// //                   <Button color="outline" size="lg" fullWidth startIcon={<Heart className="h-4 w-4" />}>
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
// //                     <span>{activity?.groupSize || "Up to 10"} guests</span>
// //                   </span>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Mobile title */}
// //           <div className="mt-6 lg:hidden">
// //             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }
// import React, { useState, useCallback, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { Star, MapPin, Clock, Users, CheckCircle2, Share2, Heart, ShieldCheck, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/Card";
// import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
// import Button from "@/components/ui/Button";
// import FavoriteButton from "@/components/ui/FavoriteButton";
// import { api } from "@/store/auth";

// const formatINR = (price) =>
//   typeof price !== "number"
//     ? "₹—"
//     : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

// const formatDuration = (minutes) => {
//   if (!minutes) return "—";
//   if (minutes < 60) return `${minutes}m`;
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;
//   return m ? `${h}h ${m}m` : `${h}h`;
// };

// export default function ActivityDetail() {
//   const { id } = useParams();
//   const [activity, setActivity] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const fetchActivity = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const res = await api.get(`/activities/${id}`);
//       const data = res?.data?.data?.activity || res?.data?.activity || res?.data;
//       console.log('📸 Activity data:', data);
//       console.log('📸 Activity images:', data?.images);
//       setActivity(data);
//     } catch (e) {
//       console.error('Error fetching activity:', e);
//       setError("Could not load this activity.");
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchActivity();
//   }, [fetchActivity]);

//   if (loading) return <LoadingSkeleton />;

//   if (error || !activity) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-2">Activity not found</h2>
//           <p className="text-gray-600 mb-6">{error || "Please try again later."}</p>
//           <Button as={Link} to="/search">Back to Search</Button>
//         </div>
//       </div>
//     );
//   }

//   const title = activity.title || "Untitled Activity";
//   const rating = activity.averageRating || activity?.rating?.avg;
//   const count = activity.totalReviews || activity?.rating?.count;
//   const city = activity?.place?.city || activity?.city;
//   const duration = activity.duration || (activity.durationMinutes ? formatDuration(activity.durationMinutes) : null);
//   const price = formatINR(activity.price || activity?.basePrice || 0);
//   const images = activity.images || [];
//   const hasImages = images.length > 0;

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <section className="bg-white dark:bg-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Image Gallery */}
//             <div className="lg:col-span-2 space-y-4">
//               <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 h-80 md:h-96 relative shadow-xl">
//                 {hasImages ? (
//                   <>
//                     <img
//                       src={images[currentImageIndex]}
//                       alt={title}
//                       className="w-full h-full object-cover"
//                     />
                    
//                     {/* Image navigation */}
//                     {images.length > 1 && (
//                       <>
//                         <button
//                           onClick={prevImage}
//                           className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all hover:scale-110"
//                         >
//                           <ChevronLeft className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={nextImage}
//                           className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all hover:scale-110"
//                         >
//                           <ChevronRight className="h-5 w-5" />
//                         </button>
                        
//                         {/* Image indicators */}
//                         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//                           {images.map((_, index) => (
//                             <button
//                               key={index}
//                               onClick={() => setCurrentImageIndex(index)}
//                               className={`w-3 h-3 rounded-full transition-all ${
//                                 index === currentImageIndex 
//                                   ? 'bg-white scale-125' 
//                                   : 'bg-white/50 hover:bg-white/70'
//                               }`}
//                             />
//                           ))}
//                         </div>
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
//                     <div className="text-gray-400 text-center">
//                       <div className="text-4xl mb-2">📸</div>
//                       <p className="text-sm">No images available</p>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Featured badge */}
//                 {activity?.featured && (
//                   <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
//                     <BadgeCheck className="h-4 w-4" /> 
//                     <span>Popular</span>
//                   </div>
//                 )}
                
//                 {/* Favorite button */}
//                 <div className="absolute right-4 top-4">
//                   <FavoriteButton itemId={id} type="activity" />
//                 </div>

//                 {/* Image counter */}
//                 {hasImages && images.length > 1 && (
//                   <div className="absolute right-4 bottom-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
//                     {currentImageIndex + 1} / {images.length}
//                   </div>
//                 )}
//               </div>

//               {/* Thumbnail gallery */}
//               {hasImages && images.length > 1 && (
//                 <div className="flex gap-2 overflow-x-auto pb-2">
//                   {images.map((image, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentImageIndex(index)}
//                       className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
//                         index === currentImageIndex 
//                           ? 'border-primary-500 ring-2 ring-primary-200' 
//                           : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <img
//                         src={image}
//                         alt={`${title} ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Booking Card */}
//             <Card className="self-start sticky top-6 shadow-xl border-0">
//               <CardContent className="p-6">
//                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
                
//                 <div className="flex flex-wrap items-center gap-3 mb-6">
//                   {rating && (
//                     <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 text-sm font-semibold border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
//                       <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
//                       {Number(rating).toFixed(1)} {count ? `(${count})` : ""}
//                     </span>
//                   )}
//                   {city && (
//                     <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300 text-sm">
//                       <MapPin className="h-4 w-4 text-primary-500" />
//                       {city}
//                     </span>
//                   )}
//                   {duration && (
//                     <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300 text-sm">
//                       <Clock className="h-4 w-4 text-primary-500" />
//                       {duration}
//                     </span>
//                   )}
//                   {activity.category && (
//                     <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-300">
//                       {activity.category}
//                     </span>
//                   )}
//                 </div>

//                 {/* Perks */}
//                 <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl space-y-3">
//                   <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
//                     <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
//                     <span>Free cancellation up to 24 hours before</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
//                     <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
//                     <span>Reserve now & pay later</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
//                     <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
//                     <span>Instant confirmation</span>
//                   </div>
//                 </div>

//                 {/* Price */}
//                 <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
//                   <div className="flex items-baseline justify-between">
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-sm text-gray-600 dark:text-gray-400">From</span>
//                       <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{price}</span>
//                     </div>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">per person</span>
//                   </div>
//                 </div>

//                 {/* Action buttons */}
//                 <div className="space-y-3 mb-4">
//                   <Button
//                     as={Link}
//                     to={`/booking?activity=${id}`}
//                     color="primary"
//                     size="lg"
//                     fullWidth
//                     className="h-12 text-base font-semibold"
//                   >
//                     Book Now
//                   </Button>
//                   <Button 
//                     color="outline" 
//                     size="lg" 
//                     fullWidth 
//                     startIcon={<Heart className="h-5 w-5" />}
//                     className="h-12"
//                   >
//                     Save for Later
//                   </Button>
//                 </div>

//                 {/* Additional info */}
//                 <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
//                   <button className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors font-medium">
//                     <Share2 className="h-4 w-4" />
//                     <span>Share</span>
//                   </button>
//                   <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                     <Users className="h-4 w-4" />
//                     <span>Up to {activity?.capacity || 10} guests</span>
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Activity Details */}
//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <Card className="shadow-sm border-0">
//                 <CardContent className="p-6">
//                   <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">About this experience</h2>
//                   <div className="prose prose-gray dark:prose-invert max-w-none">
//                     <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
//                       {activity.description || "No description available for this activity."}
//                     </p>
                    
//                     {activity.tags && activity.tags.length > 0 && (
//                       <div className="mt-8">
//                         <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">What to expect</h3>
//                         <div className="flex flex-wrap gap-3">
//                           {activity.tags.map((tag, index) => (
//                             <span 
//                               key={index}
//                               className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium border border-primary-100 dark:border-primary-800"
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


import React, { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Clock, Users, CheckCircle2, Share2, Heart, ShieldCheck, BadgeCheck, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import Button from "@/components/ui/Button";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { api } from "@/store/auth";

const formatINR = (price) =>
  typeof price !== "number"
    ? "₹—"
    : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const formatDuration = (minutes) => {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

// Helper function to validate and filter images
const getValidImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images.filter(img => img && typeof img === 'string' && img.trim() !== '');
};

export default function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching activity with ID:', id);
      const res = await api.get(`/activities/${id}`);
      
      // Debug the response structure
      console.log('🔍 Full API Response:', res);
      console.log('🔍 Response data:', res.data);
      
      // Extract activity data from various possible response structures
      let activityData = null;
      
      if (res.data?.data?.activity) {
        activityData = res.data.data.activity;
      } else if (res.data?.activity) {
        activityData = res.data.activity;
      } else if (res.data?.data) {
        activityData = res.data.data;
      } else if (res.data) {
        activityData = res.data;
      }
      
      console.log('✅ Extracted activity data:', activityData);
      
      if (!activityData) {
        throw new Error('Invalid response format from server');
      }
      
      setActivity(activityData);
      
    } catch (error) {
      console.error('❌ Error fetching activity:', error);
      
      // Set user-friendly error messages
      if (error.response?.status === 404) {
        setError('Activity not found. It may have been removed or does not exist.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to load activity details. Please check your connection and try again.');
      }
      
      setActivity(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  // Handle image errors
  const handleImageError = (e) => {
    e.target.src = '/placeholder-image.jpg';
    e.target.className = e.target.className + ' bg-gradient-to-br from-blue-50 to-indigo-100';
  };

  // Navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading activity details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Unable to load activity</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={fetchActivity}>Try Again</Button>
            <Button as={Link} to="/search" variant="outline">Back to Search</Button>
          </div>
        </div>
      </div>
    );
  }

  // No activity found state
  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Activity not found</h2>
          <p className="text-slate-600 mb-6">The activity you're looking for doesn't exist.</p>
          <Button as={Link} to="/search">Back to Search</Button>
        </div>
      </div>
    );
  }

  // Destructure activity data with safe defaults
  const { 
    title, 
    description, 
    category,
    featured, 
    images = [],
    tags = [],
    price,
    basePrice,
    capacity,
    duration,
    durationMinutes,
    averageRating,
    rating,
    totalReviews,
    place
  } = activity;

  // Process data
  const validImages = getValidImages(images);
  const hasImages = validImages.length > 0;
  const displayTitle = title || "Untitled Activity";
  const displayRating = averageRating || rating?.avg;
  const reviewCount = totalReviews || rating?.count;
  const displayCity = place?.city || activity?.city;
  const displayDuration = duration || (durationMinutes ? formatDuration(durationMinutes) : null);
  const displayPrice = formatINR(price || basePrice || 0);
  const guestText = capacity ? `Up to ${capacity} guests` : 'Up to 10 guests';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Image Gallery */}
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 h-80 md:h-96 relative shadow-xl">
                {hasImages ? (
                  <>
                    <img
                      src={validImages[currentImageIndex]}
                      alt={displayTitle}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                    
                    {/* Image navigation */}
                    {validImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        
                        {/* Image indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {validImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                index === currentImageIndex 
                                  ? 'bg-white scale-125' 
                                  : 'bg-white/50 hover:bg-white/70'
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-slate-400 text-center">
                      <div className="text-4xl mb-2">📸</div>
                      <p className="text-sm">No images available</p>
                    </div>
                  </div>
                )}
                
                {/* Featured badge */}
                {featured && (
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                    <BadgeCheck className="h-4 w-4" /> 
                    <span>Popular</span>
                  </div>
                )}
                
                {/* Favorite button */}
                <div className="absolute right-4 top-4">
                  <FavoriteButton itemId={id} type="activity" />
                </div>

                {/* Image counter */}
                {hasImages && validImages.length > 1 && (
                  <div className="absolute right-4 bottom-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    {currentImageIndex + 1} / {validImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail gallery */}
              {hasImages && validImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {validImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${displayTitle} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Activity Details */}
              <Card className="shadow-lg border border-slate-200 rounded-2xl">
                <CardContent className="p-6">
                  <h1 className="text-3xl font-bold text-slate-800 mb-4">{displayTitle}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {displayRating && (
                      <span className="inline-flex items-center gap-2 text-slate-700">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">
                          {Number(displayRating).toFixed(1)}
                          {reviewCount && ` (${reviewCount} reviews)`}
                        </span>
                      </span>
                    )}
                    
                    {displayCity && (
                      <span className="inline-flex items-center gap-2 text-slate-700">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{displayCity}</span>
                      </span>
                    )}
                    
                    {displayDuration && (
                      <span className="inline-flex items-center gap-2 text-slate-700">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{displayDuration}</span>
                      </span>
                    )}
                    
                    {category && (
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full text-slate-700 font-medium capitalize border border-blue-100">
                        {category}
                      </span>
                    )}
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 text-lg leading-relaxed">
                      {description || "No description available for this activity."}
                    </p>
                    
                    {tags.length > 0 && (
                      <div className="mt-8">
                        <h3 className="font-semibold text-slate-800 mb-4 text-lg">What to expect</h3>
                        <div className="flex flex-wrap gap-3">
                          {tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100 capitalize"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Card */}
            <Card className="self-start sticky top-6 shadow-xl border border-slate-200 rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{displayTitle}</h2>
                
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {displayRating && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1.5 text-emerald-700 text-sm font-semibold border border-emerald-200">
                      <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                      {Number(displayRating).toFixed(1)} {reviewCount ? `(${reviewCount})` : ""}
                    </span>
                  )}
                  {displayCity && (
                    <span className="inline-flex items-center gap-1.5 text-slate-700 text-sm">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {displayCity}
                    </span>
                  )}
                  {displayDuration && (
                    <span className="inline-flex items-center gap-1.5 text-slate-700 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {displayDuration}
                    </span>
                  )}
                  {category && (
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full text-sm text-slate-700 capitalize border border-blue-100">
                      {category}
                    </span>
                  )}
                </div>

                {/* Perks */}
                <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl space-y-3 border border-slate-200">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span>Free cancellation up to 24 hours before</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span>Reserve now & pay later</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span>Instant confirmation</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-slate-600">From</span>
                      <span className="text-3xl font-bold text-blue-600">{displayPrice}</span>
                    </div>
                    <span className="text-sm text-slate-600">per person</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3 mb-4">
                  <Button
                    as={Link}
                    to={`/booking?activity=${id}`}
                    size="lg"
                    fullWidth
                    className="h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl"
                  >
                    Book Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    fullWidth 
                    startIcon={<Heart className="h-5 w-5" />}
                    className="h-12 border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Save for Later
                  </Button>
                </div>

                {/* Additional info */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-sm">
                  <button 
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <span className="inline-flex items-center gap-2 text-slate-600">
                    <Users className="h-4 w-4" />
                    <span>{guestText}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Activity Details Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-lg border border-slate-200 rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">About this experience</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 text-lg leading-relaxed">
                      {description || "No description available for this activity."}
                    </p>
                    
                    {tags.length > 0 && (
                      <div className="mt-8">
                        <h3 className="font-semibold text-slate-800 mb-4 text-lg">What to expect</h3>
                        <div className="flex flex-wrap gap-3">
                          {tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100 capitalize"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}