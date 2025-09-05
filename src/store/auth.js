import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { socketService } from '@/lib/socket';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, isAuthenticated: !!accessToken });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', credentials);
          const { user, tokens } = response.data.data;
          
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false
          });

          // Connect socket
          socketService.connect();
          
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
      },

      signup: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/signup', userData);
          const { user, tokens } = response.data.data;
          
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false
          });

          // Connect socket
          socketService.connect();
          
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message || 'Signup failed' };
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        
        try {
          if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Disconnect socket
          socketService.disconnect();
          
          // Clear state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      // Initialize auth state on app start
      initialize: () => {
        const { accessToken } = get();
        if (accessToken) {
          socketService.connect();
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
