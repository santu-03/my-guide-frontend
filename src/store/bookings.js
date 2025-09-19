<<<<<<< HEAD
// import { create } from 'zustand';
// import api from '@/lib/api';

// export const useBookingStore = create((set, get) => ({
//   // State
//   bookings: [],
//   currentBooking: null,
//   isLoading: false,
  
//   // Booking flow
//   bookingFlow: {
//     step: 1,
//     data: {
//       targetType: null,
//       targetId: null,
//       date: null,
//       partySize: 1,
//       price: null,
//       guestDetails: {}
//     }
//   },

//   // Actions
//   setBookingFlow: (updates) => set((state) => ({
//     bookingFlow: {
//       ...state.bookingFlow,
//       ...updates,
//       data: { ...state.bookingFlow.data, ...updates.data }
//     }
//   })),

//   nextStep: () => set((state) => ({
//     bookingFlow: { ...state.bookingFlow, step: state.bookingFlow.step + 1 }
//   })),

//   prevStep: () => set((state) => ({
//     bookingFlow: { ...state.bookingFlow, step: Math.max(1, state.bookingFlow.step - 1) }
//   })),

//   resetBookingFlow: () => set({
//     bookingFlow: {
//       step: 1,
//       data: {
//         targetType: null,
//         targetId: null,
//         date: null,
//         partySize: 1,
//         price: null,
//         guestDetails: {}
//       }
//     }
//   }),

//   // API calls
//   fetchBookings: async () => {
//     set({ isLoading: true });
//     try {
//       const response = await api.get('/bookings/my');
//       set({ bookings: response.data.data, isLoading: false });
//     } catch (error) {
//       set({ isLoading: false });
//       console.error('Failed to fetch bookings:', error);
//     }
//   },

//   createQuote: async (bookingData) => {
//     try {
//       const response = await api.post('/bookings/quote', bookingData);
//       return response.data.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   },

//   holdBooking: async (bookingData) => {
//     try {
//       const response = await api.post('/bookings/hold', bookingData);
//       set({ currentBooking: response.data.data });
//       return response.data.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   },

//   confirmBooking: async (bookingId, paymentData) => {
//     try {
//       const response = await api.post(`/bookings/confirm/${bookingId}`, paymentData);
//       const booking = response.data.data;
      
//       // Update bookings list
//       set((state) => ({
//         bookings: [booking, ...state.bookings.filter(b => b._id !== booking._id)],
//         currentBooking: booking
//       }));
      
//       return booking;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   },

//   cancelBooking: async (bookingId) => {
//     try {
//       const response = await api.post(`/bookings/cancel/${bookingId}`);
//       const booking = response.data.data;
      
//       // Update bookings list
//       set((state) => ({
//         bookings: state.bookings.map(b => b._id === booking._id ? booking : b)
//       }));
      
//       return booking;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }
// }));
=======
import { create } from 'zustand';
import api from '@/lib/api';

export const useBookingStore = create((set, get) => ({
  // State
  bookings: [],
  currentBooking: null,
  isLoading: false,
  
  // Booking flow
  bookingFlow: {
    step: 1,
    data: {
      targetType: null,
      targetId: null,
      date: null,
      partySize: 1,
      price: null,
      guestDetails: {}
    }
  },

  // Actions
  setBookingFlow: (updates) => set((state) => ({
    bookingFlow: {
      ...state.bookingFlow,
      ...updates,
      data: { ...state.bookingFlow.data, ...updates.data }
    }
  })),

  nextStep: () => set((state) => ({
    bookingFlow: { ...state.bookingFlow, step: state.bookingFlow.step + 1 }
  })),

  prevStep: () => set((state) => ({
    bookingFlow: { ...state.bookingFlow, step: Math.max(1, state.bookingFlow.step - 1) }
  })),

  resetBookingFlow: () => set({
    bookingFlow: {
      step: 1,
      data: {
        targetType: null,
        targetId: null,
        date: null,
        partySize: 1,
        price: null,
        guestDetails: {}
      }
    }
  }),

  // API calls
  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/bookings/my');
      set({ bookings: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch bookings:', error);
    }
  },

  createQuote: async (bookingData) => {
    try {
      const response = await api.post('/bookings/quote', bookingData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  holdBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings/hold', bookingData);
      set({ currentBooking: response.data.data });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  confirmBooking: async (bookingId, paymentData) => {
    try {
      const response = await api.post(`/bookings/confirm/${bookingId}`, paymentData);
      const booking = response.data.data;
      
      // Update bookings list
      set((state) => ({
        bookings: [booking, ...state.bookings.filter(b => b._id !== booking._id)],
        currentBooking: booking
      }));
      
      return booking;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const response = await api.post(`/bookings/cancel/${bookingId}`);
      const booking = response.data.data;
      
      // Update bookings list
      set((state) => ({
        bookings: state.bookings.map(b => b._id === booking._id ? booking : b)
      }));
      
      return booking;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}));
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
