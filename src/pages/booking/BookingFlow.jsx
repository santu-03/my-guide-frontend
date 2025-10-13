// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
// import { AlertTriangle, Calendar, Users, Mail, Phone, User, Loader2 } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { api } from "@/store/auth";

// const isAdminApproved = (doc) =>
//   !!doc &&
//   (doc.approved === true || doc.isApproved === true) &&
//   (doc.source === "admin" ||
//     doc.createdByRole === "admin" ||
//     doc?.createdBy?.role === "admin");

// const inr = (n) =>
//   typeof n === "number"
//     ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
//     : "₹—";

// export default function BookingPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [params] = useSearchParams();

//   // ✅ accept either ?activity or ?activityId (ActivityDetail uses ?activity)
//   const stateActivityId = location?.state?.activityId;
//   const qpActivityId = params.get("activityId") || params.get("activity");
//   const activityId = stateActivityId || qpActivityId || "";

//   const [loading, setLoading] = useState(true);
//   const [activity, setActivity] = useState(null);
//   const [error, setError] = useState("");

//   // form
//   const [date, setDate] = useState("");
//   const [guests, setGuests] = useState("1");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const guestOptions = useMemo(
//     () => Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} Guest${i ? "s" : ""}` })),
//     []
//   );

//   useEffect(() => {
//     const ac = new AbortController();
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         if (!activityId) {
//           setError("No activity selected.");
//           setActivity(null);
//           return;
//         }
//         const res = await api.get(`/activities/${activityId}`, {
//           signal: ac.signal,
//           silenceToast: true,
//           params: { approved: true, source: "admin" },
//         });
//         const data = res?.data?.data || null;
//         setActivity(isAdminApproved(data) ? data : null);
//         if (!isAdminApproved(data)) setError("This activity is not available to the public.");
//       } catch (e) {
//         if (e?.name !== "CanceledError") {
//           console.error(e);
//           setError("Failed to load activity.");
//           setActivity(null);
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => ac.abort();
//   }, [activityId]);

//   const totalPrice = useMemo(() => {
//     const base = typeof activity?.basePrice === "number" ? activity.basePrice : 0;
//     const g = Number(guests || 1) || 1;
//     return base * g;
//   }, [activity, guests]);

//   const formValid =
//     !!activity &&
//     !!date &&
//     Number(guests) > 0 &&
//     name.trim().length >= 2 &&
//     /\S+@\S+\.\S+/.test(email) &&
//     phone.trim().length >= 8;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formValid) return;

//     try {
//       setSubmitting(true);
//       setError("");

//       // quick recheck (server should enforce)
//       const check = await api.get(`/activities/${activityId}`, {
//         silenceToast: true,
//         params: { approved: true, source: "admin" },
//       });
//       const fresh = check?.data?.data || null;
//       if (!isAdminApproved(fresh)) {
//         setError("This activity is no longer available to the public.");
//         setSubmitting(false);
//         return;
//       }

//       const payload = {
//         activityId,
//         date,
//         guests: Number(guests),
//         customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
//       };

//       const resp = await api.post("/bookings", payload, { silenceToast: false });
//       const bookingId = resp?.data?.data?._id || "";

//       navigate(`/booking/confirm${bookingId ? `?id=${bookingId}` : ""}`, {
//         state: { bookingId, activityId },
//         replace: true,
//       });
//     } catch (e) {
//       console.error(e);
//       setError(e?.response?.data?.message || "Unable to create booking. Please check details and try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-40 bg-gray-200 rounded-xl" />
//           <div className="h-6 bg-gray-200 rounded w-2/3" />
//           <div className="h-4 bg-gray-200 rounded w-1/2" />
//         </div>
//       </div>
//     );
//   }

//   if (!activity) return <Unavailable error={error} />;

//   return (
//     <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-[1.4fr_1fr] gap-8">
//       <div className="space-y-6">
//         <Card>
//           <CardContent className="p-5">
//             <div className="flex items-start justify-between">
//               <div>
//                 <h1 className="text-xl md:text-2xl font-bold dark:text-white">{activity.title}</h1>
//                 <p className="text-gray-600 dark:text-gray-300 mt-1 capitalize">
//                   {String(activity.category || "").replace("_", " ") || "Experience"}
//                 </p>
//               </div>
//               <span className="bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-full h-fit">Admin curated</span>
//             </div>

//             <div className="mt-4 text-gray-700 dark:text-gray-300">{activity.description || "—"}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-5 space-y-5">
//             <h2 className="text-lg font-semibold dark:text-white">Book this activity</h2>

//             {error ? (
//               <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-800 p-3 text-sm">{error}</div>
//             ) : null}

//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <label className="relative block">
//                   <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">Date</span>
//                   <Calendar className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     min={new Date().toISOString().split("T")[0]}
//                     className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
//                     required
//                   />
//                 </label>

//                 <label className="relative block">
//                   <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">Guests</span>
//                   <Users className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
//                   <select
//                     value={guests}
//                     onChange={(e) => setGuests(e.target.value)}
//                     className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
//                   >
//                     {guestOptions.map((g) => (
//                       <option key={g.value} value={g.value}>
//                         {g.label}
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <label className="relative block">
//                   <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">Full name</span>
//                   <User className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
//                     placeholder="Your name"
//                     required
//                   />
//                 </label>

//                 <label className="relative block">
//                   <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">Email</span>
//                   <Mail className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
//                     placeholder="you@example.com"
//                     required
//                   />
//                 </label>

//                 <label className="relative block md:col-span-2">
//                   <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">Phone</span>
//                   <Phone className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
//                   <input
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
//                     placeholder="Your contact number"
//                     required
//                   />
//                 </label>
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <Button type="submit" disabled={!formValid || submitting} className="min-w-[160px]">
//                   {submitting ? (
//                     <span className="inline-flex items-center">
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Processing…
//                     </span>
//                   ) : (
//                     `Pay ${inr(totalPrice)}`
//                   )}
//                 </Button>
//                 <Button as={Link} to={`/activities/${activityId}`} variant="outline">
//                   Back to activity
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>

//       <aside className="space-y-4">
//         <Card>
//           <CardContent className="p-5 space-y-2">
//             <h3 className="text-lg font-semibold dark:text-white">Price summary</h3>
//             <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
//               <span>Base price</span>
//               <span>{inr(activity?.basePrice)}</span>
//             </div>
//             <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
//               <span>Guests</span>
//               <span>× {guests}</span>
//             </div>
//             <hr className="my-2 border-gray-200 dark:border-gray-700" />
//             <div className="flex justify-between font-semibold">
//               <span className="dark:text-white">Total</span>
//               <span className="dark:text-white">{inr(totalPrice)}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-5 text-sm text-gray-600 dark:text-gray-400">
//             By continuing, you agree that bookings are subject to availability and provider terms. Only <strong>admin-approved</strong> activities are eligible.
//           </CardContent>
//         </Card>
//       </aside>
//     </div>
//   );
// }

// function Unavailable({ error = "" }) {
//   return (
//     <div className="max-w-xl mx-auto p-8 text-center">
//       <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
//         <AlertTriangle className="h-8 w-8 text-amber-600" />
//       </div>
//       <h2 className="text-xl font-semibold mb-2 dark:text-white">Activity unavailable</h2>
//       <p className="text-gray-600 dark:text-gray-400">
//         This activity isn’t available to the public. Only <strong>admin-approved</strong> content can be booked.
//       </p>
//       {error ? <p className="mt-2 text-xs text-gray-500">({error})</p> : null}
//       <div className="mt-6">
//         <Button as={Link} to="/search" variant="outline">Back to search</Button>
//       </div>
//     </div>
//   );
// }


// src/pages/booking/BookingFlow.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
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
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api, useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

// Inline formatters
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

export default function BookingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  // Get activity ID from URL or state
  const stateActivityId = location?.state?.activityId;
  const qpActivityId = params.get("activityId") || params.get("activity");
  const activityId = stateActivityId || qpActivityId || "";

  // State
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("1");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Guest options
  const guestOptions = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ 
      value: String(i + 1), 
      label: `${i + 1} Guest${i ? "s" : ""}` 
    })),
    []
  );

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

  // Auto-fill user data when authenticated
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
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
    const total = subtotal + tax + serviceFee;

    return {
      basePrice: base,
      guests: guestCount,
      subtotal,
      tax,
      serviceFee,
      total,
    };
  }, [activity, guests]);

  // Form validation
  const formValid = useMemo(() => {
    return (
      !!activity &&
      !!date &&
      Number(guests) > 0 &&
      name.trim().length >= 2 &&
      /\S+@\S+\.\S+/.test(email) &&
      phone.trim().length >= 10 &&
      agreedToTerms
    );
  }, [activity, date, guests, name, email, phone, agreedToTerms]);

  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formValid) {
      toast.error("Please fill all required fields");
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error("Please login to complete booking");
      navigate("/auth/login", { 
        state: { 
          from: location.pathname + location.search,
          returnTo: `/booking?activity=${activityId}&date=${date}&guests=${guests}`
        } 
      });
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Final availability check
      const checkRes = await api.get(`/activities/${activityId}`, {
        silenceToast: true,
      });
      
      const freshActivity = checkRes?.data?.data || checkRes?.data;
      
      if (!isAdminApproved(freshActivity)) {
        setError("This activity is no longer available.");
        setSubmitting(false);
        return;
      }

      // Create booking payload
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

      // Create booking
      const bookingRes = await api.post("/bookings", payload);
      const booking = bookingRes?.data?.data || bookingRes?.data;
      const bookingId = booking?._id || booking?.id;

      toast.success("Booking created successfully!");

      // Navigate to confirmation
      navigate(`/booking/confirm?id=${bookingId}`, {
        state: { bookingId, activityId },
        replace: true,
      });

    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || "Unable to create booking. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-xl" />
              <div className="h-96 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-80 bg-gray-200 rounded-xl" />
          </div>
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
  const city = activity?.place?.city || activity?.city || activity?.location?.city;
  const duration = activity.duration || 
    (activity.durationMinutes ? formatDuration(activity.durationMinutes) : null);
  const rating = activity?.rating?.avg;
  const reviewCount = activity?.rating?.count;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <Link 
            to={`/activities/${activityId}`}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium inline-flex items-center gap-1 mb-2"
          >
            ← Back to activity
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fill in your details to confirm your reservation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content - Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Activity Summary Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 flex-shrink-0 flex items-center justify-center text-4xl">
                    🎯
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                          {reviewCount && ` (${reviewCount})`}
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
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
                </div>
              </div>
            )}

            {/* Booking Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Booking Details
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Date & Guests */}
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
                        Number of Guests <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none dark:bg-gray-800 dark:text-white"
                        >
                          {guestOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                      Contact Information
                    </h4>
                    
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
                            minLength={2}
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
                              minLength={10}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                      placeholder="Any special requirements or dietary restrictions?"
                    />
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      I agree to the{" "}
                      <a href="/terms" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/cancellation-policy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                        Cancellation Policy
                      </a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={!formValid || submitting}
                      className="flex-1 h-12 text-base"
                      startIcon={submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                    >
                      {submitting ? "Processing..." : `Pay ${formatINR(pricing.total)}`}
                    </Button>
                    <Button
                      as={Link}
                      to={`/activities/${activityId}`}
                      variant="outline"
                      className="h-12"
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="space-y-6">
            
            {/* Price Breakdown */}
            <Card className="sticky top-6">
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
                    <span className="text-gray-600 dark:text-gray-400">Service Fee (5%)</span>
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
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
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
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800 dark:text-green-200">
                      <p className="font-medium mb-1">Free Cancellation</p>
                      <p className="text-green-700 dark:text-green-300">
                        Cancel up to 24 hours before for a full refund
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Important Information
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Booking confirmation will be sent via email</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Please arrive 15 minutes before the scheduled time</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Bring a valid photo ID for verification</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Weather-dependent activities may be rescheduled</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}