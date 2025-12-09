
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, BadgeCheck, Users, Share2, Heart, CheckCircle2, ShieldCheck, Clock, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { api } from "@/store/auth";

const formatINR = (price) =>
  typeof price !== "number"
    ? "₹—"
    : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

// Helper function to validate and filter images
const getValidImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images.filter(img => img && typeof img === 'string' && img.trim() !== '');
};

export default function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchPlace = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching place with ID:', id);
      const res = await api.get(`/places/${id}`);
      
      // Debug the response structure
      console.log('🔍 Full API Response:', res);
      console.log('🔍 Response data:', res.data);
      
      // Extract place data from various possible response structures
      let placeData = null;
      
      if (res.data?.data?.place) {
        placeData = res.data.data.place;
      } else if (res.data?.place) {
        placeData = res.data.place;
      } else if (res.data?.data) {
        placeData = res.data.data;
      } else if (res.data) {
        placeData = res.data;
      }
      
      console.log('✅ Extracted place data:', placeData);
      
      if (!placeData) {
        throw new Error('Invalid response format from server');
      }
      
      setPlace(placeData);
      
    } catch (error) {
      console.error('❌ Error fetching place:', error);
      
      // Set user-friendly error messages
      if (error.response?.status === 404) {
        setError('Place not found. It may have been removed or does not exist.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to load place details. Please check your connection and try again.');
      }
      
      setPlace(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlace();
  }, [fetchPlace]);

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
          <p className="text-slate-600">Loading place details...</p>
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Unable to load place</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={fetchPlace}>Try Again</Button>
            <Button as={Link} to="/search" variant="outline">Back to Search</Button>
          </div>
        </div>
      </div>
    );
  }

  // No place found state
  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Place not found</h2>
          <p className="text-slate-600 mb-6">The place you're looking for doesn't exist.</p>
          <Button as={Link} to="/search">Back to Search</Button>
        </div>
      </div>
    );
  }

  // Destructure place data with safe defaults
  const { 
    name, 
    description, 
    city, 
    country, 
    category, 
    featured, 
    images = [],
    tags = [],
    price,
    startingPrice,
    maxGuests
  } = place;

  // Process images
  const validImages = getValidImages(images);
  const hasImages = validImages.length > 0;
  const title = name || "Untitled Place";
  const displayPrice = price || startingPrice || 99;
  const guestText = maxGuests ? `Up to ${maxGuests} guests` : 'Up to 10 guests';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 h-80 md:h-96 relative shadow-xl">
              {hasImages ? (
                <>
                  <img
                    src={validImages[currentImageIndex]}
                    alt={title}
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
                    <div className="text-4xl mb-2">📍</div>
                    <p className="text-sm">No images available</p>
                  </div>
                </div>
              )}
              
              {/* Featured badge */}
              {featured && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  <BadgeCheck className="h-4 w-4" />
                  <span>Featured</span>
                </div>
              )}
              
              {/* Favorite button */}
              <div className="absolute right-4 top-4">
                <FavoriteButton itemId={id} type="place" />
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
                      alt={`${title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Place Details */}
            <Card className="shadow-lg border border-slate-200 rounded-2xl">
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">{title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {city && (
                    <span className="inline-flex items-center gap-2 text-slate-700">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">{city}{country ? `, ${country}` : ''}</span>
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
                    {description || "No description available for this place."}
                  </p>
                  
                  {tags.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-semibold text-slate-800 mb-4 text-lg">Highlights</h3>
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
              <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {city && (
                  <span className="inline-flex items-center gap-1.5 text-slate-700 text-sm">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {city}
                  </span>
                )}
                {category && (
                  <span className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full text-sm text-slate-700 capitalize border border-blue-100">
                    {category}
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl space-y-3 border border-slate-200">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Free cancellation</span>
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

              {/* Pricing */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-slate-600">From</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {formatINR(displayPrice)}
                    </span>
                  </div>
                  <span className="text-sm text-slate-600">per person</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-4">
                <Button
                  as={Link}
                  to={`/booking?place=${id}`}
                  size="lg"
                  fullWidth
                  className="h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl"
                >
                  Book Experience
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

              {/* Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-sm">
                <button 
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition font-medium"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4" />
                  {guestText}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}