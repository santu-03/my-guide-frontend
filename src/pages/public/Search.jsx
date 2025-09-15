// Search.jsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  X,
  ArrowRight,
  TrendingUp,
  MapPin,
  Star,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SkeletonList } from '@/components/ui/LoadingSkeleton';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
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

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL params -> state
  const query = searchParams.get('q') || '';
  const dateParam = searchParams.get('date') || '';
  const guestsParam = searchParams.get('guests') || '';
  const typeParam = searchParams.get('type') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'relevance';

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ places: [], activities: [] });
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    query,
    date: dateParam,
    guests: guestsParam || '1',
    type: typeParam,
    category: categoryParam,
    sort: sortParam,
    priceRange: '',
    rating: '',
    duration: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Helper to filter admin+approved in case backend doesn't enforce it
  const onlyAdminApproved = (arr = []) =>
    arr.filter((x) =>
      (x?.approved === true || x?.isApproved === true) &&
      (x?.source === 'admin' || x?.createdByRole === 'admin' || x?.createdBy?.role === 'admin')
    );

  const fetchResults = useCallback(async (searchFilters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchFilters.query) params.set('q', searchFilters.query);
      if (searchFilters.date) params.set('date', searchFilters.date);
      if (searchFilters.guests) params.set('guests', searchFilters.guests);
      if (searchFilters.category) params.set('category', searchFilters.category);
      if (searchFilters.sort) params.set('sort', searchFilters.sort);
      if (searchFilters.priceRange) params.set('priceRange', searchFilters.priceRange);
      if (searchFilters.rating) params.set('rating', searchFilters.rating);
      if (searchFilters.duration) params.set('duration', searchFilters.duration);

      // 🔒 Hard constraints: admin-only + approved
      params.set('approved', 'true');
      params.set('source', 'admin');

      const reqs = [];
      // Places
      reqs.push(
        (!searchFilters.type || searchFilters.type === 'place')
          ? api
              .get(`/places?${params.toString()}&limit=20`, { silenceToast: true })
              .catch(() => ({ data: { data: [] } }))
          : Promise.resolve({ data: { data: [] } })
      );
      // Activities
      reqs.push(
        (!searchFilters.type || searchFilters.type === 'activity')
          ? api
              .get(`/activities?${params.toString()}&limit=20`, { silenceToast: true })
              .catch(() => ({ data: { data: [] } }))
          : Promise.resolve({ data: { data: [] } })
      );

      const [placesRes, activitiesRes] = await Promise.all(reqs);

      const rawPlaces = Array.isArray(placesRes?.data?.data) ? placesRes.data.data : [];
      const rawActivities = Array.isArray(activitiesRes?.data?.data) ? activitiesRes.data.data : [];

      // Defensive filter
      const places = onlyAdminApproved(rawPlaces);
      const activities = onlyAdminApproved(rawActivities);

      setResults({ places, activities });
      setTotalResults(places.length + activities.length);
    } catch (err) {
      console.error('Search failed:', err);
      setResults({ places: [], activities: [] });
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(appliedFilters);
  }, [fetchResults, appliedFilters]);

  const updateURL = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (!value) return;
        if (key === 'sort' && value === 'relevance') return;
        params.set(key, value);
      });
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const applyFilters = () => {
    setAppliedFilters(filters);
    updateURL(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const cleared = {
      query: filters.query,
      date: '',
      guests: '1',
      type: '',
      category: '',
      sort: 'relevance',
      priceRange: '',
      rating: '',
      duration: '',
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    updateURL(cleared);
  };

  const activeFilterCount = useMemo(
    () =>
      Object.entries(appliedFilters).filter(([key, value]) => {
        if (!value) return false;
        if (key === 'query' || key === 'guests') return false;
        if (key === 'sort' && value === 'relevance') return false;
        return true;
      }).length,
    [appliedFilters]
  );

  const formatPrice = (price) => {
    if (typeof price !== 'number') return '₹—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '—';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title / Meta */}
        <div className="mb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {query ? `Search results for “${query}”` : 'Explore Experiences'}
            </h1>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {loading ? 'Searching…' : `${totalResults.toLocaleString()} experiences found`}
            </div>
          </div>

        {/* Sort + View + Filters */}
          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => {
                  const nf = { ...filters, sort: e.target.value };
                  setFilters(nf);
                  setAppliedFilters(nf);
                  updateURL(nf);
                }}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* View mode */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filters trigger */}
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'} w-full lg:w-80 flex-shrink-0`}>
            <Card className="sticky top-24">
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                  <div className="flex items-center space-x-2">
                    {activeFilterCount > 0 && (
                      <button type="button" onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">
                        Clear all
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">Categories</label>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <label key={cat.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={filters.category === cat.value}
                          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-2xl mr-2">{cat.icon}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">Price Range</label>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.value}
                          checked={filters.priceRange === range.value}
                          onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">Minimum Rating</label>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((r) => (
                      <label key={r} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={r}
                          checked={filters.rating === r.toString()}
                          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{r}+ Stars</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <Button
                    onClick={applyFilters}
                    className="w-full"
                    disabled={JSON.stringify(filters) === JSON.stringify(appliedFilters)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-8">
                <SkeletonList count={6} />
              </div>
            ) : totalResults === 0 ? (
              <EmptySearchResults query={query} onClearFilters={clearFilters} hasActiveFilters={activeFilterCount > 0} />
            ) : (
              <div className="space-y-12">
                {/* Places */}
                {results.places.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Destinations ({results.places.length})
                      </h2>
                      {results.places.length > 4 && (
                        <Link
                          to={`/search?${new URLSearchParams({ ...appliedFilters, type: 'place' }).toString()}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                        >
                          View all destinations
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      )}
                    </div>

                    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                      {results.places.map((place) => (
                        <PlaceCard key={place._id} place={place} viewMode={viewMode} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Activities */}
                {results.activities.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Activities ({results.activities.length})
                      </h2>
                      {results.activities.length > 8 && (
                        <Link
                          to={`/search?${new URLSearchParams({ ...appliedFilters, type: 'activity' }).toString()}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                        >
                          View all activities
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      )}
                    </div>

                    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}`}>
                      {results.activities.map((activity) => (
                        <ActivityCard key={activity._id} activity={activity} viewMode={viewMode} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Place Card
const PlaceCard = ({ place, viewMode }) => (
  <Link
    to={`/places/${place._id}`}
    className={`group block ${viewMode === 'list' ? 'mb-4' : ''}`}
    aria-label={`Explore ${place.title}`}
  >
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${viewMode === 'list' ? 'flex' : ''}`}>
      <div className={`relative bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-56'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="h-16 w-16 text-white/70" />
        </div>

        {/* Admin badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-[10px] font-semibold">
            Admin curated
          </span>
        </div>

        {place.city && (
          <div className="absolute top-3 right-3 z-20">
            <span className="bg-white/90 backdrop-blur text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
              {place.city}
            </span>
          </div>
        )}

        {place.trending && (
          <div className="absolute bottom-3 left-3 z-20">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              TRENDING
            </span>
          </div>
        )}
      </div>

      <CardContent className={`${viewMode === 'list' ? 'flex-1' : ''} p-4`}>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors dark:text-white line-clamp-2">
          {place.title || 'Untitled Destination'}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 dark:text-gray-300">
          {place.description || 'Discover this amazing destination with local experts.'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {place.rating?.avg != null && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium ml-1">{Number(place.rating.avg).toFixed(1)}</span>
              </div>
            )}
            {place.rating?.count != null && <span className="text-sm text-gray-500">({place.rating.count})</span>}
          </div>

          <div className="flex items-center text-primary-600 font-medium">
            <span className="text-sm">Explore</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

// Activity Card
const ActivityCard = ({ activity, viewMode }) => (
  <Link
    to={`/activities/${activity._id}`}
    className={`group block ${viewMode === 'list' ? 'mb-4' : ''}`}
    aria-label={`Book ${activity.title}`}
  >
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${viewMode === 'list' ? 'flex' : ''}`}>
      <div className={`relative bg-gradient-to-br from-secondary-400 to-secondary-600 overflow-hidden ${viewMode === 'list' ? 'w-40 flex-shrink-0' : 'h-40'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl">{getCategoryEmoji(activity.category)}</div>
        </div>

        {/* Admin badge */}
        <div className="absolute top-2 left-2 z-20">
          <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-[10px] font-semibold">
            Admin curated
          </span>
        </div>

        {activity.category && (
          <div className="absolute top-2 right-2">
            <span className="bg-white/90 backdrop-blur text-gray-900 px-2 py-1 rounded-full text-xs font-medium capitalize">
              {String(activity.category).replace('_', ' ')}
            </span>
          </div>
        )}

        <div className="absolute bottom-2 right-2">
          <div className="flex items-center bg-white/90 backdrop-blur rounded-full px-2 py-1">
            <Clock className="h-3 w-3 text-gray-600 mr-1" />
            <span className="text-xs font-medium text-gray-800">
              {formatDuration(activity.durationMinutes)}
            </span>
          </div>
        </div>
      </div>

      <CardContent className={`${viewMode === 'list' ? 'flex-1' : ''} p-4`}>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors dark:text-white text-sm">
          {activity.title || 'Untitled Activity'}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {activity.rating?.avg != null && (
              <>
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium">{Number(activity.rating.avg).toFixed(1)}</span>
                {activity.rating?.count != null && (
                  <span className="text-xs text-gray-500">({activity.rating.count})</span>
                )}
              </>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {formatPrice(activity.basePrice)}
            </div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

// Empty Results
const EmptySearchResults = ({ query, onClearFilters, hasActiveFilters }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <SearchIcon className="h-10 w-10 text-gray-400" />
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">
      {query ? `No results found for "${query}"` : 'No experiences found'}
    </h3>

    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      {hasActiveFilters
        ? 'Try adjusting your filters or search terms to find more options.'
        : 'Try a different search term or browse our popular destinations.'}
    </p>

    <div className="space-y-3">
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear all filters
        </Button>
      )}

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['Rome', 'Paris', 'Tokyo', 'New York', 'London'].map((city) => (
          <Link
            key={city}
            to={`/search?q=${city}`}
            className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full transition-colors"
          >
            {city}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const places = [
  { name: 'Victoria Memorial', category: 'cultural' },
  { name: 'Howrah Bridge', category: 'cultural' },
  { name: 'Prinsep Ghat', category: 'nature' },
  { name: 'Marble Palace', category: 'art' },
  { name: 'Jorasanko Thakur Bari', category: 'cultural' },
  { name: 'Indian Museum', category: 'art' },
  { name: 'Metropolitan Building', category: 'cultural' },
  { name: 'St. Paul’s Cathedral', category: 'cultural' },
  { name: 'Town Hall', category: 'cultural' },
  { name: 'Writers’ Building', category: 'cultural' },
  { name: 'Dakshineswar Kali Temple', category: 'spiritual' },
  { name: 'Belur Math', category: 'spiritual' },
  { name: 'Kalighat Temple', category: 'spiritual' },
  { name: 'Pareshnath Jain Temple', category: 'spiritual' },
  { name: 'Armenian Church of Nazareth', category: 'spiritual' },
  { name: 'Academy of Fine Arts', category: 'art' },
  { name: 'Nandan & Rabindra Sadan', category: 'entertainment' },
  { name: 'Birla Planetarium', category: 'entertainment' },
  { name: 'Science City', category: 'entertainment' },
  { name: 'Kolkata Tram Ride', category: 'adventure' },
  { name: 'Maidan', category: 'nature' },
  { name: 'Botanical Garden (Shibpur)', category: 'nature' },
  { name: 'Alipore Zoo', category: 'nature' },
  { name: 'Eco Park (New Town)', category: 'nature' },
  { name: 'Nicco Park', category: 'entertainment' },
  { name: 'College Street', category: 'cultural' },
  { name: 'New Market', category: 'shopping' },
  { name: 'Park Street', category: 'food' },
  { name: 'Burrabazar', category: 'shopping' },
  { name: 'Chinatown (Tiretta Bazaar & Tangra)', category: 'food' },
];

const getCategoryEmoji = (category) => {
  const emojiMap = {
    cultural: '🏛️',
    food: '🍽️',
    adventure: '🏔️',
    nature: '🌿',
    art: '🎨',
    entertainment: '🎭',
    spiritual: '🙏',
    shopping: '🛍️',
    default: '📸',
  };
  return emojiMap[String(category || '').toLowerCase()] || emojiMap.default;
};

// Add emojis to each place
const placesWithEmoji = places.map(place => ({
  ...place,
  emoji: getCategoryEmoji(place.category)
}));

console.log(placesWithEmoji);






export default Search;
