// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import axios from 'axios';

// // API base URL
// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// export const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       isLoading: false,

//       // Actions
//       setAuth: (token, user, rememberMe = true) => {
//         const storage = rememberMe ? localStorage : sessionStorage;
//         if (token) storage.setItem('token', token);
//         if (user) storage.setItem('user', JSON.stringify(user));
//         set({ token, user, isAuthenticated: !!token });
//       },

//       clearAuth: () => {
//         // Clear both storages
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         sessionStorage.removeItem('token');
//         sessionStorage.removeItem('user');
//         set({
//           user: null,
//           token: null,
//           isAuthenticated: false
//         });
//       },

//       login: async (credentials) => {
//         set({ isLoading: true });
//         try {
//           const response = await axios.post(`${API_BASE}/auth/login`, {
//             email: credentials.email,
//             password: credentials.password
//           }, {
//             headers: { 'Content-Type': 'application/json' }
//           });

//           const { token, user } = response.data.data;
//           const rememberMe = credentials.rememberMe || false;

//           get().setAuth(token, user, rememberMe);
//           set({ isLoading: false });

//           return { success: true, user };
//         } catch (error) {
//           set({ isLoading: false });
//           const errorMessage = error.response?.data?.message || error.message || 'Login failed';
//           return { success: false, error: errorMessage };
//         }
//       },

//       signup: async (userData) => {
//         set({ isLoading: true });
//         try {
//           const response = await axios.post(`${API_BASE}/auth/signup`, userData, {
//             headers: { 'Content-Type': 'application/json' }
//           });

//           const { token, user } = response.data.data;
//           const rememberMe = userData.rememberMe || false;

//           get().setAuth(token, user, rememberMe);
//           set({ isLoading: false });

//           return { success: true, user };
//         } catch (error) {
//           set({ isLoading: false });
//           const errorMessage = error.response?.data?.message || 'Signup failed';
//           return { success: false, error: errorMessage };
//         }
//       },

//       logout: async () => {
//         const { token } = get();

//         try {
//           if (token) {
//             await axios.post(`${API_BASE}/auth/logout`, {}, {
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               }
//             });
//           }
//         } catch (error) {
//           console.error('Logout API error (non-critical):', error.message);
//         } finally {
//           get().clearAuth();
//           set({ isLoading: false });
//         }
//       },

//       // Initialize auth state on app start
//       initialize: () => {
//         const localToken = localStorage.getItem('token');
//         const sessionToken = sessionStorage.getItem('token');
//         const token = localToken || sessionToken;
//         if (token) {
//           const storage = localToken ? localStorage : sessionStorage;
//           const userStr = storage.getItem('user');
//           const user = userStr ? JSON.parse(userStr) : null;
//           if (user) {
//             set({
//               token,
//               user,
//               isAuthenticated: true
//             });
//           }
//         }
//       }
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({
//         // Don't persist tokens in zustand - handle manually for rememberMe
//         user: state.user,
//         isAuthenticated: state.isAuthenticated
//       })
//     }
//   )
// );
// auth.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

/* ==================== API base (unified) ==================== */
const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

/* =============== Token read helper (compat) ================== */
export function getStoredToken() {
  const storages = [localStorage, sessionStorage];
  const KEYS = ['token', 'accessToken', 'jwt', 'userToken'];
  for (const s of storages) {
    for (const k of KEYS) {
      const v = s.getItem(k);
      if (v) return v;
    }
  }
  return null;
}

/* ================= Shared Axios instance ===================== */
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ============== Token/User persistence utils ================= */
function persistTokenToStorage(token, rememberMe) {
  const storage = rememberMe ? localStorage : sessionStorage;
  // mirror across common keys so legacy pages can read it
  storage.setItem('token', token);
  storage.setItem('accessToken', token);
  storage.setItem('jwt', token);
  storage.setItem('userToken', token);
}

function persistUserToStorage(user, rememberMe) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('user', JSON.stringify(user));
}

function clearAllAuthStorage() {
  const KEYS = ['token', 'accessToken', 'jwt', 'userToken', 'user'];
  for (const key of KEYS) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

/* ======================== Auth Store ========================= */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (token, user, rememberMe = true) => {
        if (token) persistTokenToStorage(token, rememberMe);
        if (user) persistUserToStorage(user, rememberMe);
        set({ token, user, isAuthenticated: !!token });
      },

      clearAuth: () => {
        clearAllAuthStorage();
        set({ user: null, token: null, isAuthenticated: false });
      },

      login: async ({ email, password, rememberMe = false }) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          // expecting { data: { token, user } }
          const { token, user } = res.data?.data || {};
          if (!token || !user) throw new Error('Invalid login response');

          get().setAuth(token, user, rememberMe);
          set({ isLoading: false });
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          const msg = error.response?.data?.message || error.message || 'Login failed';
          return { success: false, error: msg };
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
          set({ isLoading: false });
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          const msg = error.response?.data?.message || 'Signup failed';
          return { success: false, error: msg };
        }
      },

      logout: async () => {
        const token = getStoredToken();
        try {
          if (token) {
            await api.post('/auth/logout'); // interceptor adds Authorization
          }
        } catch (e) {
          console.error('Logout API error (non-critical):', e?.message);
        } finally {
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      initialize: () => {
        // prefer persisted (localStorage) tokens over session
        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('accessToken') ||
          localStorage.getItem('jwt') ||
          localStorage.getItem('userToken') ||
          sessionStorage.getItem('token') ||
          sessionStorage.getItem('accessToken') ||
          sessionStorage.getItem('jwt') ||
          sessionStorage.getItem('userToken');

        // pick which storage has the user
        const storage = (
          localStorage.getItem('token') ||
          localStorage.getItem('accessToken') ||
          localStorage.getItem('jwt') ||
          localStorage.getItem('userToken')
        ) ? localStorage : sessionStorage;

        const userStr = storage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (token) {
          set({ token, user, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      // we do not persist token inside zustand; handled via web storage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/* ========================= UI Store ========================== */
import { create as createUI } from 'zustand';

export const useUIStore = createUI((set) => ({
  // Theme
  theme: 'light',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

  // Mobile menu
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  // Page loading
  isPageLoading: false,
  setPageLoading: (isLoading) => set({ isPageLoading: isLoading }),

  // Modals
  activeModal: null,
  openModal: (modalType, data = null) => set({ activeModal: { type: modalType, data } }),
  closeModal: () => set({ activeModal: null }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Filters
  filters: {
    category: null,
    priceRange: [0, 10000],
    dateRange: null,
    city: null,
  },
  updateFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () =>
    set({
      filters: {
        category: null,
        priceRange: [0, 10000],
        dateRange: null,
        city: null,
      },
    }),
}));
