// src/pages/account/MyBookings.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api } from "@/store/auth";

const inr = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
    : "₹—";

export default function MyBookings() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/bookings/me", { silenceToast: true });
        const arr = Array.isArray(res?.data?.data) ? res.data.data : res?.data?.results || res?.data || [];
        if (!ignore) setRows(arr);
      } catch (e) {
        console.error(e);
        if (!ignore) setError("Could not load your bookings.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto p-6">Loading…</div>;
  if (error) return <div className="max-w-3xl mx-auto p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">My bookings</h1>
      {rows.length === 0 ? (
        <Card><CardContent className="p-6 text-sm text-gray-600">No bookings yet.</CardContent></Card>
      ) : (
        rows.map((b) => (
          <Card key={b._id} className="overflow-hidden">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="font-semibold">{b?.activity?.title || "Activity"}</div>
                <div className="text-sm text-gray-600">
                  {new Date(b.date).toDateString()} · {b.guests} guest{b.guests > 1 ? "s" : ""} · {inr(b.amount)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button as={Link} to={`/booking/confirm?id=${b._id}`} size="sm">View</Button>
                <Button as={Link} to={`/activities/${b?.activity?._id || b.activityId}`} size="sm" variant="outline">Activity</Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
