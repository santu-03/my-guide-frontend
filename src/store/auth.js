// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import api from '@/lib/api';
// import { socketService } from '@/lib/socket';

// export const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       // State
//       user: null,
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: false,
//       isLoading: false,

//       // Actions
//       setTokens: (accessToken, refreshToken) => {
//         set({ accessToken, refreshToken, isAuthenticated: !!accessToken });
//       },

//       setUser: (user) => {
//         set({ user, isAuthenticated: !!user });
//       },

//       login: async (credentials) => {
//         set({ isLoading: true });
//         try {
//           const response = await api.post('/auth/login', credentials);
//           const { user, tokens } = response.data.data;
          
//           set({
//             user,
//             accessToken: tokens.accessToken,
//             refreshToken: tokens.refreshToken,
//             isAuthenticated: true,
//             isLoading: false
//           });

//           // Connect socket
//           socketService.connect();
          
//           return { success: true, user };
//         } catch (error) {
//           set({ isLoading: false });
//           return { success: false, error: error.response?.data?.message || 'Login failed' };
//         }
//       },

//       signup: async (userData) => {
//         set({ isLoading: true });
//         try {
//           const response = await api.post('/auth/signup', userData);
//           const { user, tokens } = response.data.data;
          
//           set({
//             user,
//             accessToken: tokens.accessToken,
//             refreshToken: tokens.refreshToken,
//             isAuthenticated: true,
//             isLoading: false
//           });

//           // Connect socket
//           socketService.connect();
          
//           return { success: true, user };
//         } catch (error) {
//           set({ isLoading: false });
//           return { success: false, error: error.response?.data?.message || 'Signup failed' };
//         }
//       },

//       logout: async () => {
//         const { refreshToken } = get();
        
//         try {
//           if (refreshToken) {
//             await api.post('/auth/logout', { refreshToken });
//           }
//         } catch (error) {
//           console.error('Logout error:', error);
//         } finally {
//           // Disconnect socket
//           socketService.disconnect();
          
//           // Clear state
//           set({
//             user: null,
//             accessToken: null,
//             refreshToken: null,
//             isAuthenticated: false,
//             isLoading: false
//           });
//         }
//       },

//       // Initialize auth state on app start
//       initialize: () => {
//         const { accessToken } = get();
//         if (accessToken) {
//           socketService.connect();
//         }
//       }
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({
//         user: state.user,
//         accessToken: state.accessToken,
//         refreshToken: state.refreshToken,
//         isAuthenticated: state.isAuthenticated
//       })
//     }
//   )
// );


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { socketService } from '@/lib/socket';

// API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (token, user, rememberMe = true) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        if (token) storage.setItem('token', token);
        if (user) storage.setItem('user', JSON.stringify(user));
        
        set({ token, user, isAuthenticated: !!token });
      },

      clearAuth: () => {
        // Clear both storages
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_BASE}/auth/login`, {
            email: credentials.email,
            password: credentials.password
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
          
          const { token, user } = response.data.data;
          const rememberMe = credentials.rememberMe || false;
          
          // Set authentication state
          get().setAuth(token, user, rememberMe);
          set({ isLoading: false });

          // Connect socket if available
          try {
            socketService.connect();
          } catch (socketError) {
            console.log('Socket connection failed (non-critical):', socketError.message);
          }
          
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          return { success: false, error: errorMessage };
        }
      },

      signup: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_BASE}/auth/signup`, userData, {
            headers: { 'Content-Type': 'application/json' }
          });
          
          const { token, user } = response.data.data;
          const rememberMe = userData.rememberMe || false;
          
          get().setAuth(token, user, rememberMe);
          set({ isLoading: false });

          try {
            socketService.connect();
          } catch (socketError) {
            console.log('Socket connection failed (non-critical):', socketError.message);
          }
          
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          const errorMessage = error.response?.data?.message || 'Signup failed';
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        const { token } = get();
        
        try {
          if (token) {
            await axios.post(`${API_BASE}/auth/logout`, {}, {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
              }
            });
          }
        } catch (error) {
          console.error('Logout API error (non-critical):', error.message);
        } finally {
          // Always clear state regardless of API response
          try {
            socketService.disconnect();
          } catch (socketError) {
            console.log('Socket disconnect failed (non-critical):', socketError.message);
          }
          
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      // Initialize auth state on app start
      initialize: () => {
        const localToken = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');
        const token = localToken || sessionToken;
        
        if (token) {
          const storage = localToken ? localStorage : sessionStorage;
          const userStr = storage.getItem('user');
          const user = userStr ? JSON.parse(userStr) : null;
          
          if (user) {
            set({
              token,
              user,
              isAuthenticated: true
            });
            
            try {
              socketService.connect();
            } catch (socketError) {
              console.log('Socket connection failed (non-critical):', socketError.message);
            }
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Don't persist tokens in zustand - handle manually for rememberMe
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);