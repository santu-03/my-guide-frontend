import React, { useEffect, useMemo, useState } from "react";
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
  ArrowLeft,
  X,
  Check
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

// Validation utilities
const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
  },
  name: (name) => name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name),
  date: (date) => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }
};

// Enhanced Step indicator component
const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary-600 text-white scale-100'
                      : isCurrent
                      ? 'bg-primary-100 text-primary-600 ring-4 ring-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-900/30 scale-110'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 scale-90'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium transition-colors ${
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
                  className={`flex-1 h-1 mx-2 -mt-8 rounded-full transition-all duration-500 ${
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

// Form Input Component with validation
const FormInput = ({ 
  label, 
  icon: Icon, 
  error, 
  required, 
  touched,
  ...props 
}) => {
  const hasError = touched && error;
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:text-white ${
            hasError 
              ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20' 
              : 'border-gray-300 dark:border-gray-700 bg-white'
          }`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.name}-error` : undefined}
        />
        {hasError && (
          <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
        )}
      </div>
      {hasError && (
        <p id={`${props.name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <X className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default function BookingFlow() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  const itemId = params.get("activity") || params.get("place");
  const itemType = params.get("place") ? "place" : "activity"; // Detect type
  const prefilledDate = params.get("date");
  const prefilledGuests = params.get("guests");

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null); // Can be activity or place
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [availabilityChecking, setAvailabilityChecking] = useState(false);
  const [availability, setAvailability] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    date: prefilledDate || "",
    guests: prefilledGuests || "1",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    specialRequests: "",
    agreedToTerms: false
  });

  // Validation state
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Steps configuration
  const steps = [
    { id: 'details', label: 'Details' },
    { id: 'contact', label: 'Contact' },
    { id: 'review', label: 'Review' },
  ];

  // Fetch item (activity or place)
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchItem = async () => {
      if (!itemId) {
        setError("No item selected.");
        setItem(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        // Try to fetch as activity first
        console.log(`🔍 Fetching ${itemType}:`, itemId);
        
        let res;
        let data;
        
        try {
          // Try activity endpoint
          res = await api.get(`/activities/${itemId}`, {
            signal: controller.signal,
            silenceToast: true,
          });
          data = res?.data?.data || res?.data || res;
          console.log('✅ Found as activity:', data);
        } catch (activityError) {
          // If activity fails, try place endpoint
          console.log('⚠️ Not an activity, trying place...');
          res = await api.get(`/places/${itemId}`, {
            signal: controller.signal,
            silenceToast: true,
          });
          data = res?.data?.data || res?.data?.place || res?.data || res;
          console.log('✅ Found as place:', data);
        }
        
        // Check if approved (for activities)
        if (data.approved !== undefined && !isAdminApproved(data)) {
          setError("This item is not available for booking.");
          setItem(null);
        } else {
          setItem(data);
        }
      } catch (e) {
        if (e?.name !== "CanceledError") {
          console.error('❌ Fetch error:', e);
          setError("Failed to load item details.");
          setItem(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
    return () => controller.abort();
  }, [itemId, itemType]);

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  // Check availability
  useEffect(() => {
    if (formData.date && formData.guests) {
      setAvailabilityChecking(true);
      
      const timer = setTimeout(() => {
        // Simulate availability check
        setAvailability({
          available: true,
          spotsLeft: 8
        });
        setAvailabilityChecking(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [formData.date, formData.guests]);

  // Calculate pricing
  const pricing = useMemo(() => {
    const base = typeof item?.basePrice === "number" ? item.basePrice : 99; // Fallback to 99
    const guestCount = Number(formData.guests || 1);
    const subtotal = base * guestCount;
    const tax = Math.round(subtotal * 0.18);
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + tax + serviceFee;

    return { basePrice: base, guests: guestCount, subtotal, tax, serviceFee, total };
  }, [item, formData.guests]);

  // Validate field
  const validateField = (name, value) => {
    switch (name) {
      case 'date':
        if (!value) return 'Please select a date';
        if (!validators.date(value)) return 'Date must be today or later';
        return '';
      case 'guests':
        if (Number(value) < 1) return 'At least 1 guest required';
        return '';
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (!validators.name(value)) return 'Please enter a valid name';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validators.email(value)) return 'Please enter a valid email';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone is required';
        if (!validators.phone(value)) return 'Please enter a valid 10-digit phone number';
        return '';
      case 'agreedToTerms':
        if (!value) return 'You must agree to continue';
        return '';
      default:
        return '';
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate current step
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.date && 
               Number(formData.guests) > 0 && 
               !errors.date && 
               !errors.guests &&
               availability?.available;
      case 1:
        return formData.name && 
               formData.email && 
               formData.phone &&
               !errors.name && 
               !errors.email && 
               !errors.phone;
      case 2:
        return formData.agreedToTerms;
      default:
        return false;
    }
  };

  const canProceed = isStepValid();

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
    if (!formData.agreedToTerms) {
      toast.error("Please agree to terms and conditions");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to complete booking");
      navigate("/auth/login", { 
        state: { 
          returnTo: `/booking?activity=${itemId}&date=${formData.date}&guests=${formData.guests}`
        } 
      });
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        activityId: itemId, // API might expect activityId even for places
        placeId: itemType === 'place' ? itemId : undefined, // Include placeId if it's a place
        date: formData.date,
        guests: Number(formData.guests),
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        specialRequests: formData.specialRequests.trim() || undefined,
        pricing: {
          basePrice: pricing.basePrice,
          subtotal: pricing.subtotal,
          tax: pricing.tax,
          serviceFee: pricing.serviceFee,
          total: pricing.total,
        },
      };

      console.log('📤 Submitting booking:', payload);

      const bookingRes = await api.post("/bookings", payload);
      const booking = bookingRes?.data?.data || bookingRes?.data;
      const bookingId = booking?._id || booking?.id;

      console.log('✅ Booking created:', bookingId);

      toast.success("Booking created successfully!");
      navigate(`/booking/confirm?id=${bookingId}`, { replace: true });

    } catch (err) {
      console.error('❌ Booking error:', err);
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
          <p className="text-gray-600 dark:text-gray-400">Loading details...</p>
        </div>
      </div>
    );
  }

  // Item not available
  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Item Unavailable</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || "This item is not available for booking."}
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

  const title = item.title || "Untitled";
  const city = item?.place?.city || item?.city;
  const duration = item.duration || 
    (item.durationMinutes ? formatDuration(item.durationMinutes) : null);
  const rating = item?.rating?.avg;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          to={itemType === 'place' ? `/places/${itemId}` : `/activities/${itemId}`}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {itemType}
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
            
            {/* Item Summary Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 flex-shrink-0 flex items-center justify-center text-3xl">
                    {itemType === 'place' ? '📍' : '🎯'}
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Select Date & Guests
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormInput
                          label="Date"
                          name="date"
                          type="date"
                          icon={Calendar}
                          value={formData.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.date}
                          touched={touched.date}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Guests <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                              name="guests"
                              value={formData.guests}
                              onChange={handleChange}
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

                    {/* Availability Status */}
                    {formData.date && formData.guests && (
                      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        {availabilityChecking ? (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Checking availability...</span>
                          </div>
                        ) : availability?.available ? (
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <Check className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Available!</p>
                              <p className="text-sm text-green-600 dark:text-green-500">
                                {availability.spotsLeft} spots remaining for this date
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <X className="h-5 w-5" />
                            <p className="font-medium">Not available for selected date</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex gap-2">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-1">Flexible Booking</p>
                          <p>Free cancellation up to 24 hours before your {itemType} starts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Contact Information
                    </h3>
                    
                    <FormInput
                      label="Full Name"
                      name="name"
                      type="text"
                      icon={User}
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.name}
                      touched={touched.name}
                      placeholder="Enter your full name"
                      required
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        icon={Mail}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        touched={touched.email}
                        placeholder="you@example.com"
                        required
                      />

                      <FormInput
                        label="Phone"
                        name="phone"
                        type="tel"
                        icon={Phone}
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.phone}
                        touched={touched.phone}
                        placeholder="+91 1234567890"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                        placeholder="Any special requirements?"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Confirm */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Review Your Booking
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {new Date(formData.date).toLocaleDateString('en-IN', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Guests</div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {formData.guests} Guest{Number(formData.guests) > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Contact Details</div>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 dark:text-white">{formData.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{formData.email}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{formData.phone}</div>
                        </div>
                      </div>

                      {formData.specialRequests && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Special Requests
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white">{formData.specialRequests}</div>
                        </div>
                      )}

                      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <input
                          type="checkbox"
                          id="terms"
                          name="agreedToTerms"
                          checked={formData.agreedToTerms}
                          onChange={handleChange}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          required
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                          I agree to the{" "}
                          <a href="/terms" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a href="/cancellation-policy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
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
                  className="ml-auto gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay {formatINR(pricing.total)}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Price Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatINR(pricing.basePrice)} × {pricing.guests} guest{pricing.guests > 1 ? 's' : ''}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatINR(pricing.subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Service Fee (5%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatINR(pricing.serviceFee)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatINR(pricing.tax)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-lg text-gray-900 dark:text-white">Total</span>
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