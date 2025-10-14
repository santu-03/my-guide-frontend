// src/components/ui/BookingButton.jsx - FIXED with Place support
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Clock, MapPin, Star, X } from 'lucide-react';
import Button from './Button';

const formatINR = (price) =>
  typeof price !== 'number'
    ? '₹—'
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(price);

export default function BookingButton({ 
  activity,
  isPlace = false, // NEW: Detect if booking a place
  color = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}) {
  const navigate = useNavigate();
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [quickDate, setQuickDate] = useState('');
  const [quickGuests, setQuickGuests] = useState('1');
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Handle both activity and place objects
  const itemId = activity?._id || activity?.id;
  const itemTitle = activity?.title || 'Item';
  const itemCity = activity?.city || activity?.place?.city;
  const itemDuration = activity?.duration;
  const itemRating = activity?.rating?.avg;
  const itemBasePrice = activity?.basePrice || 99;
  const itemType = isPlace ? 'place' : 'activity'; // Determine type

  // Debug: Log itemId and type
  useEffect(() => {
    if (!itemId) {
      console.error('⚠️ BookingButton: No ID found', activity);
    } else {
      console.log(`✅ BookingButton: ${itemType} ID:`, itemId);
    }
  }, [itemId, itemType, activity]);

  // Focus management
  useEffect(() => {
    if (showQuickBook) {
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuickBook]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showQuickBook) {
        setShowQuickBook(false);
        setErrors({});
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showQuickBook]);

  const validateDate = (date) => {
    if (!date) return 'Please select a date';
    
    try {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(selected.getTime())) {
        return 'Invalid date format';
      }
      
      if (selected < today) {
        return 'Date must be today or later';
      }
      
      return ''; // Valid
    } catch (error) {
      console.error('Date validation error:', error);
      return 'Invalid date';
    }
  };

  const calculatePricing = (basePrice, guests) => {
    const subtotal = basePrice * Number(guests);
    const tax = Math.round(subtotal * 0.18);
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + tax + serviceFee;
    
    return { subtotal, tax, serviceFee, total };
  };

  const pricing = calculatePricing(itemBasePrice, quickGuests);

  const handleQuickBook = () => {
    console.log('🔵 Continue clicked', { quickDate, quickGuests, itemId, itemType });

    // Validate ID
    if (!itemId) {
      console.error('❌ No ID');
      setErrors({ general: 'ID is missing' });
      return;
    }

    // Validate date
    const dateError = validateDate(quickDate);
    if (dateError) {
      console.warn('⚠️ Date validation failed:', dateError);
      setErrors({ date: dateError });
      return;
    }

    // Clear errors
    setErrors({});

    // Build URL with appropriate parameter
    const params = new URLSearchParams();
    
    // Use 'place' or 'activity' parameter based on type
    if (isPlace) {
      params.set('place', itemId);
    } else {
      params.set('activity', itemId);
    }
    
    params.set('date', quickDate);
    params.set('guests', quickGuests);

    const bookingUrl = `/booking?${params.toString()}`;
    
    console.log('✅ Navigating to:', bookingUrl);

    // Navigate to booking flow
    try {
      navigate(bookingUrl);
      setShowQuickBook(false);
    } catch (error) {
      console.error('❌ Navigation failed:', error);
      setErrors({ general: 'Failed to navigate. Please try again.' });
    }
  };

  const handleDirectBook = () => {
    console.log('🔵 Skip clicked', { itemId, itemType });

    if (!itemId) {
      console.error('❌ No ID');
      return;
    }

    // Use appropriate parameter
    const param = isPlace ? 'place' : 'activity';
    const bookingUrl = `/booking?${param}=${itemId}`;
    
    console.log('✅ Navigating to:', bookingUrl);
    
    try {
      navigate(bookingUrl);
      setShowQuickBook(false);
    } catch (error) {
      console.error('❌ Navigation failed:', error);
    }
  };

  const handleCloseModal = () => {
    setShowQuickBook(false);
    setErrors({});
    setQuickDate('');
    setQuickGuests('1');
  };

  // Check if Continue button should be enabled
  const canContinue = quickDate && !errors.date && itemId;

  return (
    <>
      <Button
        color={color}
        size={size}
        fullWidth={fullWidth}
        className={className}
        onClick={() => {
          console.log('🔵 Check Availability clicked');
          setShowQuickBook(true);
        }}
        startIcon={<Calendar className="h-4 w-4" />}
      >
        Check Availability
      </Button>

      {/* Quick Booking Modal */}
      {showQuickBook && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              ref={modalRef}
              tabIndex={-1}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 
                  id="modal-title"
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  Quick Booking
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* General Error */}
                {errors.general && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">{errors.general}</p>
                  </div>
                )}

                {/* Item Card */}
                <div className="flex gap-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                    {isPlace ? '📍' : '🎯'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {itemTitle}
                    </h4>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                      {itemCity && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {itemCity}
                        </span>
                      )}
                      {itemDuration && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {itemDuration}
                        </span>
                      )}
                      {itemRating && (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {Number(itemRating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label 
                      htmlFor="booking-date"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Select Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-primary-500" />
                      <input
                        id="booking-date"
                        type="date"
                        value={quickDate}
                        onChange={(e) => {
                          console.log('📅 Date changed:', e.target.value);
                          setQuickDate(e.target.value);
                          setErrors(prev => ({ ...prev, date: '' }));
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:bg-gray-700 dark:text-white transition-all outline-none ${
                          errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                        aria-invalid={!!errors.date}
                        aria-describedby={errors.date ? 'date-error' : undefined}
                      />
                    </div>
                    {errors.date && (
                      <p id="date-error" className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label 
                      htmlFor="booking-guests"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Number of Guests <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-primary-500" />
                      <select
                        id="booking-guests"
                        value={quickGuests}
                        onChange={(e) => {
                          console.log('👥 Guests changed:', e.target.value);
                          setQuickGuests(e.target.value);
                        }}
                        className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 appearance-none dark:bg-gray-700 dark:text-white transition-all outline-none cursor-pointer"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num} Guest{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex justify-between">
                        <span>Base price × {quickGuests}</span>
                        <span>{formatINR(pricing.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee (5%)</span>
                        <span>{formatINR(pricing.serviceFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%)</span>
                        <span>{formatINR(pricing.tax)}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-emerald-200 dark:border-emerald-700 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</span>
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatINR(pricing.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex gap-3">
                  <Button
                    color="tertiary"
                    size="lg"
                    fullWidth
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    size="lg"
                    fullWidth
                    onClick={handleQuickBook}
                    disabled={!canContinue}
                    endIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Continue
                  </Button>
                </div>

                {/* Debug info - Remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Debug: {itemType}={itemId || 'missing'} | Date={quickDate || 'empty'}
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={handleDirectBook}
                    disabled={!itemId}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Skip and fill details later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}