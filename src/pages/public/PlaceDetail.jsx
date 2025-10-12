
// get your gudide 

import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Image as ImgIcon, Compass, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSkeleton, SkeletonText } from '@/components/ui/LoadingSkeleton';
import Button from '@/components/ui/Button';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { api, getStoredToken } from '@/store/auth'; // ✅ Centralized axios + token

// /* -------------------------------------------------------------------- */

const formatINR = (price) =>
  typeof price !== 'number'
    ? '₹—'
    : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function PlaceDetail() {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relLoading, setRelLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlace = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/places/${id}`, { silenceToast: true });
      const d = res?.data?.data || res?.data || {};
      const pl = d.place || d;
      setPlace(pl);
    } catch (e) {
      console.error('Failed to load place', e);
      setError('Could not load this place.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ⬇️ UPDATED: try city param; if empty results & we have a city, retry with q=city
  const fetchActivities = useCallback(async (city) => {
    try {
      setRelLoading(true);
      const tryFetch = async (queryParams) => {
        const res = await api.get(`/activities?${queryParams.toString()}`, { silenceToast: true });
        return Array.isArray(res?.data?.data)
          ? res.data.data
          : res?.data?.activities || res?.data?.docs || res?.data?.results || [];
      };

      // first attempt: city filter (if your API supports it)
      const params1 = new URLSearchParams({ isPublished: 'true', limit: '8' });
      if (city) params1.set('city', city);
      let arr = await tryFetch(params1);

      // fallback: use q=city (works with your Search semantics)
      if ((!arr || arr.length === 0) && city) {
        const params2 = new URLSearchParams({ isPublished: 'true', limit: '8', q: city });
        arr = await tryFetch(params2);
      }

      setActivities(arr || []);
    } catch {
      setActivities([]);
    } finally {
      setRelLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlace(); }, [fetchPlace]);
  useEffect(() => {
    if (!place) return;
    const city = place?.city || place?.location?.city || place?.location;
    fetchActivities(city);
  }, [place, fetchActivities]);

  if (loading) return <PlaceSkeleton />;

  if (error || !place) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Place not found</h2>
        <p className="text-gray-600 mb-6">{error || 'Please try again later.'}</p>
        <Button as={Link} to="/search?type=place">Back to Search</Button>
      </div>
    );
  }

  const title = place.title || place.name || 'Untitled Destination';
  const city = place.city || place.location?.city || place.location;
  const rating = place?.rating?.avg;
  const count = place?.rating?.count;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HERO */}
      <section className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Media */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100 h-72 md:h-96 relative">
              <div className="absolute inset-0 grid place-items-center text-7xl select-none">
                <ImgIcon className="h-16 w-16 text-gray-400" />
              </div>
              {place?.featured && (
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                  <BadgeCheck className="h-3.5 w-3.5" /> Featured
                </div>
              )}
              <div className="absolute right-3 top-3">
  <FavoriteButton itemId={id} type="place" />
</div>
            </div>

            {/* Meta card */}
            <Card className="self-start sticky top-6">
              <CardContent className="p-5">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  {city ? (<span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{city}</span>) : null}
                  {rating ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 text-xs font-semibold">
                      <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                      {Number(rating).toFixed(1)} {count ? `(${count})` : ''}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <div className="inline-flex items-center gap-2"><Compass className="h-4 w-4" /> Top sights & local favorites</div>
                </div>

                {/* ⬇️ UPDATED: build link with q=city (and limit to activities) */}
                <div className="mt-5">
                  <Button
                    as={Link}
                    to={`/search?${new URLSearchParams({
                      q: city || '',
                      type: 'activity',
                    }).toString()}`}
                    className="w-full"
                  >
                    Explore activities in this place
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">About this destination</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {place.description || 'No description available yet.'}
                </p>
              </CardContent>
            </Card>

            {Array.isArray(place.tags) && place.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((t, i) => (
                      <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{t}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5 text-sm text-gray-700 dark:text-gray-300">
                <h4 className="font-semibold mb-2">Why visit</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Discover top attractions and local culture.</li>
                  <li>Highly rated by travelers.</li>
                  <li>Plenty of unique activities nearby.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activities in this place */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Popular activities in this area</h3>
          {relLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardContent className="p-4"><LoadingSkeleton className="h-36 mb-3" variant="shimmer" /><SkeletonText lines={2} /></CardContent></Card>
              ))}
            </div>
          ) : activities.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((a) => (
                <Link to={`/activities/${a._id}`} key={a._id} className="group block">
                  <Card className="overflow-hidden hover:shadow-md transition">
                    <div className="h-36 bg-gradient-to-br from-gray-200 to-gray-100 grid place-items-center text-4xl">
                      <span>🎯</span>
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
            <div className="text-sm text-gray-500">No activities found here yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function PlaceSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LoadingSkeleton className="h-72 md:h-96 rounded-2xl lg:col-span-2" variant="shimmer" />
        <Card><CardContent className="p-5"><SkeletonText lines={3} /><div className="mt-4"><SkeletonText lines={2} /></div></CardContent></Card>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardContent className="p-6"><SkeletonText lines={6} /></CardContent></Card>
        <Card><CardContent className="p-6"><SkeletonText lines={5} /></CardContent></Card>
      </div>
    </div>
  );
}
