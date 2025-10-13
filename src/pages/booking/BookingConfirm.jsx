
// src/pages/booking/BookingConfirm.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
  Calendar,
  Users,
  MapPin,
  Clock,
  Mail,
  Phone,
  Download,
  Share2,
  Star,
  CreditCard
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api } from "@/store/auth";
import toast from "react-hot-toast";

// Inline formatters
const formatINR = (price) =>
  typeof price !== "number"
    ? "₹—"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(price);

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDuration = (minutes) => {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const getStatusInfo = (status) => {
  const statusMap = {
    pending: {
      label: "Pending Payment",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      icon: Clock,
    },
    confirmed: {
      label: "Confirmed",
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      icon: CheckCircle2,
    },
    completed: {
      label: "Completed",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      icon: Clock,
    },
  };
  return statusMap[status] || statusMap.pending;
};

export default function BookingConfirm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const bookingId = params.get("id") || "";

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  // Fetch booking details
  useEffect(() => {
    let mounted = true;

    const fetchBooking = async () => {
      if (!bookingId) {
        setError("No booking ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/bookings/${bookingId}`, {
          silenceToast: true,
        });

        const data = res?.data?.data || res?.data?.booking || res?.data;

        if (mounted) {
          setBooking(data);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError(err?.response?.data?.message || "Failed to load booking details.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBooking();

    return () => {
      mounted = false;
    };
  }, [bookingId]);

  // Handle download receipt
  const handleDownloadReceipt = () => {
    toast.success("Receipt download started");
    // Implement PDF generation or API call
  };

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Booking",
          text: `I've booked ${booking?.activity?.title}!`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading your booking...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "We couldn't find this booking."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button as={Link} to="/account/bookings" variant="outline">
              View My Bookings
            </Button>
            <Button as={Link} to="/search">
              Browse Activities
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activity = booking?.activity || {};
  const customer = booking?.customer || {};
  const pricing = booking?.pricing || {};
  const statusInfo = getStatusInfo(booking?.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your reservation has been successfully created
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <span>Booking ID:</span>
            <code className="font-mono">{booking._id || bookingId}</code>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.color} font-medium`}>
            <StatusIcon className="h-4 w-4" />
            {statusInfo.label}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Activity Details */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Booking Details
              </h2>

              {/* Activity Info */}
              <div className="flex gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 flex-shrink-0 flex items-center justify-center text-3xl">
                  🎯
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                    {activity.title || "Activity"}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {activity.city && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {activity.city}
                      </span>
                    )}
                    {activity.duration && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(activity.duration)}
                      </span>
                    )}
                    {activity.rating?.avg && (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {Number(activity.rating.avg).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Info Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Date</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(booking.date)}
                  </p>
                </div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Guests</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {booking.guests || 1} Guest{booking.guests > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {customer.name || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {customer.email || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {customer.phone || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Special Requests
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {booking.specialRequests}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium dark:text-white">
                      {formatINR(pricing.subtotal || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                    <span className="font-medium dark:text-white">
                      {formatINR(pricing.serviceFee || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">GST</span>
                    <span className="font-medium dark:text-white">
                      {formatINR(pricing.tax || 0)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Total Paid
                      </span>
                      <span className="font-bold text-xl text-primary-600 dark:text-primary-400">
                        {formatINR(pricing.total || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.status === "pending" && (
                  <div className="mt-6">
                    <Button className="w-full" startIcon={<CreditCard />}>
                      Complete Payment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Important Info */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  What's Next?
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-2">
                    <span>1.</span>
                    <span>Check your email for confirmation</span>
                  </li>
                  <li className="flex gap-2">
                    <span>2.</span>
                    <span>Arrive 15 minutes early</span>
                  </li>
                  <li className="flex gap-2">
                    <span>3.</span>
                    <span>Bring a valid photo ID</span>
                  </li>
                  <li className="flex gap-2">
                    <span>4.</span>
                    <span>Have a great experience!</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            startIcon={<Download className="h-4 w-4" />}
          >
            Download Receipt
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            startIcon={<Share2 className="h-4 w-4" />}
          >
            Share
          </Button>

          <Button as={Link} to="/account/bookings" variant="outline">
            View All Bookings
          </Button>

          <Button as={Link} to="/search">
            Browse More Activities
          </Button>
        </div>

        {/* Cancellation Policy */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Cancellation Policy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Free cancellation up to 24 hours before the activity starts. After that, 
              cancellations may be subject to a fee. For more details, please review our{" "}
              <Link to="/cancellation-policy" className="text-primary-600 hover:underline">
                full cancellation policy
              </Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}