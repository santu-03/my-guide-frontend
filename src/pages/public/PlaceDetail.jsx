import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star, MapPin, Heart, Share2, ArrowLeft, Calendar, Users, Clock, Camera,
  Award, TrendingUp, CheckCircle, Shield, AlertCircle, ChevronLeft, ChevronRight,
  Navigation, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/LoadingSkeleton';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';
import axios from 'axios';

/* -------- Inline Axios client with token auth -------- */
const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const TOKEN_KEYS = ['token','accessToken','jwt','adminToken','superadminToken','vendorToken','managerToken','userToken'];
const getStoredToken = () => {
  for (const k of TOKEN_KEYS) {
    const raw = localStorage.getItem(k); if (!raw) continue;
    try { const p = JSON.parse(raw); return typeof p === 'string' ? p : (p?.token || p?.accessToken || p?.data?.token || p?.data?.accessToken || null); }
    catch { return raw; }
  }
  try { const u = JSON.parse(localStorage.getItem('user') || 'null'); return u?.token || u?.accessToken || null; }
  catch { return null; }
};

const API = axios.create({ baseURL: API_BASE, withCredentials: true });
API.interceptors.request.use((config) => {
  const t = getStoredToken(); if (t) config.headers.Authorization = `Bearer ${t}`; return config;
});
/* ----------------------------------------------------- */

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [place, setPlace] = useState(null);
  const [activities, setActivities] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        setLoading(true);
        setError('');

        const [placeRes, activitiesRes, reviewsRes, nearbyRes] = await Promise.all([
          api.get(`/places/${id}`, { silenceToast: true }),
          api
            .get(`/activities?placeId=${id}&limit=8`, { silenceToast: true })
            .catch(() => ({ data: { data: [] } })),
          api
            .get(`/places/${id}/reviews?limit=5`, { silenceToast: true })
            .catch(() => ({ data: [] })),
          api
            .get(`/places?nearby=${id}&limit=4`, { silenceToast: true })
            .catch(() => ({ data: { data: [] } }))
        ]);

        const placeData = placeRes?.data?.data || placeRes?.data;
        if (!placeData) {
          setError('Place not found');
          return;
        }

        setPlace(placeData);
        setActivities(activitiesRes?.data?.data || []);
        setReviews(reviewsRes?.data?.data || reviewsRes?.data || []);
        setNearbyPlaces(nearbyRes?.data?.data || []);

        if (isAuthenticated) {
          setIsWishlisted(false);
        }
      } catch (err) {
        console.error('Failed to fetch place:', err);
        setError('Failed to load place details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlaceData();
  }, [id, isAuthenticated]);

  const loadMoreReviews = async () => {
    if (reviewsLoading) return;
    try {
      setReviewsLoading(true);
      const response = await api.get(
        `/places/${id}/reviews?limit=10&offset=${reviews.length}`
      );
      const newReviews = response?.data?.data || response?.data || [];
      setReviews((prev) => [...prev, ...newReviews]);
      setShowAllReviews(true);
    } catch {
      toast.error('Failed to load more reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save to wishlist');
      navigate('/auth/login');
      return;
    }
    try {
      setIsWishlisted((v) => !v);
      toast.success(!isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = place?.title || 'Amazing Destination';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Failed to copy link');
      }
    }
  };

  const images = useMemo(
    () => [
      '/api/placeholder/800/600?text=Destination+Main',
      '/api/placeholder/800/600?text=Destination+Gallery+1',
      '/api/placeholder/800/600?text=Destination+Gallery+2',
      '/api/placeholder/800/600?text=Destination+Gallery+3',
      '/api/placeholder/800/600?text=Destination+Gallery+4'
    ],
    []
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'activities', label: 'Activities', icon: Star, count: activities.length },
    { id: 'reviews', label: 'Reviews', icon: Star, count: place?.rating?.count || 0 },
    { id: 'location', label: 'Location', icon: MapPin }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <SkeletonCard className="h-96" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <div>
                <SkeletonCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Place not found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The destination you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            {/* <Button onClick={() => navigate('/search')}>Browse Destinations</Button> */}
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab place={place} />;
      case 'activities':
        return <ActivitiesTab activities={activities} />;
      case 'reviews':
        return (
          <ReviewsTab
            reviews={reviews}
            showAll={showAllReviews}
            onLoadMore={loadMoreReviews}
            loading={reviewsLoading}
            place={place}
          />
        );
      case 'location':
        return <LocationTab place={place} />;
      default:
        return <OverviewTab place={place} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to search
            </button>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleWishlistToggle}
                className={`flex items-center ${isWishlisted ? 'text-red-600' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
            {images.length > 0 ? (
              <>
                <img
                  src={images[activeImageIndex]}
                  alt={`${place.title} - Image ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // fallback to icon if image fails
                    const target = e.target;
                    target.style.display = 'none';
                    const next = target.nextElementSibling;
                    if (next) next.setAttribute('style', 'display:flex');
                  }}
                />
                <div className="w-full h-full hidden items-center justify-center text-white">
                  <MapPin className="h-20 w-20 opacity-70" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <MapPin className="h-20 w-20 opacity-70" />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {place.featured && (
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  Featured
                </span>
              )}

              {place.trending && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </span>
              )}
            </div>

            {/* Photo count */}
            <div className="absolute bottom-4 right-4">
              <span className="bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-sm flex items-center">
                <Camera className="h-4 w-4 mr-1" />
                {images.length} photos
              </span>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === index
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target;
                      target.style.display = 'none';
                      const next = target.nextElementSibling;
                      if (next) next.setAttribute('style', 'display:flex');
                    }}
                  />
                  <div className="w-full h-full hidden items-center justify-center bg-gray-200">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {place.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {place.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>
                      {place.location.city}
                      {place.location.country ? `, ${place.location.country}` : ''}
                    </span>
                  </div>
                )}

                {place?.rating?.avg != null && (
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(place.rating.avg)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white mr-2">
                      {Number(place.rating.avg).toFixed(1)}
                    </span>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      ({place.rating.count || 0} reviews)
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <QuickStatCard icon={Star} value={activities.length} label="Activities" color="blue" />
                <QuickStatCard icon={Users} value="1M+" label="Visitors/year" color="green" />
                <QuickStatCard icon={Award} value="Top Rated" label="Destination" color="yellow" />
                <QuickStatCard icon={Calendar} value="Year-round" label="Best time" color="purple" />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        isActive
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                      {tab.count !== undefined && (
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            isActive ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="min-h-[16rem]">{renderTabContent()}</div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Plan Your Visit
                  </h3>

                  <div className="space-y-3">
                    <Button
                      as={Link}
                      to={`/search?type=activity&location=${encodeURIComponent(
                        place.location?.city || place.title
                      )}`}
                      className="w-full justify-start"
                    >
                      <Star className="h-4 w-4 mr-3" />
                      Find Activities
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            place.title
                          )}`,
                          '_blank'
                        )
                      }
                    >
                      <Navigation className="h-4 w-4 mr-3" />
                      Get Directions
                    </Button>

                    <Button variant="outline" className="w-full justify-start" onClick={handleWishlistToggle}>
                      <Heart className={`h-4 w-4 mr-3 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                      {isWishlisted ? 'Saved' : 'Save for Later'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Travel Tips</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TravelTip
                    icon={Clock}
                    title="Best Time to Visit"
                    description={place.bestTimeToVisit || 'Year-round destination with peak season from October to March'}
                  />

                  <TravelTip
                    icon={Car}
                    title="Getting There"
                    description={place.transportation || 'Well connected by public transport and taxi services'}
                  />

                  <TravelTip
                    icon={Users}
                    title="Ideal Duration"
                    description={place.idealDuration || '2-3 hours for a complete visit'}
                  />
                </CardContent>
              </Card>

              {nearbyPlaces.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nearby Places</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {nearbyPlaces.map((p) => (
                      <NearbyPlaceCard key={p._id} place={p} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Tabs ---------------- */

const OverviewTab = ({ place }) => (
  <div className="space-y-8">
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">About This Place</h2>
      </CardHeader>
      <CardContent>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {place.description ||
              'A remarkable destination that offers visitors a unique blend of culture, history, and natural beauty. Perfect for travelers seeking authentic experiences and memorable moments.'}
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Highlights</h2>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          {(place.highlights || [
            'Rich cultural heritage',
            'Stunning architecture',
            'Local markets and cuisine',
            'Photography opportunities',
            'Historical significance',
            'Authentic experiences'
          ]).map((highlight, idx) => (
            <div key={idx} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Amenities & Services</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <AmenityItem icon={Wifi} label="Free WiFi" available />
          <AmenityItem icon={Car} label="Parking" available />
          <AmenityItem icon={Utensils} label="Restaurants" available />
          <AmenityItem icon={Coffee} label="Cafes" available />
          <AmenityItem icon={ShoppingBag} label="Shopping" available />
          <AmenityItem icon={Shield} label="Security" available />
        </div>
      </CardContent>
    </Card>
  </div>
);

const ActivitiesTab = ({ activities }) => (
  <div className="space-y-6">
    {activities.length > 0 ? (
      <div className="grid sm:grid-cols-2 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity._id} activity={activity} />
        ))}
      </div>
    ) : (
      <Card>
        <CardContent className="p-12 text-center">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activities available</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Activities for this destination will be added soon.</p>
          <Button as={Link} to="/search?type=activity">
            Browse All Activities
          </Button>
        </CardContent>
      </Card>
    )}
  </div>
);

const ReviewsTab = ({ reviews, showAll, onLoadMore, loading, place }) => (
  <div className="space-y-6">
    {place?.rating?.avg != null && (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center mb-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white mr-3">
                {Number(place.rating.avg).toFixed(1)}
              </span>
              <div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(place.rating.avg) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on {place.rating.count || 0} reviews
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )}

    {reviews.length > 0 ? (
      <div className="space-y-6">
        {reviews.slice(0, showAll ? reviews.length : 3).map((review, index) => (
          <ReviewCard key={review.id || index} review={review} />
        ))}

        {!showAll && reviews.length > 3 && (
          <Button variant="outline" onClick={onLoadMore} loading={loading} className="w-full">
            Show More Reviews
          </Button>
        )}
      </div>
    ) : (
      <Card>
        <CardContent className="p-12 text-center">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Be the first to share your experience!</p>
        </CardContent>
      </Card>
    )}
  </div>
);

const LocationTab = ({ place }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Location & Contact</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {place.location && (
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {place.location.address || place.title}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {place.location.city}
                {place.location.country ? `, ${place.location.country}` : ''}{' '}
                {place.location.zipCode || ''}
              </p>
            </div>
          </div>
        )}

        {place.contact?.phone && (
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-primary-600 flex-shrink-0" />
            <a href={`tel:${place.contact.phone}`} className="text-primary-600 hover:text-primary-700">
              {place.contact.phone}
            </a>
          </div>
        )}

        {place.contact?.website && (
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-primary-600 flex-shrink-0" />
            <a
              href={place.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              Official Website
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-0">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Interactive map coming soon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ---------------- Small pieces ---------------- */

const QuickStatCard = ({ icon: Icon, value, label, color }) => {
  const colorClass =
    {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600'
    }[color] || 'text-primary-600';

  return (
    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <Icon className={`h-8 w-8 ${colorClass} mx-auto mb-2`} />
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
};

const TravelTip = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-primary-600 mt-1 flex-shrink-0" />
    <div>
      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const AmenityItem = ({ icon: Icon, label, available }) => (
  <div
    className={`flex items-center space-x-2 p-3 rounded-lg ${
      available ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'
    }`}
  >
    <Icon className={`h-4 w-4 ${available ? 'text-green-600' : 'text-gray-400'}`} />
    <span
      className={`text-sm font-medium ${
        available ? 'text-green-700 dark:text-green-300' : 'text-gray-500'
      }`}
    >
      {label}
    </span>
  </div>
);

const ActivityCard = ({ activity }) => (
  <Link to={`/activities/${activity._id}`} className="group block">
    <Card className="hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-t-lg flex items-center justify-center">
        <span className="text-4xl">{getCategoryEmoji(activity.category)}</span>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {activity.title}
        </h3>

        <div className="flex items-center justify-between">
          {activity?.rating?.avg != null && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium">{Number(activity.rating.avg).toFixed(1)}</span>
            </div>
          )}

          <span className="text-sm font-bold text-gray-900 dark:text-white">
            ₹{Number(activity.basePrice || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const NearbyPlaceCard = ({ place }) => (
  <Link
    to={`/places/${place._id}`}
    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
  >
    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
      <MapPin className="h-6 w-6 text-primary-600 dark:text-primary-400" />
    </div>

    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-gray-900 dark:text-white truncate">{place.title}</h4>
      {place?.rating?.avg != null && (
        <div className="flex items-center mt-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {Number(place.rating.avg).toFixed(1)} ({place.rating.count || 0})
          </span>
        </div>
      )}
    </div>
  </Link>
);

const ReviewCard = ({ review }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary-600 dark:text-primary-400 font-semibold">
            {(review.user?.name?.charAt(0) || 'A').toUpperCase()}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {review.user?.name || 'Anonymous'}
              </h4>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < (review.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {review.date ? new Date(review.date).toLocaleDateString() : 'Recent'}
            </span>
          </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {review.comment ||
              'Beautiful destination with rich history and culture. Highly recommended for anyone visiting the area.'}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ---------------- helpers ---------------- */

function getCategoryEmoji(category) {
  const emojiMap = {
    cultural: '🏛️',
    historical: '🏛️',
    nature: '🌿',
    adventure: '🏔️',
    food: '🍽️',
    art: '🎨',
    religious: '🕌',
    modern: '🏙️',
    default: '📍'
  };
  return emojiMap[(category || '').toLowerCase()] || emojiMap.default;
}

export default PlaceDetail;
