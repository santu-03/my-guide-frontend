


// src/pages/booking/BookingFlow.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { 
  AlertTriangle, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  User, 
  Loader2,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  Star,
  Info,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api, useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

// Formatters
const formatINR = (price) =>
  typeof price !== "number"
    ? "₹—"
    : new Intl.NumberFormat("en-IN", { 
        style: "currency", 
        currency: "INR", 
        maximumFractionDigits: 0 
      }).format(price);

const formatDuration = (minutes) => {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const isAdminApproved = (doc) =>
  !!doc &&
  (doc.approved === true || doc.isApproved === true || doc.status === 'approved');

// Step indicator component
const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    isCompleted
                      ? 'bg-primary-600 text-white'
                      : isCurrent
                      ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 -mt-8 ${
                    isCompleted ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default function BookingFlow() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  const activityId = params.get("activity");
  const prefilledDate = params.get("date");
  const prefilledGuests = params.get("guests");

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [date, setDate] = useState(prefilledDate || "");
  const [guests, setGuests] = useState(prefilledGuests || "1");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Steps configuration
  const steps = [
    { id: 'details', label: 'Details' },
    { id: 'contact', label: 'Contact' },
    { id: 'review', label: 'Review' },
  ];

  // Fetch activity
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchActivity = async () => {
      if (!activityId) {
        setError("No activity selected.");
        setActivity(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        const res = await api.get(`/activities/${activityId}`, {
          signal: controller.signal,
          silenceToast: true,
        });
        
        const data = res?.data?.data || res?.data || res;
        
        if (!isAdminApproved(data)) {
          setError("This activity is not available for booking.");
          setActivity(null);
        } else {
          setActivity(data);
        }
      } catch (e) {
        if (e?.name !== "CanceledError") {
          console.error(e);
          setError("Failed to load activity.");
          setActivity(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
    return () => controller.abort();
  }, [activityId]);

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Calculate pricing
  const pricing = useMemo(() => {
    const base = typeof activity?.basePrice === "number" ? activity.basePrice : 0;
    const guestCount = Number(guests || 1);
    const subtotal = base * guestCount;
    const tax = Math.round(subtotal * 0.18);
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + tax + serviceFee;

    return { basePrice: base, guests: guestCount, subtotal, tax, serviceFee, total };
  }, [activity, guests]);

  // Validation for each step
  const isStepValid = (step) => {
    switch (step) {
      case 0: // Details
        return !!date && Number(guests) > 0;
      case 1: // Contact
        return (
          name.trim().length >= 2 &&
          /\S+@\S+\.\S+/.test(email) &&
          phone.trim().length >= 10
        );
      case 2: // Review
        return agreedToTerms;
      default:
        return false;
    }
  };

  const canProceed = isStepValid(currentStep);

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle booking submission
  const handleSubmit = async () => {
    if (!agreedToTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to complete booking");
      navigate("/auth/login", { 
        state: { 
          returnTo: `/booking?activity=${activityId}&date=${date}&guests=${guests}`
        } 
      });
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        activityId,
        date,
        guests: Number(guests),
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        specialRequests: specialRequests.trim() || undefined,
        pricing: {
          basePrice: pricing.basePrice,
          subtotal: pricing.subtotal,
          tax: pricing.tax,
          serviceFee: pricing.serviceFee,
          total: pricing.total,
        },
      };

      const bookingRes = await api.post("/bookings", payload);
      const booking = bookingRes?.data?.data || bookingRes?.data;
      const bookingId = booking?._id || booking?.id;

      toast.success("Booking created successfully!");
      navigate(`/booking/confirm?id=${bookingId}`, { replace: true });

    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || "Unable to create booking.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading activity...</p>
        </div>
      </div>
    );
  }

  // Activity not available
  if (!activity) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Activity Unavailable</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || "This activity is not available for booking."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button as={Link} to="/search" variant="outline">
            Browse Activities
          </Button>
          <Button as={Link} to="/">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const title = activity.title || "Untitled Activity";
  const city = activity?.place?.city || activity?.city;
  const duration = activity.duration || 
    (activity.durationMinutes ? formatDuration(activity.durationMinutes) : null);
  const rating = activity?.rating?.avg;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          to={`/activities/${activityId}`}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to activity
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Follow the steps to confirm your reservation
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Activity Summary Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 flex-shrink-0 flex items-center justify-center text-3xl">
                    🎯
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      {city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {city}
                        </span>
                      )}
                      {duration && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {duration}
                        </span>
                      )}
                      {rating && (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {Number(rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
                </div>
              </div>
            )}

            {/* Step Content */}
            <Card>
              <CardContent className="p-6">
                
                {/* Step 1: Booking Details */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 dark:text-white">
                        Select Date & Guests
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Guests <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                              value={guests}
                              onChange={(e) => setGuests(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none dark:bg-gray-800 dark:text-white"
                            >
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>
                                  {num} Guest{num > 1 ? 's' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex gap-2">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-1">Flexible Booking</p>
                          <p>Free cancellation up to 24 hours before your activity starts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold dark:text-white">
                      Contact Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                              placeholder="you@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                              placeholder="+91 1234567890"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                          placeholder="Any special requirements?"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Confirm */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold dark:text-white">
                      Review Your Booking
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</div>
                          <div className="font-semibold dark:text-white">
                            {new Date(date).toLocaleDateString('en-IN', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Guests</div>
                          <div className="font-semibold dark:text-white">
                            {guests} Guest{Number(guests) > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Contact Details</div>
                        <div className="space-y-1">
                          <div className="font-medium dark:text-white">{name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{email}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{phone}</div>
                        </div>
                      </div>

                      {specialRequests && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Special Requests
                          </div>
                          <div className="text-sm dark:text-white">{specialRequests}</div>
                        </div>
                      )}

                      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          required
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                          I agree to the{" "}
                          <a href="/terms" className="text-primary-600 hover:underline">
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a href="/cancellation-policy" className="text-primary-600 hover:underline">
                            Cancellation Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={submitting}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="ml-auto gap-2"
                >
                  Next Step
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed || submitting}
                  loading={submitting}
                  className="ml-auto gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  {submitting ? 'Processing...' : `Pay ${formatINR(pricing.total)}`}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Price Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatINR(pricing.basePrice)} × {pricing.guests} guest{pricing.guests > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium dark:text-white">
                      {formatINR(pricing.subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                    <span className="font-medium dark:text-white">
                      {formatINR(pricing.serviceFee)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                    <span className="font-medium dark:text-white">
                      {formatINR(pricing.tax)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-lg dark:text-white">Total</span>
                      <span className="font-bold text-xl text-primary-600 dark:text-primary-400">
                        {formatINR(pricing.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="text-sm text-green-800 dark:text-green-200">
                      <p className="font-medium mb-1">Free Cancellation</p>
                      <p className="text-green-700 dark:text-green-300">
                        Cancel up to 24 hours before
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}