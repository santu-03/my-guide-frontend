

import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { api, useAuthStore } from "@/store/auth";
import { useNavigate, useLocation } from "react-router-dom";

/** Optimistic toggle; redirects to login with return URL when unauthenticated. */
export default function FavoriteButton({
  itemId,
  type = "activity",            // "activity" | "place"
  className = "",
  size = 20,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!(isAuthenticated && itemId && type)) return;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await api.get(
          `/wishlist/check?itemId=${encodeURIComponent(itemId)}&type=${encodeURIComponent(type)}`,
          { signal: controller.signal }
        );
        if (mountedRef.current) setIsFavorite(Boolean(res?.data?.data?.inWishlist));
      } catch { /* best-effort */ }
    })();

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, [itemId, type, isAuthenticated]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Keep where the user was so we can bounce back after login
      navigate("/auth/login", { state: { from: location }, replace: true });
      return;
    }

    setLoading(true);
    const prev = isFavorite;
    setIsFavorite(!prev);

    try {
      const res = await api.post("/wishlist/toggle", { itemId, type });
      const serverState = Boolean(res?.data?.data?.inWishlist);
      if (mountedRef.current && serverState !== !prev) setIsFavorite(serverState);
    } catch (err) {
      if (mountedRef.current) setIsFavorite(prev); // rollback
      console.error("Toggle wishlist error:", err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || !itemId}
      className={`p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm disabled:opacity-60 ${className}`}
      title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isFavorite}
      type="button"
    >
      <Heart
        className={`${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} ${loading ? "animate-pulse" : ""}`}
        style={{ width: size, height: size }}
      />
    </button>
  );
}