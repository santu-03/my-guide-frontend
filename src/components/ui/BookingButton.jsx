


// src/components/ui/BookingButton.jsx
import React, { useState } from 'react';
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

/**
 * Unified booking button for both activities and places
 * @param {Object} activity - Activity or Place object
 */
export default function BookingButton({ 
  activity,  // Can be activity OR place
  color = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}) {
  const navigate = useNavigate();
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [quickDate, setQuickDate] = useState('');
  const [quickGuests, setQuickGuests] = useState('1');

  // Handle both activity and place objects
  const itemId = activity?._id || activity?.id;
  const itemTitle = activity?.title;
  const itemCity = activity?.city || activity?.place?.city;
  const itemDuration = activity?.duration;
  const itemRating = activity?.rating?.avg;
  const itemBasePrice = activity?.basePrice || 99; // Default to ₹99

  const handleQuickBook = () => {
    const params = new URLSearchParams({
      activity: itemId,
      ...(quickDate && { date: quickDate }),
      ...(quickGuests && { guests: quickGuests }),
    });
    navigate(`/booking?${params.toString()}`);
    setShowQuickBook(false);
  };

  const handleDirectBook = () => {
    navigate(`/booking?activity=${itemId}`);
  };

  return (
    <>
      <Button
        color={color}
        size={size}
        fullWidth={fullWidth}
        className={className}
        onClick={() => setShowQuickBook(true)}
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => setShowQuickBook(false)}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 animate-slide-up"
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
                  onClick={() => setShowQuickBook(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Activity Card */}
                <div className="flex gap-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                    🎯
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
                        onChange={(e) => setQuickDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:bg-gray-700 dark:text-white transition-all outline-none"
                        required
                      />
                    </div>
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
                        onChange={(e) => setQuickGuests(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 appearance-none dark:bg-gray-700 dark:text-white transition-all outline-none cursor-pointer"
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

                  {/* Price Preview */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Starting from
                      </span>
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatINR(itemBasePrice * Number(quickGuests))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Final price shown at checkout
                    </p>
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
                    onClick={() => setShowQuickBook(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    size="lg"
                    fullWidth
                    onClick={handleQuickBook}
                    disabled={!quickDate}
                    endIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Continue
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleDirectBook}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline transition-colors font-medium"
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