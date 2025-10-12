// get your guide 
import { useState, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Clock, Users, CheckCircle2, ArrowRight, Share2, Heart, ShieldCheck, BadgeCheck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSkeleton, SkeletonText, SkeletonButton } from '@/components/ui/LoadingSkeleton';
import Button from '@/components/ui/Button';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { api, getStoredToken, useAuthStore   } from '@/store/auth'; 

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

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

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

      // Accept many shapes: {data:{data:{}}} | {data:{activity}} | {data:{}}
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
      setRelated(arr.filter(x => x._id !== id));
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
  const price = formatINR(activity?.basePrice);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HERO */}
      <section className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Media (placeholder gradient + emoji) */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 h-72 md:h-96 relative">
              <div className="absolute inset-0 grid place-items-center text-7xl select-none">
                {getCategoryEmoji(activity.category)}
              </div>
              {activity?.featured && (
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                  <BadgeCheck className="h-3.5 w-3.5" /> Popular
                </div>
              )}
              <div className="absolute right-3 top-3">
  <FavoriteButton itemId={id} type="activity" />
</div>
            </div>

            {/* Booking Card */}
            <Card className="self-start sticky top-6">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{title}</h3>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  {rating ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 text-xs font-semibold">
                      <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                      {Number(rating).toFixed(1)} {count ? `(${count})` : ''}
                    </span>
                  ) : null}
                  {city ? (<span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{city}</span>) : null}
                  {duration ? (<span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{duration}</span>) : null}
                </div>

                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <Perk>Free cancellation</Perk>
                  <Perk>Reserve now &amp; pay later</Perk>
                  <Perk><ShieldCheck className="h-4 w-4" /> Instant confirmation</Perk>
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-xs text-gray-500">From</span>
                  <span className="text-2xl font-extrabold">{price}</span>
                  <span className="text-xs text-gray-500">per person</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button onClick={() => navigate(`/booking?activity=${id}`)} className="w-full">
                    Check availability
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" /> Save
                  </Button>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <button className="inline-flex items-center gap-1 hover:text-gray-700">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" /> {activity?.groupSize || 'Up to 10'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Title & meta for small screens (under media) */}
          <div className="mt-6 lg:hidden">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              {rating ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  {Number(rating).toFixed(1)} {count ? `(${count})` : ''}
                </span>
              ) : null}
              {city ? (<span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{city}</span>) : null}
              {duration ? (<span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{duration}</span>) : null}
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

                {/* highlights */}
                {Array.isArray(activity.highlights) && activity.highlights.length > 0 ? (
                  <div className="mt-5">
                    <h4 className="font-semibold mb-2">Highlights</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {activity.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                ) : null}

                {/* includes */}
                {Array.isArray(activity.includes) && activity.includes.length > 0 ? (
                  <div className="mt-5">
                    <h4 className="font-semibold mb-2">Includes</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {activity.includes.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Location */}
            {city ? (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Location</h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    <MapPin className="inline h-4 w-4 mr-1" /> {city}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Small info card */}
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
                <Link to={`/activities/${a._id}`} key={a._id} className="group block">
                  <Card className="overflow-hidden hover:shadow-md transition">
                    <div className="h-36 bg-gradient-to-br from-gray-200 to-gray-100 grid place-items-center text-4xl">
                      {getCategoryEmoji(a.category)}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary-600">{a.title || 'Activity'}</h4>
                        {a?.rating?.avg ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 text-[10px] font-semibold">
                            <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                            {Number(a.rating.avg).toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 text-xs text-gray-600">{formatINR(a.basePrice)} · {a.city || a?.place?.city || '—'}</div>
                    </CardContent>
                  </Card>
                </Link>
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

/* ----------------------------- small bits ----------------------------- */
function Perk({ children }) {
  const Icon = children?.type === ShieldCheck ? ShieldCheck : CheckCircle2;
  return (
    <div className="inline-flex items-center gap-2">
      {typeof children === 'string'
        ? <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> {children}</>
        : <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">{children}</span>}
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
