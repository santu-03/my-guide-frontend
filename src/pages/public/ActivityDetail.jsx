// import { useEffect, useState, useMemo } from 'react';
// import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
// import {
//   Star,
//   Clock,
//   Users,
//   MapPin,
//   Calendar,
//   Heart,
//   Share2,
//   CheckCircle,
//   X,
//   ArrowLeft,
//   Award,
//   Shield,
//   RefreshCw,
//   MessageCircle,
//   Camera,
//   Wifi,
//   Car,
//   Coffee,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
//   Play
// } from 'lucide-react';
// import { Card, CardContent, CardHeader } from '@/components/ui/Card';
// import { SkeletonCard } from '@/components/ui/LoadingSkeleton';
// import Button from '@/components/ui/Button';
// import { useAuthStore } from '@/store/auth';
// import api from '@/lib/api';
// import toast from 'react-hot-toast';

// const ActivityDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuthStore();

//   const [activity, setActivity] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [similarActivities, setSimilarActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [reviewsLoading, setReviewsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const [showAllReviews, setShowAllReviews] = useState(false);

//   // Fetch activity data
//   useEffect(() => {
//     const fetchActivityData = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         const [activityRes, reviewsRes, similarRes] = await Promise.all([
//           api.get(`/activities/${id}`, { silenceToast: true }),
//           api.get(`/activities/${id}/reviews?limit=5`, { silenceToast: true }).catch(() => ({ data: [] })),
//           api.get(`/activities?similar=${id}&limit=4`, { silenceToast: true }).catch(() => ({ data: { data: [] } }))
//         ]);

//         const activityData = activityRes?.data?.data || activityRes?.data;
//         if (!activityData) {
//           setError('Activity not found');
//           return;
//         }

//         setActivity(activityData);
//         setReviews(reviewsRes?.data?.data || reviewsRes?.data || []);
//         setSimilarActivities(similarRes?.data?.data || []);

//         if (isAuthenticated) {
//           setIsWishlisted(false); // replace with real API check
//         }
//       } catch (err) {
//         console.error('Failed to fetch activity:', err);
//         setError('Failed to load activity details. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchActivityData();
//   }, [id, isAuthenticated]);

//   // Load more reviews
//   const loadMoreReviews = async () => {
//     if (reviewsLoading) return;
//     try {
//       setReviewsLoading(true);
//       const response = await api.get(`/activities/${id}/reviews?limit=10&offset=${reviews.length}`);
//       const newReviews = response?.data?.data || response?.data || [];
//       setReviews((prev) => [...prev, ...newReviews]);
//       setShowAllReviews(true);
//     } catch {
//       toast.error('Failed to load more reviews');
//     } finally {
//       setReviewsLoading(false);
//     }
//   };

//   // Wishlist toggle
//   const handleWishlistToggle = async () => {
//     if (!isAuthenticated) {
//       toast.error('Please sign in to save to wishlist');
//       navigate('/auth/login');
//       return;
//     }
//     try {
//       setIsWishlisted((v) => !v);
//       toast.success(!isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
//     } catch {
//       toast.error('Failed to update wishlist');
//     }
//   };

//   // Share
//   const handleShare = async () => {
//     const url = window.location.href;
//     const title = activity?.title || 'Amazing Activity';
//     if (navigator.share) {
//       try {
//         await navigator.share({ title, url });
//       } catch {
//         /* user cancelled */
//       }
//     } else {
//       try {
//         await navigator.clipboard.writeText(url);
//         toast.success('Link copied to clipboard');
//       } catch {
//         toast.error('Failed to copy link');
//       }
//     }
//   };

//   // Price
//   const formatPrice = (price) => {
//     if (typeof price !== 'number') return '₹—';
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(price);
//   };

//   // Duration
//   const formatDuration = (minutes) => {
//     if (!minutes) return 'Flexible timing';
//     if (minutes < 60) return `${minutes} minutes`;
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return mins ? `${hours}h ${mins}m` : `${hours} hours`;
//   };

//   // Mock images (replace with real URLs when available)
//   const images = useMemo(
//     () => [
//       '/api/placeholder/800/600?text=Activity+Main',
//       '/api/placeholder/800/600?text=Activity+Gallery+1',
//       '/api/placeholder/800/600?text=Activity+Gallery+2',
//       '/api/placeholder/800/600?text=Activity+Gallery+3'
//     ],
//     []
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="space-y-8">
//             <SkeletonCard className="h-96" />
//             <div className="grid lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2 space-y-6">
//                 <SkeletonCard />
//                 <SkeletonCard />
//               </div>
//               <div>
//                 <SkeletonCard />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !activity) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="max-w-md mx-auto text-center px-4">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             {error || 'Activity not found'}
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             The activity you&apos;re looking for doesn&apos;t exist or has been removed.
//           </p>
//           <div className="space-x-4">
//             <Button variant="outline" onClick={() => navigate(-1)}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Go Back
//             </Button>
//             {/* <Button onClick={() => navigate('/search')}>Browse Activities</Button> */}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
//             >
//               <ArrowLeft className="h-5 w-5 mr-2" />
//               Back to search
//             </button>

//             <div className="flex items-center space-x-2">
//               <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center">
//                 <Share2 className="h-4 w-4 mr-2" />
//                 Share
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleWishlistToggle}
//                 className={`flex items-center ${isWishlisted ? 'text-red-600' : ''}`}
//               >
//                 <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
//                 {isWishlisted ? 'Saved' : 'Save'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Image Gallery */}
//         <div className="mb-8">
//           <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary-400 to-secondary-600">
//             {images.length > 0 ? (
//               <>
//                 <img
//                   src={images[activeImageIndex]}
//                   alt={`${activity.title || 'Activity'} - Image ${activeImageIndex + 1}`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     const t = e.target;
//                     t.style.display = 'none';
//                     const next = t.nextElementSibling;
//                     if (next) next.setAttribute('style', 'display:flex');
//                   }}
//                 />
//                 <div className="w-full h-full hidden items-center justify-center text-white text-6xl">
//                   {getCategoryEmoji(activity.category)}
//                 </div>
//               </>
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-white text-6xl">
//                 {getCategoryEmoji(activity.category)}
//               </div>
//             )}

//             {/* Navigation arrows */}
//             {images.length > 1 && (
//               <>
//                 <button
//                   onClick={() =>
//                     setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
//                   }
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
//                 >
//                   <ChevronLeft className="h-5 w-5" />
//                 </button>

//                 <button
//                   onClick={() =>
//                     setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
//                   }
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
//                 >
//                   <ChevronRight className="h-5 w-5" />
//                 </button>
//               </>
//             )}

//             {/* Category badge */}
//             {activity.category && (
//               <div className="absolute top-4 left-4">
//                 <span className="bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-sm font-medium capitalize">
//                   {(activity.category || '').replace('_', ' ')}
//                 </span>
//               </div>
//             )}

//             {/* Popular badge */}
//             {activity.popular && (
//               <div className="absolute top-4 right-4">
//                 <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
//                   <Award className="h-3 w-3 mr-1" />
//                   Popular Choice
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Thumbnails */}
//           {images.length > 1 && (
//             <div className="flex space-x-2 mt-4 overflow-x-auto scrollbar-hide">
//               {images.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveImageIndex(index)}
//                   className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
//                     activeImageIndex === index
//                       ? 'border-primary-500 ring-2 ring-primary-200'
//                       : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                 >
//                   <img
//                     src={image}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       const t = e.target;
//                       t.style.display = 'none';
//                       const next = t.nextElementSibling;
//                       if (next) next.setAttribute('style', 'display:flex');
//                     }}
//                   />
//                   <div className="w-full h-full hidden items-center justify-center bg-gray-200 text-2xl">
//                     {getCategoryEmoji(activity.category)}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Main */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Header */}
//             <div>
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1">
//                   <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                     {activity.title}
//                   </h1>

//                   <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
//                     {activity.location && (
//                       <span className="flex items-center">
//                         <MapPin className="h-4 w-4 mr-1" />
//                         {activity.location.city}
//                         {activity.location.country ? `, ${activity.location.country}` : ''}
//                       </span>
//                     )}

//                     <span className="flex items-center">
//                       <Clock className="h-4 w-4 mr-1" />
//                       {formatDuration(activity.durationMinutes)}
//                     </span>

//                     {activity.maxParticipants && (
//                       <span className="flex items-center">
//                         <Users className="h-4 w-4 mr-1" />
//                         Up to {activity.maxParticipants} guests
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Rating */}
//               {activity?.rating?.avg != null && (
//                 <div className="flex items-center space-x-4 mb-6">
//                   <div className="flex items-center">
//                     <div className="flex items-center mr-2">
//                       {Array.from({ length: 5 }).map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`h-5 w-5 ${
//                             i < Math.floor(activity.rating.avg)
//                               ? 'text-yellow-400 fill-current'
//                               : 'text-gray-300 dark:text-gray-600'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <span className="text-lg font-semibold text-gray-900 dark:text-white">
//                       {Number(activity.rating.avg).toFixed(1)}
//                     </span>
//                   </div>

//                   <button
//                     onClick={() =>
//                       document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
//                     }
//                     className="text-primary-600 hover:text-primary-700 font-medium"
//                   >
//                     {activity.rating.count || 0} reviews
//                   </button>
//                 </div>
//               )}

//               {/* Quick Info */}
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 <InfoCard icon={CheckCircle} title="Instant Confirmation" description="Get confirmed instantly" />
//                 <InfoCard icon={X} title="Free Cancellation" description="Cancel up to 24h before" />
//                 <InfoCard icon={Shield} title="Safe & Secure" description="Your booking is protected" />
//                 <InfoCard icon={Award} title="Top Rated" description="Highly recommended" />
//               </div>
//             </div>

//             {/* Description */}
//             <Card>
//               <CardHeader>
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">About This Experience</h2>
//               </CardHeader>
//               <CardContent>
//                 <div className="prose prose-gray dark:prose-invert max-w-none">
//                   <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
//                     {activity.description ||
//                       'Experience the best of local culture with this amazing activity. Our expert guides will ensure you have an unforgettable time while discovering hidden gems and authentic experiences.'}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Included */}
//             <Card>
//               <CardHeader>
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">What&apos;s Included</h2>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid sm:grid-cols-2 gap-4">
//                   {(activity.included || [
//                     'Professional guide',
//                     'All entrance fees',
//                     'Small group experience',
//                     'Photo opportunities'
//                   ]).map((item, index) => (
//                     <div key={index} className="flex items-start">
//                       <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
//                       <span className="text-gray-700 dark:text-gray-300">{item}</span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Meeting Point */}
//             <Card>
//               <CardHeader>
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Meeting Point</h2>
//               </CardHeader>
//             <CardContent>
//                 <div className="flex items-start space-x-3">
//                   <MapPin className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium text-gray-900 dark:text-white mb-1">
//                       {activity.meetingPoint?.name || 'Central Meeting Point'}
//                     </p>
//                     <p className="text-gray-600 dark:text-gray-400 text-sm">
//                       {activity.meetingPoint?.address ||
//                         'Detailed meeting instructions will be provided after booking.'}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Reviews */}
//             <div id="reviews">
//               <Card>
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                       Reviews ({activity.rating?.count || 0})
//                     </h2>
//                     {activity?.rating?.avg != null && (
//                       <div className="flex items-center">
//                         <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
//                         <span className="font-semibold text-lg">
//                           {Number(activity.rating.avg).toFixed(1)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   {reviews.length > 0 ? (
//                     <div className="space-y-6">
//                       {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review, index) => (
//                         <ReviewCard key={review.id || index} review={review} />
//                       ))}

//                       {!showAllReviews && reviews.length > 3 && (
//                         <Button variant="outline" onClick={loadMoreReviews} loading={reviewsLoading} className="w-full">
//                           Show More Reviews
//                         </Button>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                       <p className="text-gray-600 dark:text-gray-400">
//                         No reviews yet. Be the first to share your experience!
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Similar Activities */}
//             {similarActivities.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <h2 className="text-xl font-bold text-gray-900 dark:text-white">Similar Activities</h2>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid sm:grid-cols-2 gap-4">
//                     {similarActivities.map((similar) => (
//                       <SimilarActivityCard key={similar._id} activity={similar} formatPrice={formatPrice} />
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-24">
//               <BookingCard
//                 activity={activity}
//                 formatPrice={formatPrice}
//                 formatDuration={formatDuration}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ---------------- Helper Components ---------------- */

// const InfoCard = ({ icon: Icon, title, description }) => (
//   <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
//     <Icon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
//     <h3 className="font-medium text-gray-900 dark:text-white text-sm">{title}</h3>
//     <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description}</p>
//   </div>
// );

// const ReviewCard = ({ review }) => (
//   <div className="border-b border-gray-200 dark:border-gray-600 last:border-b-0 pb-6 last:pb-0">
//     <div className="flex items-start space-x-4">
//       <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
//         <span className="text-primary-600 dark:text-primary-400 font-semibold">
//           {(review.user?.name?.charAt(0) || 'A').toUpperCase()}
//         </span>
//       </div>

//       <div className="flex-1">
//         <div className="flex items-center justify-between mb-2">
//           <div>
//             <h4 className="font-semibold text-gray-900 dark:text-white">
//               {review.user?.name || 'Anonymous'}
//             </h4>
//             <div className="flex items-center mt-1">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`h-4 w-4 ${
//                     i < (review.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             {review.date ? new Date(review.date).toLocaleDateString() : 'Recent'}
//           </span>
//         </div>

//         <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
//           {review.comment ||
//             'Amazing experience! Highly recommend this activity to anyone visiting the area. The guide was knowledgeable and the whole experience was well organized.'}
//         </p>
//       </div>
//     </div>
//   </div>
// );

// const SimilarActivityCard = ({ activity, formatPrice }) => (
//   <Link
//     to={`/activities/${activity._id}`}
//     className="group block border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
//   >
//     <div className="h-32 bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center">
//       <span className="text-3xl">{getCategoryEmoji(activity.category)}</span>
//     </div>

//     <div className="p-3">
//       <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
//         {activity.title}
//       </h4>
//       <div className="flex items-center justify-between mt-2">
//         {activity?.rating?.avg != null && (
//           <div className="flex items-center">
//             <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
//             <span className="text-xs font-medium">{Number(activity.rating.avg).toFixed(1)}</span>
//           </div>
//         )}
//         <span className="text-sm font-bold text-gray-900 dark:text-white">
//           {formatPrice(activity.basePrice)}
//         </span>
//       </div>
//     </div>
//   </Link>
// );

// const BookingCard = ({ activity, formatPrice, formatDuration }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isAuthenticated } = useAuthStore();

//   const handleBookNow = () => {
//     if (!isAuthenticated) {
//       toast.error('Please sign in to book this experience');
//       navigate('/auth/login', { state: { from: location } });
//       return;
//     }
//     navigate(`/book?type=activity&id=${activity._id}`);
//   };

//   return (
//     <Card className="border-2 border-primary-100 dark:border-primary-900">
//       <CardContent className="p-6">
//         <div className="mb-6">
//           <div className="flex items-baseline space-x-2 mb-2">
//             <span className="text-3xl font-bold text-gray-900 dark:text-white">
//               {formatPrice(activity.basePrice)}
//             </span>
//             <span className="text-gray-600 dark:text-gray-400">per person</span>
//           </div>

//           {activity.originalPrice && activity.originalPrice > activity.basePrice && (
//             <div className="flex items-center space-x-2">
//               <span className="text-lg text-gray-500 line-through">
//                 {formatPrice(activity.originalPrice)}
//               </span>
//               <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">
//                 Save {Math.round((1 - activity.basePrice / activity.originalPrice) * 100)}%
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="space-y-4 mb-6">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-gray-600 dark:text-gray-400">Duration:</span>
//             <span className="font-medium text-gray-900 dark:text-white">
//               {formatDuration(activity.durationMinutes)}
//             </span>
//           </div>

//           {activity.maxParticipants && (
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-gray-600 dark:text-gray-400">Group size:</span>
//               <span className="font-medium text-gray-900 dark:text-white">
//                 Up to {activity.maxParticipants} people
//               </span>
//             </div>
//           )}

//           <div className="flex items-center justify-between text-sm">
//             <span className="text-gray-600 dark:text-gray-400">Languages:</span>
//             <span className="font-medium text-gray-900 dark:text-white">
//               {activity.languages?.join(', ') || 'English'}
//             </span>
//           </div>
//         </div>

//         <Button
//           onClick={handleBookNow}
//           className="w-full mb-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
//           size="lg"
//         >
//           Book This Experience
//         </Button>

//         <div className="text-center">
//           <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
//             Free cancellation up to 24 hours before the activity
//           </p>

//           <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
//             <div className="flex items-center">
//               <Shield className="h-3 w-3 mr-1" />
//               Secure booking
//             </div>
//             <div className="flex items-center">
//               <CheckCircle className="h-3 w-3 mr-1" />
//               Instant confirmation
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// /* ---------------- helpers ---------------- */

// const getCategoryEmoji = (category) => {
//   const emojiMap = {
//     cultural: '🏛️',
//     food: '🍽️',
//     adventure: '🏔️',
//     nature: '🌿',
//     art: '🎨',
//     entertainment: '🎭',
//     heritage: '🏛️',
//     'food_drink': '🍷',
//     default: '📸'
//   };
//   return emojiMap[(category || '').toLowerCase()] || emojiMap.default;
// };

// export default ActivityDetail;





import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Button from '@/components/ui/Button';

const fmtINR = n => new Intl.NumberFormat('en-IN',{ style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n||0);

const getCategoryEmoji = (category) => {
  const emojiMap = {
    cultural: '🏛️',
    food: '🍽️',
    adventure: '🏔️',
    nature: '🌿',
    art: '🎨',
    entertainment: '🎭',
    heritage: '🏛️',
    'food_drink': '🍷',
    default: '📸'
  };
  return emojiMap[(category || '').toLowerCase()] || emojiMap.default;
};

export default function ActivityDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [data,setData]=useState(null);

  useEffect(()=>{
    api.get(`/activities/${id}`).then(r=>setData(r.data.data));
  },[id]);

  if (!data) return <div className="max-w-5xl mx-auto px-4 py-8">Loading…</div>;

  const price = data.price ?? data.basePrice ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="h-64 bg-gray-200 overflow-hidden rounded-lg">
        {data.images?.[0] ? (
          <img src={data.images[0]} alt={data.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {getCategoryEmoji(data.category)}
          </div>
        )}
      </div>
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="text-gray-700">{data.description}</p>
      <div className="text-2xl font-bold">{fmtINR(price)}</div>
      <Button onClick={()=>nav(`/book?type=activity&id=${data._id}`)}>Book Now</Button>
    </div>
  );
}