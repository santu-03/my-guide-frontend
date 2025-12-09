
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
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SkeletonCard } from '@/components/ui/LoadingSkeleton';
import Button from '@/components/ui/Button';
import { api } from '@/store/auth';

/* -------------------------------------------------------------------- */

/* ----------------------------- Helper Functions ----------------------------- */
const heroImages = [
  "/images/Pareshnath-Jain-Temple.jpg",
  "/images/Victoria-Memorial.jpg",
  "/images/sea.jpg",
  "/images/mountain.jpg",
];

// Robust data extraction from API responses
function pickArray(res, key) {
  if (!res) return [];
  
  const d = res?.data;
  const arr =
    d?.[key] ||
    d?.data?.[key] ||
    d?.docs ||
    d?.results ||
    d?.data ||
    d;
  
  console.log(`🔍 Extracting ${key}:`, arr);
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
    entertainment: '🎭',
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

// Helper to validate and filter images
const getValidImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images.filter(img => img && typeof img === 'string' && img.trim() !== '');
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
  const [error, setError] = useState(null);

  // ✅ Fetch homepage content (featured places & activities)
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🏠 Fetching homepage content...');

      const [placesRes, activitiesRes] = await Promise.all([
        api.get('/places', { 
          params: { featured: true, limit: 100, approved: true } 
        }).catch((e) => {
          console.error('❌ Places fetch error:', e);
          return { data: [] };
        }),
        api.get('/activities', {
          params: { featured: true, isPublished: true, limit: 100 }
        }).catch((e) => {
          console.error('❌ Activities fetch error:', e);
          return { data: [] };
        }),
      ]);

      console.log('📊 Places response:', placesRes);
      console.log('📊 Activities response:', activitiesRes);

      const places = pickArray(placesRes, 'places');
      const activities = pickArray(activitiesRes, 'activities');

      setContent({
        featuredPlaces: Array.isArray(places) ? places : [],
        featuredActivities: Array.isArray(activities) ? activities : [],
      });
      
    } catch (e) {
      console.error('❌ Failed to fetch homepage content:', e);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // ✅ Search handler
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle image errors
  const handleImageError = (e) => {
    e.target.src = '/placeholder-image.jpg';
    e.target.className = e.target.className + ' bg-gradient-to-br from-blue-50 to-indigo-100';
  };

  // Full-page loader
  const showPageLoader = loading && content.featuredPlaces.length === 0 && content.featuredActivities.length === 0;

  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={fetchContent}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Try Again
            </Button>
            <Button as={Link} to="/search" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Explore Anyway
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 bg-gradient-to-b from-white to-slate-50">
      {/* Page overlay loader */}
      {showPageLoader && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-gradient-to-br from-blue-600/90 to-indigo-700/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
            <p className="text-white text-sm font-medium">Loading amazing experiences...</p>
          </div>
        </div>
      )}

      {/* Hero Section with sliding background */}
      <section className="relative text-white overflow-hidden">
        {/* Sliding background images */}
        <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {heroImages.map((src, i) => (
            <div
              key={i}
              className="w-full h-full flex-shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Enhanced gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-purple-900/50 to-indigo-900/70" /> */}

        {/* Content */}
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-white/30">
              <Award className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">Trusted by 1M+ travelers worldwide</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-400">
                Local Experiences
              </span>
            </h1>

            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-white/95 font-light">
              Connect with expert local guides and instructors for authentic, unforgettable adventures around the world.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-5xl mx-auto bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/30" role="search" aria-label="Search experiences">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="relative lg:col-span-2">
                  <label htmlFor="location" className="sr-only">Where to?</label>
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input
                    id="location"
                    type="text"
                    value={searchForm.location}
                    onChange={(e) => setSearchForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Where do you want to go?"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white placeholder-slate-500 shadow-sm"
                    aria-required="false"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="date" className="sr-only">When?</label>
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input
                    id="date"
                    type="date"
                    value={searchForm.date}
                    onChange={(e) => setSearchForm((prev) => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white shadow-sm"
                    aria-required="false"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="guests" className="sr-only">Guests</label>
                  <Users className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <select
                    id="guests"
                    value={searchForm.guests}
                    onChange={(e) => setSearchForm((prev) => ({ ...prev, guests: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white appearance-none shadow-sm"
                    aria-required="false"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
                  disabled={loading}
                  aria-label="Search experiences"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Category Filters */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {['Cultural', 'Adventure', 'Food & Drink', 'Nature', 'Art & History'].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSearchForm((prev) => ({ ...prev, category }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                      searchForm.category === category
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-md'
                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/40 backdrop-blur-sm'
                    }`}
                    aria-pressed={searchForm.category === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Enhanced Nav dots */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 w-8 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
                i === currentIndex 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Globe, label: 'Destinations', value: '500+', color: 'from-blue-500 to-cyan-500' },
            { icon: Users, label: 'Expert Guides', value: '10,000+', color: 'from-emerald-500 to-green-500' },
            { icon: Star, label: 'Average Rating', value: '4.8', color: 'from-amber-500 to-orange-500' },
            { icon: Award, label: 'Happy Travelers', value: '1M+', color: 'from-purple-500 to-pink-500' },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Popular Destinations</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
            Curated list of amazing places to visit around the world
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} variant="shimmer" />)}
          </div>
        ) : content.featuredPlaces.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.featuredPlaces.map((place) => (
              <PlaceCard key={place._id || place.id} place={place} onImageError={handleImageError} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured places yet"
            description="Check back soon for amazing destinations"
            action={{ label: 'Explore all places', href: '/search?type=place' }}
          />
        )}
      </section>

      {/* Enhanced Popular Activities */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Popular Activities</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Unique experiences curated by local experts and highly rated by travelers
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} variant="shimmer" />)}
            </div>
          ) : content.featuredActivities.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.featuredActivities.map((activity) => (
                <ActivityCard key={activity._id || activity.id} activity={activity} onImageError={handleImageError} />
              ))}
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

      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-700/90" />
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 text-white/95 max-w-2xl mx-auto font-light">
            Join millions of travelers discovering unique experiences worldwide. Book with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              as={Link} 
              to="/search" 
              size="lg" 
              variant="secondary" 
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 hover:from-amber-500 hover:to-orange-500 shadow-lg hover:shadow-xl font-semibold"
              aria-label="Explore all experiences"
            >
              Explore Experiences
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              as={Link}
              to="/auth/signup"
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 font-semibold"
              aria-label="Become a guide"
            >
              Become a Guide
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-white/90">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-300 mr-1" />
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

/* --------------------------- Enhanced UI Components --------------------------- */
function RatingPill({ rating, count }) {
  if (!rating && !count) return null;
  const r = rating ? Number(rating).toFixed(1) : 'New';
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1.5 text-white text-xs font-semibold shadow-sm">
      <Star className="h-3.5 w-3.5 fill-white" />
      <span>{r}</span>
      {count ? <span className="text-white/90">({count})</span> : null}
    </span>
  );
}

function PerksRow({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
      {items.map((p, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
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
      <span className="text-xs text-slate-500">From</span>
      <span className="text-lg font-extrabold text-slate-800">{amount}</span>
      <span className="text-xs text-slate-500">{per}</span>
    </div>
  );
}

function TagPill({ children, className = '' }) {
  return (
    <span className={`rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm ${className}`}>
      {children}
    </span>
  );
}

/* Enhanced Place Card */
function PlaceCard({ place, onImageError }) {
  const title = place.title || place.name || 'Untitled Destination';
  const city = place.city || place.location?.city || place.location;
  const rating = place.averageRating || place.rating?.avg;
  const count = place.totalReviews || place.rating?.count;
  const images = getValidImages(place?.images || []);
  const hasImages = images.length > 0;

  return (
    <Link to={`/places/${place._id || place.id}`} className="group block" aria-label={`Explore ${title}`}>
      <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 bg-white">
        <div className="relative h-52 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
          {hasImages ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={onImageError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl">📍</div>
            </div>
          )}
          
          {place.featured && (
            <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
              <Star className="h-3 w-3 fill-white" />
              Featured
            </div>
          )}
          
          {city && (
            <div className="absolute bottom-3 left-3">
              <TagPill>
                <MapPin className="inline h-3.5 w-3.5 mr-1" />
                {city}
              </TagPill>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[15px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <RatingPill rating={rating} count={count} />
          </div>

          <PerksRow items={['Top sights', 'Locals recommend']} />
          <div className="mt-3 inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
            <span className="text-sm">Explore</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* Enhanced Activity Card */
function ActivityCard({ activity, onImageError }) {
  const title = activity.title || 'Untitled Activity';
  const city = activity?.place?.city || activity?.city;
  const duration = activity?.duration || (activity?.durationMinutes ? formatDuration(activity.durationMinutes) : null);
  const rating = activity?.averageRating || activity?.rating?.avg;
  const count = activity?.totalReviews || activity?.rating?.count;
  const images = getValidImages(activity?.images || []);
  const hasImages = images.length > 0;

  return (
    <Link to={`/activities/${activity._id || activity.id}`} className="group block" aria-label={`Book ${title}`}>
      <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 bg-white">
        <div className="relative h-44 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
          {hasImages ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={onImageError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl">{getCategoryEmoji(activity?.category)}</div>
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex gap-2">
            {city ? <TagPill>{city}</TagPill> : null}
            {activity?.category ? <TagPill className="capitalize">{activity.category}</TagPill> : null}
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[15px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <RatingPill rating={rating} count={count} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            {duration ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                {duration}
              </span>
            ) : null}
            {city ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                {city}
              </span>
            ) : null}
          </div>

          <PerksRow items={['Free cancellation', 'Reserve now & pay later']} />
          <PriceLine amount={formatINR(activity?.price || activity?.basePrice)} />
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
      {action && (
        <Button 
          as={Link} 
          to={action.href} 
          aria-label={action.label}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}