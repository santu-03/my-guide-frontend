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