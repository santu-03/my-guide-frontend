import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, MapPin, Clock, Users, CheckCircle2, Share2, Heart, ShieldCheck, BadgeCheck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSkeleton, SkeletonText, SkeletonButton } from '@/components/ui/LoadingSkeleton';
import Button from '@/components/ui/Button';
import FavoriteButton from '@/components/ui/FavoriteButton';
import BookingButton from '@/components/ui/BookingButton';
import { api } from '@/store/auth';

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

export default function ActivityDetail() {
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relLoading, setRelLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/activities/${id}`, { silenceToast: true });
      const d = res?.data?.data || res?.data || {};
      const act = d.activity || d;
      setActivity(act);
    } catch (e) {
      console.error('Failed to load activity', e);
      setError('Could not load this activity.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRelated = useCallback(async (category, city) => {
    try {
      setRelLoading(true);
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (city) params.set('city', city);
      params.set('isPublished', 'true');
      params.set('featured', 'true');
      params.set('limit', '8');

      const res = await api.get(`/activities?${params.toString()}`, { silenceToast: true });
      const arr =
        Array.isArray(res?.data?.data) ? res.data.data :
        res?.data?.activities || res?.data?.docs || res?.data?.results || [];
      setRelated((arr || []).filter(x => x._id !== id));
    } catch {
      setRelated([]);
    } finally {
      setRelLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchActivity(); }, [fetchActivity]);
  useEffect(() => {
    if (!activity) return;
    const city = activity?.place?.city || activity?.city || activity?.location?.city;
    fetchRelated(activity?.category, city);
  }, [activity, fetchRelated]);

  if (loading) return <ActivitySkeleton />;

  if (error || !activity) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Activity not found</h2>
        <p className="text-gray-600 mb-6">{error || 'Please try again later.'}</p>
        <Button as={Link} to="/search">Back to Search</Button>
      </div>
    );
  }

  const title = activity.title || 'Untitled Activity';
  const rating = activity?.rating?.avg;
  const count = activity?.rating?.count;
  const city = activity?.place?.city || activity?.city || activity?.location?.city;
  const duration =
    activity.duration || (activity.durationMinutes ? formatDuration(activity.durationMinutes) : null);

  // 🔒 Force display price = ₹99 (per person)
  const price = formatINR(99);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HERO */}
      <section className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Media */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 h-72 md:h-96 relative shadow-md">
              <div className="absolute inset-0 grid place-items-center text-7xl select-none">
                {getCategoryEmoji(activity.category)}
              </div>
              {activity?.featured && (
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                  <BadgeCheck className="h-3.5 w-3.5" /> Popular
                </div>
              )}
              <div className="absolute right-3 top-3">
                <FavoriteButton itemId={id} type="activity" />
              </div>
            </div>

            {/* Booking Card */}
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
                      <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{price}</span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">per person</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <BookingButton 
                    activity={activity}
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
                    <span>{activity?.groupSize || 'Up to 10'} guests</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Title for mobile */}
          <div className="mt-6 lg:hidden">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              {rating && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  {Number(rating).toFixed(1)} {count ? `(${count})` : ''}
                </span>
              )}
              {city && (<span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{city}</span>)}
              {duration && (<span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{duration}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">About this activity</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {activity.description || 'No description available yet.'}
                </p>

                {Array.isArray(activity.highlights) && activity.highlights.length > 0 && (
                  <div className="mt-5">
                    <h4 className="font-semibold mb-2">Highlights</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {activity.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                )}

                {Array.isArray(activity.includes) && activity.includes.length > 0 && (
                  <div className="mt-5">
                    <h4 className="font-semibold mb-2">Includes</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {activity.includes.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {city && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Location</h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    <MapPin className="inline h-4 w-4 mr-1" /> {city}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5 text-sm text-gray-700 dark:text-gray-300">
                <h4 className="font-semibold mb-2">Good to know</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Free cancellation available for most options.</li>
                  <li>Reserve now &amp; pay later to secure your spot.</li>
                  <li>Instant confirmation for many activities.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">You might also like</h3>
          {relLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardContent className="p-4"><LoadingSkeleton className="h-36 mb-3" variant="shimmer" /><SkeletonText lines={2} /></CardContent></Card>
              ))}
            </div>
          ) : related.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((a) => (
                <Card key={a._id} className="overflow-hidden hover:shadow-md transition">
                  <div className="h-36 bg-gradient-to-br from-gray-200 to-gray-100 grid place-items-center text-4xl">
                    {getCategoryEmoji(a.category)}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm line-clamp-2">
                        <Link to={`/activities/${a._id}`} className="group-hover:text-primary-600 hover:underline">
                          {a.title || 'Activity'}
                        </Link>
                      </h4>
                      {a?.rating?.avg && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 text-[10px] font-semibold">
                          <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                          {Number(a.rating.avg).toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* price + city */}
                    <div className="mt-2 text-xs text-gray-600">
                      {formatINR(99)} · {a.city || a?.place?.city || '—'}
                    </div>

                    {/* Book button (same component/feel as main activity) */}
                    <div className="mt-3">
                      <BookingButton activity={a} size="sm" color="primary" fullWidth />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No related activities found.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LoadingSkeleton className="h-72 md:h-96 rounded-2xl lg:col-span-2" variant="shimmer" />
        <Card><CardContent className="p-5"><SkeletonText lines={3} /><div className="mt-4"><SkeletonText lines={2} /></div><div className="mt-6 grid grid-cols-2 gap-2"><SkeletonButton fullWidth /><SkeletonButton fullWidth /></div></CardContent></Card>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardContent className="p-6"><SkeletonText lines={6} /></CardContent></Card>
        <Card><CardContent className="p-6"><SkeletonText lines={5} /></CardContent></Card>
      </div>
    </div>
  );
}
