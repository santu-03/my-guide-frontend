// src/pages/booking/BookingConfirm.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Loader2, Calendar, Users, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api } from "@/store/auth";

const inr = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
    : "₹—";

export default function BookingConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const stateId = location?.state?.bookingId;
  const qpId = params.get("id");
  const bookingId = stateId || qpId || "";

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        if (!bookingId) {
          setError("Missing booking id.");
          return;
        }
        const res = await api.get(`/bookings/${bookingId}`, { silenceToast: true });
        const d = res?.data?.data || res?.data || {};
        if (!ignore) setBooking(d);
      } catch (e) {
        console.error(e);
        if (!ignore) setError("Could not load booking.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3" />
        <div>Loading your booking…</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <div className="mb-2 text-red-600 font-semibold">{error || "Booking not found"}</div>
        <Button as={Link} to="/search" variant="outline">Back to search</Button>
      </div>
    );
  }

  const title = booking?.activity?.title || "Activity";
  const date = booking?.date ? new Date(booking.date).toDateString() : "—";
  const guests = booking?.guests || 1;
  const city = booking?.activity?.city || booking?.activity?.place?.city || "—";
  const amount = typeof booking?.amount === "number" ? booking.amount : booking?.activity?.basePrice * guests;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-1" />
            <div>
              <h1 className="text-2xl font-bold">Booking confirmed</h1>
              <p className="text-gray-600 mt-1">Your reservation has been placed. A confirmation email will be sent shortly.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="font-semibold">{title}</div>
              <div className="mt-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {date}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {guests} guest{guests > 1 ? "s" : ""}</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {city}</div>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="font-semibold">Payment</div>
              <div className="mt-2 text-sm text-gray-700">
                <div>Total amount</div>
                <div className="text-xl font-bold">{inr(amount)}</div>
              </div>
              {/* If you need to go to a payment gateway instead of instant confirm: */}
              {/* <Button className="mt-3 w-full" onClick={() => startRazorpay(booking)}>Pay now</Button> */}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button as={Link} to={`/activities/${booking?.activity?._id || booking?.activityId || ""}`} variant="outline">
              View activity
            </Button>
            <Button as={Link} to="/account/bookings">Go to my bookings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
