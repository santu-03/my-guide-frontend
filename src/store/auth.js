// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import axios from 'axios';

// /* ==================== API base (unified) ==================== */
// const API_BASE =
//   import.meta.env.VITE_BACKEND_URL ||
//   import.meta.env.VITE_API_URL ||
//   import.meta.env.VITE_API_BASE_URL ||
//   'http://localhost:5000/api';

// /* =============== Token read helper (RELIABLE) =============== */
// export function getStoredToken() {
//   const storages = [localStorage, sessionStorage];
//   const KEYS = [
//     'token', 'accessToken', 'jwt',
//     'adminToken', 'superadminToken', 'vendorToken', 'managerToken', 'userToken'
//   ];

//   for (const storage of storages) {
//     // Search known keys
//     for (const key of KEYS) {
//       const raw = storage.getItem(key);
//       if (!raw) continue;

//       try {
//         const parsed = JSON.parse(raw);
//         if (typeof parsed === 'string') return parsed;
//         if (parsed?.token) return parsed.token;
//         if (parsed?.accessToken) return parsed.accessToken;
//         if (parsed?.data?.token) return parsed.data.token;
//         if (parsed?.data?.accessToken) return parsed.data.accessToken;
//       } catch {
//         return raw; // assume it's already a string token
//       }
//     }

//     // Check `user` object
//     try {
//       const userStr = storage.getItem('user');
//       const user = userStr ? JSON.parse(userStr) : null;
//       if (user?.token) return user.token;
//       if (user?.accessToken) return user.accessToken;
//     } catch {
//       // skip user parse error
//     }
//   }

//   return null;
// }

// /* ================= Shared Axios instance ===================== */
// export const api = axios.create({
//   baseURL: API_BASE,
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const token = getStoredToken();
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// /* ============== Token/User persistence utils ================= */
// function persistTokenToStorage(token, rememberMe) {
//   const storage = rememberMe ? localStorage : sessionStorage;
//   const keys = ['token', 'accessToken', 'jwt', 'userToken'];
//   for (const key of keys) {
//     storage.setItem(key, token);
//   }
// }

// function persistUserToStorage(user, rememberMe) {
//   const storage = rememberMe ? localStorage : sessionStorage;
//   storage.setItem('user', JSON.stringify(user));
// }

// function clearAllAuthStorage() {
//   const KEYS = ['token', 'accessToken', 'jwt', 'userToken', 'user'];
//   for (const key of KEYS) {
//     localStorage.removeItem(key);
//     sessionStorage.removeItem(key);
//   }
// }

// /* ======================== Auth Store ========================= */
// export const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       isLoading: false,

//       setAuth: (token, user, rememberMe = true) => {
//         if (token) persistTokenToStorage(token, rememberMe);
//         if (user) persistUserToStorage(user, rememberMe);
//         set({ token, user, isAuthenticated: !!token });
//       },

//       clearAuth: () => {
//         clearAllAuthStorage();
//         set({ user: null, token: null, isAuthenticated: false });
//       },

//       login: async ({ email, password, rememberMe = false }) => {
//         set({ isLoading: true });
//         try {
//           const res = await api.post('/auth/login', { email, password });
//           const { token, user } = res.data?.data || {};
//           if (!token || !user) throw new Error('Invalid login response');

//           get().setAuth(token, user, rememberMe);
//           set({ isLoading: false });
//           return { success: true, user };
//         } catch (error) {
//           set({ isLoading: false });
//           const msg =
//             error.response?.data?.message || error.message || 'Login failed';
//           return { success: false, error: msg };
//         }
//       },

//       signup: async (userData) => {
//         set({ isLoading: true });
//         try {
//           const res = await api.post('/auth/signup', userData);
//           const { token, user } = res.data?.data || {};
//           if (!token || !user) throw new Error('Invalid signup response');

//           const rememberMe = !!userData.rememberMe;
//           get().setAuth(token, user, rememberMe);
//           set({ isLoading: false });
//           return { success: true, user };
//         } catch (error) {
//           set({ isLoading: false });
//           const msg =
//             error.response?.data?.message || error.message || 'Signup failed';
//           return { success: false, error: msg };
//         }
//       },

//       logout: async () => {
//         try {
//           await api.post('/auth/logout');
//         } catch (e) {
//           console.error('Logout API error (non-critical):', e?.message);
//         } finally {
//           get().clearAuth();
//           set({ isLoading: false });
//         }
//       },

//       initialize: () => {
//         const token = getStoredToken();

//         const storage =
//           localStorage.getItem('token') ||
//           localStorage.getItem('accessToken') ||
//           localStorage.getItem('jwt') ||
//           localStorage.getItem('userToken')
//             ? localStorage
//             : sessionStorage;

//         const userStr = storage.getItem('user');
//         const user = userStr ? JSON.parse(userStr) : null;

//         if (token) {
//           set({ token, user, isAuthenticated: true });
//         }
//       },
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// );

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

/* ==================== API base (unified) ==================== */
const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

/* =============== Token read helper (simplified) =============== */
export function getStoredToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
}

/* ================= Shared Axios instance ===================== */
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Request interceptor - add token to all requests
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401 unauthorized (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { pathname } = window.location;
      // Don't redirect if already on auth pages
      if (!['/auth/login', '/auth/signup'].includes(pathname)) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/auth/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

/* ============== Token/User persistence utils ================= */
function persistAuth(token, user, rememberMe) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('token', token);
  storage.setItem('user', JSON.stringify(user));
}

function clearStorage() {
  ['token', 'user'].forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

/* ======================== Auth Store ========================= */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // ✅ Start with true

      setAuth: (token, user, rememberMe = true) => {
        persistAuth(token, user, rememberMe);
        set({ token, user, isAuthenticated: true, isLoading: false }); // ✅ Set loading false
      },

      clearAuth: () => {
        clearStorage();
        set({ user: null, token: null, isAuthenticated: false, isLoading: false }); // ✅ Set loading false
      },

      login: async ({ email, password, rememberMe = false }) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          const { token, user } = res.data?.data || {};
          if (!token || !user) throw new Error('Invalid login response');

          get().setAuth(token, user, rememberMe);
          return { success: true, user };
        } catch (error) {
          const msg = error.response?.data?.message || error.message || 'Login failed';
          return { success: false, error: msg };
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (userData) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/signup', userData);
          const { token, user } = res.data?.data || {};
          if (!token || !user) throw new Error('Invalid signup response');

          const rememberMe = !!userData.rememberMe;
          get().setAuth(token, user, rememberMe);
          return { success: true, user };
        } catch (error) {
          const msg = error.response?.data?.message || error.message || 'Signup failed';
          return { success: false, error: msg };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true }); // ✅ Set loading during logout
        try {
          await api.post('/auth/logout');
        } catch (e) {
          console.error('Logout API error (non-critical):', e?.message);
        } finally {
          get().clearAuth();
        }
      },

      refreshSession: async () => {
        try {
          const res = await api.get('/auth/me');
          const user = res.data?.data?.user;
          if (user) {
            set({ user });
            const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(user));
          }
        } catch (error) {
          console.error('Refresh session failed:', error);
        }
      },

      initialize: () => {
        set({ isLoading: true }); // ✅ Set loading at start
        
        try {
          const token = getStoredToken();
          
          if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
          const userStr = storage.getItem('user');
          const user = userStr ? JSON.parse(userStr) : null;

          if (token && user) {
            set({ token, user, isAuthenticated: true, isLoading: false });
          } else {
            set({ isLoading: false, isAuthenticated: false });
          }
        } catch (error) {
          console.error('Initialize error:', error);
          set({ isLoading: false, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);