// // import axios from 'axios';
// // import { useAuthStore } from '@/store/auth';
// // import toast from 'react-hot-toast';

// // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// // // Create axios instance
// // const api = axios.create({
// //   baseURL: API_BASE_URL,
// //   timeout: 10000,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // Request interceptor to add auth token
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = useAuthStore.getState().accessToken;
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// // // Response interceptor for token refresh and error handling
// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;

// //     // Handle token expiry
// //     if (error.response?.status === 401 && 
// //         error.response?.data?.code === 'AUTH_TOKEN_EXPIRED' && 
// //         !originalRequest._retry) {
// //       originalRequest._retry = true;

// //       try {
// //         const { refreshToken } = useAuthStore.getState();
// //         if (refreshToken) {
// //           const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
// //             refreshToken
// //           });
          
// //           const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
          
// //           // Update store
// //           useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
          
// //           // Retry original request
// //           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
// //           return api(originalRequest);
// //         }
// //       } catch (refreshError) {
// //         // Refresh failed, logout user
// //         useAuthStore.getState().logout();
// //         window.location.href = '/auth/login';
// //         return Promise.reject(refreshError);
// //       }
// //     }

// //     // Handle other errors
// //     const errorMessage = error.response?.data?.message || 'Something went wrong';
// //     const errorCode = error.response?.data?.code || 'UNKNOWN_ERROR';

// //     // Don't show toast for certain errors
// //     const silentErrors = ['AUTH_REQUIRED', 'AUTH_FORBIDDEN', 'NOT_FOUND'];
// //     if (!silentErrors.includes(errorCode)) {
// //       toast.error(errorMessage);
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// // export default api;

// import axios from "axios";
// import { useAuthStore } from "@/store/auth";
// import toast from "react-hot-toast";

// /**
//  * Use relative /api by default so Vite can proxy to the backend in dev.
//  * In prod, set VITE_API_BASE_URL to your full origin (e.g. https://api.example.com/api).
//  */
// const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

// // If you’re using cookies (HttpOnly) for auth, set VITE_API_WITH_CREDENTIALS=true
// const WITH_CREDENTIALS = !!import.meta.env.VITE_API_WITH_CREDENTIALS;

// /** Primary axios instance used by the app */
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15_000,
//   withCredentials: WITH_CREDENTIALS,
//   headers: { "Content-Type": "application/json" },
// });

// /** A “raw” instance without interceptors for refresh calls to avoid loops */
// const raw = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15_000,
//   withCredentials: WITH_CREDENTIALS,
//   headers: { "Content-Type": "application/json" },
// });

// /* ---------------- Request: attach Bearer token ---------------- */
// api.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().accessToken;
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* ---------------- Response: refresh-once then retry -------------- */
// let refreshPromise = null;

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     // Network/timeout → show a clearer message
//     if (!error.response) {
//       toast.error("Network error. Check your connection or the server.");
//       return Promise.reject(error);
//     }

//     const status = error.response.status;
//     const code = error.response.data?.code;
//     const message = error.response.data?.message || "Something went wrong";

//     // Handle expired token once
//     const isExpired =
//       status === 401 && (code === "AUTH_TOKEN_EXPIRED" || message?.toLowerCase().includes("expired"));

//     if (isExpired && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // De-duplicate multiple 401s
//         if (!refreshPromise) {
//           const { refreshToken } = useAuthStore.getState();
//           if (!refreshToken) throw new Error("Missing refresh token");

//           refreshPromise = raw
//             .post("/auth/refresh", { refreshToken })
//             .then((r) => r.data?.data?.tokens)
//             .finally(() => {
//               refreshPromise = null;
//             });
//         }

//         const tokens = await refreshPromise;
//         if (!tokens?.accessToken) throw new Error("Refresh failed");

//         // Save new tokens
//         useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);

//         // Retry original request
//         originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
//         return api(originalRequest);
//       } catch (refreshErr) {
//         // Refresh failed → logout
//         useAuthStore.getState().logout?.();
//         // Hard-redirect to login to clear app state
//         window.location.href = "/auth/login";
//         return Promise.reject(refreshErr);
//       }
//     }

//     // Gentle toasts (don’t spam for common auth/404 cases)
//     const silent = new Set(["AUTH_REQUIRED", "AUTH_FORBIDDEN", "NOT_FOUND"]);
//     if (!silent.has(code)) toast.error(message);

//     return Promise.reject(error);
//   }
// );

// /* ---------------- Optional helper to normalize data -------------- */
// export const getData = (res, fallback) => {
//   const d = res?.data;
//   if (Array.isArray(d)) return d;
//   if (Array.isArray(d?.data)) return d.data;
//   if (d?.data != null) return d.data;
//   return d ?? fallback;
// };

// export default api;
















import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type':'application/json' },
});

// Add token if you use auth store; keep noop if not
api.interceptors.request.use((config)=>{
  try{
    const raw = localStorage.getItem('tg_user_token');
    if (raw) config.headers.Authorization = `Bearer ${raw}`;
  }catch{}
  return config;
});

api.interceptors.response.use(
  (res)=>res,
  (error)=>{
    const msg = error?.response?.data?.message || 'Something went wrong';
    const code = error?.response?.status;
    if (code && code >= 500) toast.error('Server error. Please try again.');
    else if (![401,403,404].includes(code)) toast.error(msg);
    return Promise.reject(error);
  }
);

export default api;
