import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { AlertTriangle, Calendar, Users, Mail, Phone, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

/** Helper: ensure document is admin-uploaded & approved */
const isAdminApproved = (doc) =>
  !!doc &&
  (doc.approved === true || doc.isApproved === true) &&
  (doc.source === "admin" ||
    doc.createdByRole === "admin" ||
    doc?.createdBy?.role === "admin");

/** Simple INR formatter */
const inr = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n)
    : "₹—";

export default function BookingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  // activityId may come from state (preferred) or query param (?activityId=)
  const stateActivityId = location?.state?.activityId;
  const qpActivityId = params.get("activityId");
  const activityId = stateActivityId || qpActivityId || "";

  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");

  // Booking form state
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const guestOptions = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        value: String(i + 1),
        label: `${i + 1} Guest${i ? "s" : ""}`,
      })),
    []
  );

  // 1) Load activity (admin-approved only)
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");

        if (!activityId) {
          setError("No activity selected.");
          setActivity(null);
          return;
        }

        // Ask server for admin-only approved document
        const res = await api.get(`/activities/${activityId}`, {
          signal: ac.signal,
          silenceToast: true,
          params: { approved: true, source: "admin" },
        });

        const data = res?.data?.data || null;
        setActivity(isAdminApproved(data) ? data : null);
        if (!isAdminApproved(data)) {
          setError("This activity is not available to the public.");
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
    })();
    return () => ac.abort();
  }, [activityId]);

  // 2) Derived price (basePrice * guests)
  const totalPrice = useMemo(() => {
    const base = typeof activity?.basePrice === "number" ? activity.basePrice : 0;
    const g = Number(guests || 1) || 1;
    return base * g;
  }, [activity, guests]);

  const formValid =
    !!activity &&
    !!date &&
    Number(guests) > 0 &&
    name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(email) &&
    phone.trim().length >= 8;

  // 3) Submit booking (re-check approval on server)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    try {
      setSubmitting(true);
      setError("");

      // Optional: re-fetch approval quickly (server-side must enforce anyway)
      const check = await api.get(`/activities/${activityId}`, {
        silenceToast: true,
        params: { approved: true, source: "admin" },
      });
      const fresh = check?.data?.data || null;
      if (!isAdminApproved(fresh)) {
        setError("This activity is no longer available to the public.");
        setSubmitting(false);
        return;
      }

      // Create booking (adjust this to your backend route)
      // Include server-trustable IDs; keep client data minimal
      const payload = {
        activityId,
        date,
        guests: Number(guests),
        customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
      };

      // Example endpoint: /bookings (change to your actual)
      const resp = await api.post("/bookings", payload, { silenceToast: false });

      // If you redirect to payment (Razorpay, etc.), do it here based on backend response
      // For now, navigate to a confirmation or booking detail page
      const bookingId = resp?.data?.data?._id || "";
      navigate(`/booking/confirm${bookingId ? `?id=${bookingId}` : ""}`, {
        state: { bookingId, activityId },
        replace: true,
      });
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.message ||
          "Unable to create booking. Please check details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- UI ---------- */

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  // Guard: not available or not admin-approved
  if (!activity) {
    return <Unavailable error={error} />;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-[1.4fr_1fr] gap-8">
      {/* Left: activity summary + form */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold dark:text-white">
                  {activity.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1 capitalize">
                  {String(activity.category || "").replace("_", " ") || "Experience"}
                </p>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-full h-fit">
                Admin curated
              </span>
            </div>

            <div className="mt-4 text-gray-700 dark:text-gray-300">
              {activity.description || "—"}
            </div>
          </CardContent>
        </Card>

        {/* Booking form */}
        <Card>
          <CardContent className="p-5 space-y-5">
            <h2 className="text-lg font-semibold dark:text-white">Book this activity</h2>

            {error ? (
              <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-800 p-3 text-sm">
                {error}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Date */}
                <label className="relative block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Date
                  </span>
                  <Calendar className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                    required
                  />
                </label>

                {/* Guests */}
                <label className="relative block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Guests
                  </span>
                  <Users className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                  >
                    {guestOptions.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Name */}
                <label className="relative block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Full name
                  </span>
                  <User className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                    placeholder="Your name"
                    required
                  />
                </label>

                {/* Email */}
                <label className="relative block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Email
                  </span>
                  <Mail className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                {/* Phone */}
                <label className="relative block md:col-span-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Phone
                  </span>
                  <Phone className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                    placeholder="Your contact number"
                    required
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={!formValid || submitting}
                  className="min-w-[160px]"
                >
                  {submitting ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    `Pay ${inr(totalPrice)}`
                  )}
                </Button>
                <Button as={Link} to={`/activities/${activityId}`} variant="outline">
                  Back to activity
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right: price summary */}
      <aside className="space-y-4">
        <Card>
          <CardContent className="p-5 space-y-2">
            <h3 className="text-lg font-semibold dark:text-white">Price summary</h3>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Base price</span>
              <span>{inr(activity?.basePrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Guests</span>
              <span>× {guests}</span>
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between font-semibold">
              <span className="dark:text-white">Total</span>
              <span className="dark:text-white">{inr(totalPrice)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-sm text-gray-600 dark:text-gray-400">
            By continuing, you agree that bookings are subject to availability and
            venue/provider terms. Only **admin-approved** activities are eligible.
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Unavailable({ error = "" }) {
  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-amber-600" />
      </div>
      <h2 className="text-xl font-semibold mb-2 dark:text-white">
        Activity unavailable
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        This activity isn’t available to the public. Only{" "}
        <strong>admin-approved</strong> content can be booked.
      </p>
      {error ? <p className="mt-2 text-xs text-gray-500">({error})</p> : null}
      <div className="mt-6">
        <Button as={Link} to="/search" variant="outline">
          Back to search
        </Button>
      </div>
    </div>
  );
}
