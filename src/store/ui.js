import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Theme
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  
  // Mobile menu
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  
  // Loading states
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
    city: null
  },
  updateFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  resetFilters: () => set({
    filters: {
      category: null,
      priceRange: [0, 10000],
      dateRange: null,
      city: null
    }
  })
}));