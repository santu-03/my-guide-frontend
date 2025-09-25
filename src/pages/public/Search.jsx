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
