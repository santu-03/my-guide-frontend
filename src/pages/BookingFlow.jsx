// // // // // import { useState, useEffect } from 'react';
// // // // // import { useNavigate, useSearchParams } from 'react-router-dom';
// // // // // import { Calendar, Users, CreditCard, Check, ArrowLeft, ArrowRight } from 'lucide-react';
// // // // // import { useBookingStore } from '@/store/bookings';
// // // // // import Button from '@/components/ui/Button';
// // // // // import { Card, CardContent, CardHeader } from '@/components/ui/Card';
// // // // // import Modal from '@/components/ui/Modal';
// // // // // import toast from 'react-hot-toast';
// // // // // import { format, addDays } from 'date-fns';

// // // // // const BookingFlow = () => {
// // // // //   const navigate = useNavigate();
// // // // //   const [searchParams] = useSearchParams();
// // // // //   const {
// // // // //     bookingFlow,
// // // // //     setBookingFlow,
// // // // //     nextStep,
// // // // //     prevStep,
// // // // //     resetBookingFlow,
// // // // //     createQuote,
// // // // //     holdBooking,
// // // // //     confirmBooking
// // // // //   } = useBookingStore();

// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [quote, setQuote] = useState(null);
// // // // //   const [showPaymentModal, setShowPaymentModal] = useState(false);

// // // // //   useEffect(() => {
// // // // //     // Initialize booking flow from URL params
// // // // //     const targetType = searchParams.get('type');
// // // // //     const targetId = searchParams.get('id');
    
// // // // //     if (targetType && targetId) {
// // // // //       setBookingFlow({
// // // // //         data: {
// // // // //           targetType,
// // // // //           targetId,
// // // // //           date: null,
// // // // //           partySize: 1,
// // // // //           price: null,
// // // // //           guestDetails: {}
// // // // //         }
// // // // //       });
// // // // //     } else {
// // // // //       navigate('/search');
// // // // //     }

// // // // //     return () => {
// // // // //       resetBookingFlow();
// // // // //     };
// // // // //   }, [searchParams, setBookingFlow, navigate, resetBookingFlow]);

// // // // //   const handleNext = async () => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       if (bookingFlow.step === 1) {
// // // // //         // Get price quote
// // // // //         const quoteData = await createQuote(bookingFlow.data);
// // // // //         setQuote(quoteData);
// // // // //         setBookingFlow({ data: { price: quoteData } });
// // // // //       } else if (bookingFlow.step === 2) {
// // // // //         // Hold the booking
// // // // //         await holdBooking(bookingFlow.data);
// // // // //       }
// // // // //       nextStep();
// // // // //     } catch (error) {
// // // // //       toast.error(error.message || 'Something went wrong');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleConfirmBooking = async (paymentData) => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const booking = await confirmBooking(bookingFlow.data.bookingId, paymentData);
// // // // //       toast.success('Booking confirmed successfully!');
// // // // //       navigate(`/bookings/${booking._id}`);
// // // // //     } catch (error) {
// // // // //       toast.error(error.message || 'Payment failed');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const renderStepContent = () => {
// // // // //     switch (bookingFlow.step) {
// // // // //       case 1:
// // // // //         return <DateTimeStep />;
// // // // //       case 2:
// // // // //         return <GuestDetailsStep />;
// // // // //       case 3:
// // // // //         return <PaymentStep quote={quote} onConfirm={handleConfirmBooking} />;
// // // // //       case 4:
// // // // //         return <ConfirmationStep />;
// // // // //       default:
// // // // //         return null;
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
// // // // //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
// // // // //         {/* Progress Steps */}
// // // // //         <div className="mb-8">
// // // // //           <div className="flex items-center justify-between">
// // // // //             {[1, 2, 3, 4].map((step) => (
// // // // //               <div key={step} className="flex items-center">
// // // // //                 <div className={`
// // // // //                   w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
// // // // //                   ${step <= bookingFlow.step 
// // // // //                     ? 'bg-primary-600 text-white' 
// // // // //                     : 'bg-gray-200 text-gray-600'
// // // // //                   }
// // // // //                 `}>
// // // // //                   {step < bookingFlow.step ? <Check className="h-5 w-5" /> : step}
// // // // //                 </div>
// // // // //                 {step < 4 && (
// // // // //                   <div className={`
// // // // //                     w-16 h-1 mx-2
// // // // //                     ${step < bookingFlow.step ? 'bg-primary-600' : 'bg-gray-200'}
// // // // //                   `} />
// // // // //                 )}
// // // // //               </div>
// // // // //             ))}
// // // // //           </div>
          
// // // // //           <div className="flex justify-between mt-2">
// // // // //             <span className="text-xs text-gray-500">Date & Time</span>
// // // // //             <span className="text-xs text-gray-500">Guest Details</span>
// // // // //             <span className="text-xs text-gray-500">Payment</span>
// // // // //             <span className="text-xs text-gray-500">Confirmation</span>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Step Content */}
// // // // //         <Card className="mb-8">
// // // // //           <CardContent className="p-8">
// // // // //             {renderStepContent()}
// // // // //           </CardContent>
// // // // //         </Card>

// // // // //         {/* Navigation */}
// // // // //         {bookingFlow.step < 4 && (
// // // // //           <div className="flex justify-between">
// // // // //             <Button
// // // // //               variant="outline"
// // // // //               onClick={bookingFlow.step === 1 ? () => navigate(-1) : prevStep}
// // // // //             >
// // // // //               <ArrowLeft className="mr-2 h-4 w-4" />
// // // // //               {bookingFlow.step === 1 ? 'Back to Search' : 'Previous'}
// // // // //             </Button>
            
// // // // //             <Button
// // // // //               onClick={handleNext}
// // // // //               loading={loading}
// // // // //               disabled={!isStepComplete(bookingFlow.step, bookingFlow.data)}
// // // // //             >
// // // // //               {bookingFlow.step === 3 ? 'Confirm Booking' : 'Continue'}
// // // // //               <ArrowRight className="ml-2 h-4 w-4" />
// // // // //             </Button>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // Step 1: Date & Time Selection
// // // // // const DateTimeStep = () => {
// // // // //   const { bookingFlow, setBookingFlow } = useBookingStore();
// // // // //   const [selectedDate, setSelectedDate] = useState(bookingFlow.data.date || '');
// // // // //   const [partySize, setPartySize] = useState(bookingFlow.data.partySize || 1);

// // // // //   const handleDateChange = (date) => {
// // // // //     setSelectedDate(date);
// // // // //     setBookingFlow({ data: { date } });
// // // // //   };

// // // // //   const handlePartySizeChange = (size) => {
// // // // //     setPartySize(size);
// // // // //     setBookingFlow({ data: { partySize: parseInt(size) } });
// // // // //   };

// // // // //   // Generate next 30 days
// // // // //   const availableDates = Array.from({ length: 30 }, (_, i) => 
// // // // //     addDays(new Date(), i + 1)
// // // // //   );

// // // // //   return (
// // // // //     <div className="space-y-6">
// // // // //       <div>
// // // // //         <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
// // // // //           Select Date & Party Size
// // // // //         </h2>
// // // // //         <p className="text-gray-600 dark:text-gray-300">
// // // // //           Choose your preferred date and number of guests
// // // // //         </p>
// // // // //       </div>

// // // // //       <div className="grid md:grid-cols-2 gap-8">
// // // // //         {/* Date Selection */}
// // // // //         <div>
// // // // //           <label className="block text-sm font-medium text-gray-700 mb-4 dark:text-gray-300">
// // // // //             <Calendar className="inline mr-2 h-4 w-4" />
// // // // //             Select Date
// // // // //           </label>
// // // // //           <div className="grid grid-cols-2 gap-2">
// // // // //             {availableDates.slice(0, 12).map((date) => (
// // // // //               <button
// // // // //                 key={date.toISOString()}
// // // // //                 onClick={() => handleDateChange(format(date, 'yyyy-MM-dd'))}
// // // // //                 className={`
// // // // //                   p-3 text-sm rounded-lg border transition-colors
// // // // //                   ${selectedDate === format(date, 'yyyy-MM-dd')
// // // // //                     ? 'border-primary-600 bg-primary-50 text-primary-600'
// // // // //                     : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
// // // // //                   }
// // // // //                 `}
// // // // //               >
// // // // //                 <div className="font-semibold">{format(date, 'MMM d')}</div>
// // // // //                 <div className="text-xs opacity-70">{format(date, 'EEE')}</div>
// // // // //               </button>
// // // // //             ))}
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Party Size */}
// // // // //         <div>
// // // // //           <label className="block text-sm font-medium text-gray-700 mb-4 dark:text-gray-300">
// // // // //             <Users className="inline mr-2 h-4 w-4" />
// // // // //             Party Size
// // // // //           </label>
// // // // //           <div className="space-y-2">
// // // // //             {[1, 2, 3, 4, 5, 6].map((size) => (
// // // // //               <label key={size} className="flex items-center">
// // // // //                 <input
// // // // //                   type="radio"
// // // // //                   name="partySize"
// // // // //                   value={size}
// // // // //                   checked={partySize === size}
// // // // //                   onChange={(e) => handlePartySizeChange(e.target.value)}
// // // // //                   className="mr-3 text-primary-600 focus:ring-primary-500"
// // // // //                 />
// // // // //                 <span className="text-gray-700 dark:text-gray-300">
// // // // //                   {size} {size === 1 ? 'Guest' : 'Guests'}
// // // // //                 </span>
// // // // //               </label>
// // // // //             ))}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // Step 2: Guest Details
// // // // // const GuestDetailsStep = () => {
// // // // //   const { bookingFlow, setBookingFlow } = useBookingStore();
// // // // //   const [guestDetails, setGuestDetails] = useState(
// // // // //     bookingFlow.data.guestDetails || {
// // // // //       name: '',
// // // // //       email: '',
// // // // //       phone: '',
// // // // //       specialRequests: ''
// // // // //     }
// // // // //   );

// // // // //   const handleChange = (field, value) => {
// // // // //     const updated = { ...guestDetails, [field]: value };
// // // // //     setGuestDetails(updated);
// // // // //     setBookingFlow({ data: { guestDetails: updated } });
// // // // //   };

// // // // //   return (
// // // // //     <div className="space-y-6">
// // // // //       <div>
// // // // //         <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
// // // // //           Guest Information
// // // // //         </h2>
// // // // //         <p className="text-gray-600 dark:text-gray-300">
// // // // //           Please provide your contact details for the booking
// // // // //         </p>
// // // // //       </div>

// // // // //       <div className="grid md:grid-cols-2 gap-6">
// // // // //         <div>
// // // // //           <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
// // // // //             Full Name *
// // // // //           </label>
// // // // //           <input
// // // // //             type="text"
// // // // //             value={guestDetails.name}
// // // // //             onChange={(e) => handleChange('name', e.target.value)}
// // // // //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // // // //             placeholder="Enter your full name"
// // // // //             required
// // // // //           />
// // // // //         </div>

// // // // //         <div>
// // // // //           <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
// // // // //             Email Address *
// // // // //           </label>
// // // // //           <input
// // // // //             type="email"
// // // // //             value={guestDetails.email}
// // // // //             onChange={(e) => handleChange('email', e.target.value)}
// // // // //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // // // //             placeholder="your@email.com"
// // // // //             required
// // // // //           />
// // // // //         </div>

// // // // //         <div>
// // // // //           <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
// // // // //             Phone Number *
// // // // //           </label>
// // // // //           <input
// // // // //             type="tel"
// // // // //             value={guestDetails.phone}
// // // // //             onChange={(e) => handleChange('phone', e.target.value)}
// // // // //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // // // //             placeholder="+1 (555) 123-4567"
// // // // //             required
// // // // //           />
// // // // //         </div>

// // // // //         <div className="md:col-span-2">
// // // // //           <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
// // // // //             Special Requests (Optional)
// // // // //           </label>
// // // // //           <textarea
// // // // //             value={guestDetails.specialRequests}
// // // // //             onChange={(e) => handleChange('specialRequests', e.target.value)}
// // // // //             rows={3}
// // // // //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // // // //             placeholder="Any dietary restrictions, accessibility needs, or special occasions..."
// // // // //           />
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // Step 3: Payment
// // // // // const PaymentStep = ({ quote, onConfirm }) => {
// // // // //   const [paymentMethod, setPaymentMethod] = useState('card');
// // // // //   const [cardDetails, setCardDetails] = useState({
// // // // //     cardNumber: '',
// // // // //     expiryDate: '',
// // // // //     cvv: '',
// // // // //     cardholderName: ''
// // // // //   });

// // // // //   const handleCardChange = (field, value) => {
// // // // //     setCardDetails({ ...cardDetails, [field]: value });
// // // // //   };

// // // // //   const handlePayment = () => {
// // // // //     onConfirm({
// // // // //       method: paymentMethod,
// // // // //       cardDetails: paymentMethod === 'card' ? cardDetails : null
// // // // //     });
// // // // //   };

// // // // //   return (
// // // // //     <div className="space-y-6">
// // // // //       <div>
// // // // //         <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
// // // // //           Payment Information
// // // // //         </h2>
// // // // //         <p className="text-gray-600 dark:text-gray-300">
// // // // //           Complete your booking with secure payment
// // // // //         </p>
// // // // //       </div>

// // // // //       <div className="grid lg:grid-cols-2 gap-8">
// // // // //         {/* Payment Method */}
// // // // //         <div className="space-y-4">
// // // // //           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
// // // // //             Payment Method
// // // // //           </h3>
          
// // // // //           <div className="space-y-3">
// // // // //             <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 dark:border-gray-600">
// // // // //               <input
// // // // //                 type="radio"
// // // // //                 name="paymentMethod"
// // // // //                 value="card"
// // // // //                 checked={paymentMethod === 'card'}
// // // // //                 onChange={(e) => setPaymentMethod(e.target.value)}
// // // // //                 className="mr-3 text-primary-600"
// // // // //               />
// // // // //               <CreditCard className="mr-3 h-5 w-5 text-gray-400" />
// // // // //               <span className="font-medium">Credit/Debit Card</span>
// // // // //             </label>
            
// // // // //             <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 dark:border-gray-600">
// // // // //               <input
// // // // //                 type="radio"
// // // // //                 name="paymentMethod"
// // // // //                 value="upi"
// // // // //                 checked={paymentMethod === 'upi'}
// // // // //                 onChange={(e) => setPaymentMethod(e.target.value)}
// // // // //                 className="mr-3 text-primary-600"
// // // // //               />
// // // // //               <span className="mr-3 text-lg">📱</span>
// // // // //               <span className="font-medium">UPI Payment</span>
// // // // //             </label>
// // // // //           </div>

// // // // //           {/* Card Details */}
// // // // //           {paymentMethod === 'card' && (
// // // // //             <div className="space-y-4 mt-6">
// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
// // // // //                   Cardholder Name
// // // // //                 </label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={cardDetails.cardholderName}
// // // // //                   onChange={(e) => handleCardChange('cardholderName', e.target.value)}
// // // // //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // // // //                   placeholder="Name on card"
// // // // //                 />
// // // // //               </div>

// // // // //               <div>
// // // // //                 <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
// // // // //                   Card Number
// // // // //                 </label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={cardDetails.cardNumber}
// // // // //                   onChange={(e) => handleCardChange('cardNumber', e.target.value)}
// // // // //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // // // //                   placeholder="1234 5678 9012 3456"
// // // // //                 />
// // // // //               </div>

// // // // //               <div className="grid grid-cols-2 gap-4">
// // // // //                 <div>
// // // // //                   <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
// // // // //                     Expiry Date
// // // // //                   </label>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={cardDetails.expiryDate}
// // // // //                     onChange={(e) => handleCardChange('expiryDate', e.target.value)}
// // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // // // //                     placeholder="MM/YY"
// // // // //                   />
// // // // //                 </div>
// // // // //                 <div>
// // // // //                   <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
// // // // //                     CVV
// // // // //                   </label>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={cardDetails.cvv}
// // // // //                     onChange={(e) => handleCardChange('cvv', e.target.value)}
// // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // // // //                     placeholder="123"
// // // // //                   />
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Booking Summary */}
// // // // //         <div>
// // // // //           <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
// // // // //             Booking Summary
// // // // //           </h3>
          
// // // // //           <Card className="border-gray-200">
// // // // //             <CardContent className="p-4 space-y-3">
// // // // //               {quote && (
// // // // //                 <>
// // // // //                   <div className="flex justify-between">
// // // // //                     <span className="text-gray-600">Base Price:</span>
// // // // //                     <span>₹{quote.basePrice}</span>
// // // // //                   </div>
// // // // //                   <div className="flex justify-between">
// // // // //                     <span className="text-gray-600">Service Fee:</span>
// // // // //                     <span>₹{quote.fees}</span>
// // // // //                   </div>
// // // // //                   <div className="flex justify-between">
// // // // //                     <span className="text-gray-600">Taxes:</span>
// // // // //                     <span>₹{quote.taxes}</span>
// // // // //                   </div>
// // // // //                   <div className="border-t pt-3">
// // // // //                     <div className="flex justify-between font-semibold text-lg">
// // // // //                       <span>Total:</span>
// // // // //                       <span>₹{quote.total}</span>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </>
// // // // //               )}
// // // // //             </CardContent>
// // // // //           </Card>

// // // // //           <div className="mt-6 text-xs text-gray-500 space-y-1">
// // // // //             <p>• Free cancellation up to 24 hours before the experience</p>
// // // // //             <p>• Your booking is protected by our guarantee</p>
// // // // //             <p>• Secure payment processing</p>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // Step 4: Confirmation
// // // // // const ConfirmationStep = () => {
// // // // //   const navigate = useNavigate();

// // // // //   return (
// // // // //     <div className="text-center space-y-6">
// // // // //       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
// // // // //         <Check className="h-10 w-10 text-green-600" />
// // // // //       </div>
      
// // // // //       <div>
// // // // //         <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
// // // // //           Booking Confirmed!
// // // // //         </h2>
// // // // //         <p className="text-gray-600 dark:text-gray-300">
// // // // //           Your experience has been successfully booked. Check your email for confirmation details.
// // // // //         </p>
// // // // //       </div>

// // // // //       <div className="flex flex-col sm:flex-row gap-4 justify-center">
// // // // //         <Button variant="outline" onClick={() => navigate('/dashboard')}>
// // // // //           View Dashboard
// // // // //         </Button>
// // // // //         <Button onClick={() => navigate('/')}>
// // // // //           Book Another Experience
// // // // //         </Button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // Helper function to check if step is complete
// // // // // const isStepComplete = (step, data) => {
// // // // //   switch (step) {
// // // // //     case 1:
// // // // //       return data.date && data.partySize;
// // // // //     case 2:
// // // // //       return data.guestDetails?.name && data.guestDetails?.email && data.guestDetails?.phone;
// // // // //     case 3:
// // // // //       return true; // Payment validation handled separately
// // // // //     default:
// // // // //       return false;
// // // // //   }
// // // // // };

// // // // // export default BookingFlow;




// // // // // ===== frontend/src/pages/BookingFlow.jsx =====
// // // // import { useState, useEffect } from 'react';
// // // // import { useNavigate, useSearchParams } from 'react-router-dom';
// // // // import { ArrowLeft, ArrowRight, CheckCircle, CreditCard, Clock } from 'lucide-react';
// // // // import { useBookingStore } from '@/store/bookings';
// // // // import { Card, CardContent, CardHeader } from '@/components/ui/Card';
// // // // import Button from '@/components/ui/Button';
// // // // import toast from 'react-hot-toast';

// // // // const BookingFlow = () => {
// // // //   const navigate = useNavigate();
// // // //   const [searchParams] = useSearchParams();
// // // //   const {
// // // //     bookingFlow,
// // // //     setBookingFlow,
// // // //     nextStep,
// // // //     prevStep,
// // // //     resetBookingFlow,
// // // //     createQuote,
// // // //     holdBooking,
// // // //     confirmBooking
// // // //   } = useBookingStore();

// // // //   const [loading, setLoading] = useState(false);
// // // //   const [quote, setQuote] = useState(null);
// // // //   const [holdTimer, setHoldTimer] = useState(null);

// // // //   useEffect(() => {
// // // //     // Initialize booking flow from URL params
// // // //     const targetType = searchParams.get('targetType');
// // // //     const targetId = searchParams.get('targetId');
    
// // // //     if (targetType && targetId) {
// // // //       setBookingFlow({
// // // //         data: { targetType, targetId }
// // // //       });
// // // //     }

// // // //     return () => {
// // // //       resetBookingFlow();
// // // //     };
// // // //   }, [searchParams]);

// // // //   const handleNextStep = async () => {
// // // //     if (bookingFlow.step === 1) {
// // // //       await handleGetQuote();
// // // //     } else if (bookingFlow.step === 2) {
// // // //       await handleHoldBooking();
// // // //     } else if (bookingFlow.step === 3) {
// // // //       await handleConfirmBooking();
// // // //     } else {
// // // //       nextStep();
// // // //     }
// // // //   };

// // // //   const handleGetQuote = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const quoteData = await createQuote(bookingFlow.data);
// // // //       setQuote(quoteData);
// // // //       nextStep();
// // // //     } catch (error) {
// // // //       toast.error('Failed to get price quote');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleHoldBooking = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const booking = await holdBooking({
// // // //         ...bookingFlow.data,
// // // //         quote: quote
// // // //       });
      
// // // //       // Start countdown timer
// // // //       const expiresAt = new Date(booking.expiresAt);
// // // //       const timeLeft = expiresAt - new Date();
// // // //       setHoldTimer(Math.floor(timeLeft / 1000));
      
// // // //       nextStep();
// // // //     } catch (error) {
// // // //       toast.error('Failed to hold booking');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleConfirmBooking = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const booking = await confirmBooking(bookingFlow.data.bookingId, {
// // // //         paymentMethod: bookingFlow.data.paymentMethod,
// // // //         paymentDetails: bookingFlow.data.paymentDetails
// // // //       });
      
// // // //       nextStep();
// // // //       toast.success('Booking confirmed successfully!');
// // // //     } catch (error) {
// // // //       toast.error('Payment failed. Please try again.');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const renderStepContent = () => {
// // // //     switch (bookingFlow.step) {
// // // //       case 1:
// // // //         return <DateTimeSelection />;
// // // //       case 2:
// // // //         return <GuestDetails quote={quote} />;
// // // //       case 3:
// // // //         return <PaymentDetails holdTimer={holdTimer} />;
// // // //       case 4:
// // // //         return <BookingConfirmation />;
// // // //       default:
// // // //         return null;
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50 py-8">
// // // //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
// // // //         {/* Header */}
// // // //         <div className="mb-8">
// // // //           <button
// // // //             onClick={() => navigate(-1)}
// // // //             className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
// // // //           >
// // // //             <ArrowLeft className="h-4 w-4 mr-2" />
// // // //             Back
// // // //           </button>
          
// // // //           {/* Progress Steps */}
// // // //           <div className="flex items-center justify-between mb-6">
// // // //             {[1, 2, 3, 4].map((step) => (
// // // //               <div key={step} className="flex items-center">
// // // //                 <div className={`
// // // //                   w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
// // // //                   ${step <= bookingFlow.step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}
// // // //                 `}>
// // // //                   {step < bookingFlow.step ? (
// // // //                     <CheckCircle className="h-5 w-5" />
// // // //                   ) : (
// // // //                     step
// // // //                   )}
// // // //                 </div>
// // // //                 {step < 4 && (
// // // //                   <div className={`
// // // //                     flex-1 h-0.5 mx-4
// // // //                     ${step < bookingFlow.step ? 'bg-primary-600' : 'bg-gray-200'}
// // // //                   `} />
// // // //                 )}
// // // //               </div>
// // // //             ))}
// // // //           </div>
          
// // // //           {/* Step Labels */}
// // // //           <div className="flex justify-between text-xs text-gray-600">
// // // //             <span>Date & Time</span>
// // // //             <span>Guest Details</span>
// // // //             <span>Payment</span>
// // // //             <span>Confirmation</span>
// // // //           </div>
// // // //         </div>

// // // //         {/* Step Content */}
// // // //         <div className="space-y-6">
// // // //           {renderStepContent()}
          
// // // //           {/* Navigation Buttons */}
// // // //           {bookingFlow.step < 4 && (
// // // //             <div className="flex justify-between pt-6">
// // // //               <Button
// // // //                 variant="outline"
// // // //                 onClick={prevStep}
// // // //                 disabled={bookingFlow.step === 1}
// // // //               >
// // // //                 Previous
// // // //               </Button>
// // // //               <Button
// // // //                 onClick={handleNextStep}
// // // //                 loading={loading}
// // // //               >
// // // //                 {bookingFlow.step === 3 ? 'Confirm & Pay' : 'Continue'}
// // // //                 <ArrowRight className="ml-2 h-4 w-4" />
// // // //               </Button>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // Step 1: Date & Time Selection
// // // // const DateTimeSelection = () => {
// // // //   const { bookingFlow, setBookingFlow } = useBookingStore();
  
// // // //   return (
// // // //     <Card>
// // // //       <CardHeader>
// // // //         <h2 className="text-xl font-semibold">Select Date & Time</h2>
// // // //       </CardHeader>
// // // //       <CardContent className="space-y-6">
// // // //         <div className="grid md:grid-cols-2 gap-6">
// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //               Date
// // // //             </label>
// // // //             <input
// // // //               type="date"
// // // //               value={bookingFlow.data.date || ''}
// // // //               onChange={(e) => setBookingFlow({
// // // //                 data: { date: e.target.value }
// // // //               })}
// // // //               min={new Date().toISOString().split('T')[0]}
// // // //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //             />
// // // //           </div>
          
// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //               Time (optional)
// // // //             </label>
// // // //             <select
// // // //               value={bookingFlow.data.time || ''}
// // // //               onChange={(e) => setBookingFlow({
// // // //                 data: { time: e.target.value }
// // // //               })}
// // // //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //             >
// // // //               <option value="">Flexible timing</option>
// // // //               <option value="09:00">9:00 AM</option>
// // // //               <option value="10:00">10:00 AM</option>
// // // //               <option value="11:00">11:00 AM</option>
// // // //               <option value="14:00">2:00 PM</option>
// // // //               <option value="15:00">3:00 PM</option>
// // // //               <option value="16:00">4:00 PM</option>
// // // //             </select>
// // // //           </div>
// // // //         </div>
        
// // // //         <div>
// // // //           <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //             Party Size
// // // //           </label>
// // // //           <select
// // // //             value={bookingFlow.data.partySize || 1}
// // // //             onChange={(e) => setBookingFlow({
// // // //               data: { partySize: parseInt(e.target.value) }
// // // //             })}
// // // //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //           >
// // // //             {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
// // // //               <option key={size} value={size}>
// // // //                 {size} {size === 1 ? 'person' : 'people'}
// // // //               </option>
// // // //             ))}
// // // //           </select>
// // // //         </div>
// // // //       </CardContent>
// // // //     </Card>
// // // //   );
// // // // };

// // // // // Step 2: Guest Details
// // // // const GuestDetails = ({ quote }) => {
// // // //   const { bookingFlow, setBookingFlow } = useBookingStore();
  
// // // //   return (
// // // //     <div className="space-y-6">
// // // //       <Card>
// // // //         <CardHeader>
// // // //           <h2 className="text-xl font-semibold">Guest Information</h2>
// // // //         </CardHeader>
// // // //         <CardContent className="space-y-4">
// // // //           <div className="grid md:grid-cols-2 gap-4">
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Full Name *
// // // //               </label>
// // // //               <input
// // // //                 type="text"
// // // //                 value={bookingFlow.data.guestDetails?.name || ''}
// // // //                 onChange={(e) => setBookingFlow({
// // // //                   data: {
// // // //                     guestDetails: {
// // // //                       ...bookingFlow.data.guestDetails,
// // // //                       name: e.target.value
// // // //                     }
// // // //                   }
// // // //                 })}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //                 placeholder="Enter your full name"
// // // //               />
// // // //             </div>
            
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                 Email *
// // // //               </label>
// // // //               <input
// // // //                 type="email"
// // // //                 value={bookingFlow.data.guestDetails?.email || ''}
// // // //                 onChange={(e) => setBookingFlow({
// // // //                   data: {
// // // //                     guestDetails: {
// // // //                       ...bookingFlow.data.guestDetails,
// // // //                       email: e.target.value
// // // //                     }
// // // //                   }
// // // //                 })}
// // // //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //                 placeholder="Enter your email"
// // // //               />
// // // //             </div>
// // // //           </div>
          
// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //               Phone Number *
// // // //             </label>
// // // //             <input
// // // //               type="tel"
// // // //               value={bookingFlow.data.guestDetails?.phone || ''}
// // // //               onChange={(e) => setBookingFlow({
// // // //                 data: {
// // // //                   guestDetails: {
// // // //                     ...bookingFlow.data.guestDetails,
// // // //                     phone: e.target.value
// // // //                   }
// // // //                 }
// // // //               })}
// // // //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //               placeholder="Enter your phone number"
// // // //             />
// // // //           </div>
          
// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //               Special Requirements (Optional)
// // // //             </label>
// // // //             <textarea
// // // //               value={bookingFlow.data.guestDetails?.specialRequests || ''}
// // // //               onChange={(e) => setBookingFlow({
// // // //                 data: {
// // // //                   guestDetails: {
// // // //                     ...bookingFlow.data.guestDetails,
// // // //                     specialRequests: e.target.value
// // // //                   }
// // // //                 }
// // // //               })}
// // // //               rows="3"
// // // //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //               placeholder="Any dietary restrictions, accessibility needs, etc."
// // // //             />
// // // //           </div>
// // // //         </CardContent>
// // // //       </Card>
      
// // // //       {/* Price Summary */}
// // // //       {quote && (
// // // //         <Card>
// // // //           <CardHeader>
// // // //             <h3 className="text-lg font-semibold">Price Summary</h3>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <div className="space-y-2">
// // // //               <div className="flex justify-between">
// // // //                 <span>Base Price</span>
// // // //                 <span>₹{quote.basePrice}</span>
// // // //               </div>
// // // //               {quote.fees > 0 && (
// // // //                 <div className="flex justify-between">
// // // //                   <span>Service Fee</span>
// // // //                   <span>₹{quote.fees}</span>
// // // //                 </div>
// // // //               )}
// // // //               {quote.taxes > 0 && (
// // // //                 <div className="flex justify-between">
// // // //                   <span>Taxes</span>
// // // //                   <span>₹{quote.taxes}</span>
// // // //                 </div>
// // // //               )}
// // // //               <hr />
// // // //               <div className="flex justify-between text-lg font-semibold">
// // // //                 <span>Total</span>
// // // //                 <span>₹{quote.total}</span>
// // // //               </div>
// // // //             </div>
// // // //           </CardContent>
// // // //         </Card>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // // Step 3: Payment Details
// // // // const PaymentDetails = ({ holdTimer }) => {
// // // //   const { bookingFlow, setBookingFlow } = useBookingStore();
// // // //   const [timeLeft, setTimeLeft] = useState(holdTimer);

// // // //   useEffect(() => {
// // // //     if (timeLeft > 0) {
// // // //       const timer = setTimeout(() => {
// // // //         setTimeLeft(timeLeft - 1);
// // // //       }, 1000);
// // // //       return () => clearTimeout(timer);
// // // //     }
// // // //   }, [timeLeft]);

// // // //   const formatTime = (seconds) => {
// // // //     const mins = Math.floor(seconds / 60);
// // // //     const secs = seconds % 60;
// // // //     return `${mins}:${secs.toString().padStart(2, '0')}`;
// // // //   };

// // // //   return (
// // // //     <div className="space-y-6">
// // // //       {/* Timer */}
// // // //       {timeLeft > 0 && (
// // // //         <Card className="border-orange-200 bg-orange-50">
// // // //           <CardContent className="p-4">
// // // //             <div className="flex items-center text-orange-800">
// // // //               <Clock className="h-4 w-4 mr-2" />
// // // //               <span className="text-sm font-medium">
// // // //                 Your booking is held for {formatTime(timeLeft)}
// // // //               </span>
// // // //             </div>
// // // //           </CardContent>
// // // //         </Card>
// // // //       )}

// // // //       <Card>
// // // //         <CardHeader>
// // // //           <h2 className="text-xl font-semibold">Payment Method</h2>
// // // //         </CardHeader>
// // // //         <CardContent className="space-y-4">
// // // //           {/* Payment Method Selection */}
// // // //           <div className="space-y-3">
// // // //             <div className="flex items-center">
// // // //               <input
// // // //                 id="card"
// // // //                 name="paymentMethod"
// // // //                 type="radio"
// // // //                 checked={bookingFlow.data.paymentMethod === 'card'}
// // // //                 onChange={() => setBookingFlow({
// // // //                   data: { paymentMethod: 'card' }
// // // //                 })}
// // // //                 className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
// // // //               />
// // // //               <label htmlFor="card" className="ml-3 flex items-center">
// // // //                 <CreditCard className="h-5 w-5 mr-2" />
// // // //                 Credit/Debit Card
// // // //               </label>
// // // //             </div>
            
// // // //             <div className="flex items-center">
// // // //               <input
// // // //                 id="upi"
// // // //                 name="paymentMethod"
// // // //                 type="radio"
// // // //                 checked={bookingFlow.data.paymentMethod === 'upi'}
// // // //                 onChange={() => setBookingFlow({
// // // //                   data: { paymentMethod: 'upi' }
// // // //                 })}
// // // //                 className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
// // // //               />
// // // //               <label htmlFor="upi" className="ml-3">
// // // //                 UPI Payment
// // // //               </label>
// // // //             </div>
// // // //           </div>

// // // //           {/* Card Details */}
// // // //           {bookingFlow.data.paymentMethod === 'card' && (
// // // //             <div className="space-y-4 pt-4 border-t">
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                   Card Number
// // // //                 </label>
// // // //                 <input
// // // //                   type="text"
// // // //                   placeholder="1234 5678 9012 3456"
// // // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //                 />
// // // //               </div>
              
// // // //               <div className="grid grid-cols-2 gap-4">
// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                     Expiry Date
// // // //                   </label>
// // // //                   <input
// // // //                     type="text"
// // // //                     placeholder="MM/YY"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //                   />
// // // //                 </div>
                
// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                     CVV
// // // //                   </label>
// // // //                   <input
// // // //                     type="text"
// // // //                     placeholder="123"
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //                   />
// // // //                 </div>
// // // //               </div>
              
// // // //               <div>
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                   Cardholder Name
// // // //                 </label>
// // // //                 <input
// // // //                   type="text"
// // // //                   placeholder="John Doe"
// // // //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </CardContent>
// // // //       </Card>
// // // //     </div>
// // // //   );
// // // // };

// // // // // Step 4: Booking Confirmation
// // // // const BookingConfirmation = () => {
// // // //   const navigate = useNavigate();
  
// // // //   return (
// // // //     <div className="text-center space-y-6">
// // // //       <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
// // // //         <CheckCircle className="h-8 w-8 text-white" />
// // // //       </div>
      
// // // //       <div>
// // // //         <h2 className="text-2xl font-bold text-gray-900 mb-2">
// // // //           Booking Confirmed!
// // // //         </h2>
// // // //         <p className="text-gray-600">
// // // //           Your booking has been successfully confirmed. You'll receive a confirmation email shortly.
// // // //         </p>
// // // //       </div>
      
// // // //       <Card>
// // // //         <CardHeader>
// // // //           <h3 className="text-lg font-semibold">What's Next?</h3>
// // // //         </CardHeader>
// // // //         <CardContent className="space-y-3 text-left">
// // // //           <div className="flex items-start space-x-3">
// // // //             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
// // // //               1
// // // //             </div>
// // // //             <div>
// // // //               <p className="font-medium">Check your email</p>
// // // //               <p className="text-sm text-gray-600">
// // // //                 We've sent you a confirmation email with all the details
// // // //               </p>
// // // //             </div>
// // // //           </div>
          
// // // //           <div className="flex items-start space-x-3">
// // // //             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
// // // //               2
// // // //             </div>
// // // //             <div>
// // // //               <p className="font-medium">Your guide will contact you</p>
// // // //               <p className="text-sm text-gray-600">
// // // //                 They'll reach out 24-48 hours before your experience
// // // //               </p>
// // // //             </div>
// // // //           </div>
          
// // // //           <div className="flex items-start space-x-3">
// // // //             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
// // // //               3
// // // //             </div>
// // // //             <div>
// // // //               <p className="font-medium">Enjoy your experience!</p>
// // // //               <p className="text-sm text-gray-600">
// // // //                 Meet your guide at the specified location and time
// // // //               </p>
// // // //             </div>
// // // //           </div>
// // // //         </CardContent>
// // // //       </Card>
      
// // // //       <div className="flex flex-col sm:flex-row gap-4 justify-center">
// // // //         <Button
// // // //           variant="outline"
// // // //           onClick={() => navigate('/dashboard/traveller')}
// // // //         >
// // // //           View My Bookings
// // // //         </Button>
// // // //         <Button onClick={() => navigate('/')}>
// // // //           Back to Home
// // // //         </Button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default BookingFlow;


// // // import { useState, useEffect, useCallback } from 'react';
// // // import { useNavigate, useSearchParams } from 'react-router-dom';
// // // import { 
// // //   ArrowLeft, 
// // //   ArrowRight, 
// // //   CheckCircle, 
// // //   CreditCard, 
// // //   Clock, 
// // //   Calendar,
// // //   Users,
// // //   MapPin,
// // //   Star,
// // //   Shield,
// // //   AlertCircle,
// // //   Check,
// // //   X
// // // } from 'lucide-react';
// // // import { useBookingStore } from '@/store/bookings';
// // // import { Card, CardContent, CardHeader } from '@/components/ui/Card';
// // // import Button from '@/components/ui/Button';
// // // import toast from 'react-hot-toast';

// // // const BOOKING_STEPS = [
// // //   { id: 1, name: 'Details', description: 'Select date and guests' },
// // //   { id: 2, name: 'Information', description: 'Guest details' },
// // //   { id: 3, name: 'Payment', description: 'Secure checkout' },
// // //   { id: 4, name: 'Confirmation', description: 'Booking confirmed' }
// // // ];

// // // const BookingFlow = () => {
// // //   const navigate = useNavigate();
// // //   const [searchParams] = useSearchParams();
// // //   const {
// // //     bookingFlow,
// // //     setBookingFlow,
// // //     nextStep,
// // //     prevStep,
// // //     resetBookingFlow,
// // //     createQuote,
// // //     holdBooking,
// // //     confirmBooking
// // //   } = useBookingStore();

// // //   const [loading, setLoading] = useState(false);
// // //   const [quote, setQuote] = useState(null);
// // //   const [holdTimer, setHoldTimer] = useState(null);
// // //   const [errors, setErrors] = useState({});

// // //   // Initialize booking flow
// // //   useEffect(() => {
// // //     const targetType = searchParams.get('type');
// // //     const targetId = searchParams.get('id');
    
// // //     if (!targetType || !targetId) {
// // //       toast.error('Invalid booking parameters');
// // //       navigate('/search');
// // //       return;
// // //     }

// // //     setBookingFlow({
// // //       data: { 
// // //         targetType, 
// // //         targetId,
// // //         date: '',
// // //         time: '',
// // //         partySize: 1,
// // //         guestDetails: {
// // //           name: '',
// // //           email: '',
// // //           phone: '',
// // //           specialRequests: ''
// // //         },
// // //         paymentMethod: 'card'
// // //       }
// // //     });

// // //     return () => resetBookingFlow();
// // //   }, [searchParams, setBookingFlow, navigate, resetBookingFlow]);

// // //   // Hold timer countdown
// // //   useEffect(() => {
// // //     if (holdTimer && holdTimer > 0) {
// // //       const interval = setInterval(() => {
// // //         setHoldTimer(prev => {
// // //           if (prev <= 1) {
// // //             toast.error('Booking hold expired. Please start over.');
// // //             navigate('/search');
// // //             return 0;
// // //           }
// // //           return prev - 1;
// // //         });
// // //       }, 1000);

// // //       return () => clearInterval(interval);
// // //     }
// // //   }, [holdTimer, navigate]);

// // //   // Validation functions
// // //   const validateStep = useCallback((step, data) => {
// // //     const newErrors = {};

// // //     switch (step) {
// // //       case 1:
// // //         if (!data.date) newErrors.date = 'Please select a date';
// // //         if (!data.partySize || data.partySize < 1) newErrors.partySize = 'Please select number of guests';
// // //         break;
      
// // //       case 2:
// // //         if (!data.guestDetails?.name?.trim()) newErrors.name = 'Name is required';
// // //         if (!data.guestDetails?.email?.trim()) newErrors.email = 'Email is required';
// // //         else if (!/\S+@\S+\.\S+/.test(data.guestDetails.email)) newErrors.email = 'Invalid email format';
// // //         if (!data.guestDetails?.phone?.trim()) newErrors.phone = 'Phone number is required';
// // //         else if (!/^\+?[\d\s-()]+$/.test(data.guestDetails.phone)) newErrors.phone = 'Invalid phone format';
// // //         break;
      
// // //       case 3:
// // //         if (!data.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
// // //         break;
// // //     }

// // //     setErrors(newErrors);
// // //     return Object.keys(newErrors).length === 0;
// // //   }, []);

// // //   // Step handlers
// // //   const handleNextStep = async () => {
// // //     if (!validateStep(bookingFlow.step, bookingFlow.data)) {
// // //       toast.error('Please fill in all required fields');
// // //       return;
// // //     }

// // //     setLoading(true);
    
// // //     try {
// // //       if (bookingFlow.step === 1) {
// // //         const quoteData = await createQuote(bookingFlow.data);
// // //         setQuote(quoteData);
// // //         nextStep();
// // //       } else if (bookingFlow.step === 2) {
// // //         const booking = await holdBooking({
// // //           ...bookingFlow.data,
// // //           quote
// // //         });
// // //         setHoldTimer(Math.floor((new Date(booking.expiresAt) - new Date()) / 1000));
// // //         nextStep();
// // //       } else if (bookingFlow.step === 3) {
// // //         await handleConfirmBooking();
// // //       } else {
// // //         nextStep();
// // //       }
// // //     } catch (error) {
// // //       toast.error(error.message || 'Something went wrong. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleConfirmBooking = async () => {
// // //     try {
// // //       const booking = await confirmBooking(bookingFlow.data.bookingId, {
// // //         paymentMethod: bookingFlow.data.paymentMethod,
// // //         paymentDetails: bookingFlow.data.paymentDetails
// // //       });
      
// // //       nextStep();
// // //       toast.success('Booking confirmed successfully!');
// // //     } catch (error) {
// // //       throw error;
// // //     }
// // //   };

// // //   const handlePreviousStep = () => {
// // //     if (bookingFlow.step === 1) {
// // //       navigate(-1);
// // //     } else {
// // //       prevStep();
// // //     }
// // //   };

// // //   const formatTime = (seconds) => {
// // //     const mins = Math.floor(seconds / 60);
// // //     const secs = seconds % 60;
// // //     return `${mins}:${secs.toString().padStart(2, '0')}`;
// // //   };

// // //   const renderStepContent = () => {
// // //     switch (bookingFlow.step) {
// // //       case 1:
// // //         return <BookingDetailsStep errors={errors} />;
// // //       case 2:
// // //         return <GuestInformationStep errors={errors} quote={quote} />;
// // //       case 3:
// // //         return <PaymentStep errors={errors} holdTimer={holdTimer} quote={quote} />;
// // //       case 4:
// // //         return <ConfirmationStep />;
// // //       default:
// // //         return null;
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
// // //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // //         {/* Header */}
// // //         <div className="mb-8">
// // //           <button
// // //             onClick={() => navigate(-1)}
// // //             className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
// // //             aria-label="Go back"
// // //           >
// // //             <ArrowLeft className="h-4 w-4 mr-2" />
// // //             Back to search
// // //           </button>
          
// // //           {/* Progress Steps */}
// // //           <div className="mb-8">
// // //             <div className="flex items-center justify-between">
// // //               {BOOKING_STEPS.map((step, index) => (
// // //                 <div key={step.id} className="flex items-center">
// // //                   <div className={`
// // //                     relative flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all
// // //                     ${step.id < bookingFlow.step 
// // //                       ? 'bg-green-500 text-white' 
// // //                       : step.id === bookingFlow.step
// // //                       ? 'bg-primary-600 text-white'
// // //                       : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
// // //                     }
// // //                   `}>
// // //                     {step.id < bookingFlow.step ? (
// // //                       <CheckCircle className="h-5 w-5" />
// // //                     ) : (
// // //                       step.id
// // //                     )}
// // //                   </div>
                  
// // //                   {index < BOOKING_STEPS.length - 1 && (
// // //                     <div className={`
// // //                       flex-1 h-0.5 mx-4 transition-colors
// // //                       ${step.id < bookingFlow.step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
// // //                     `} />
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>
            
// // //             <div className="flex justify-between mt-4">
// // //               {BOOKING_STEPS.map(step => (
// // //                 <div key={step.id} className="text-center">
// // //                   <div className="font-medium text-sm text-gray-900 dark:text-white">
// // //                     {step.name}
// // //                   </div>
// // //                   <div className="text-xs text-gray-500 dark:text-gray-400">
// // //                     {step.description}
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Step Content */}
// // //         <div className="space-y-6">
// // //           {renderStepContent()}
          
// // //           {/* Navigation Buttons */}
// // //           {bookingFlow.step < 4 && (
// // //             <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
// // //               <Button
// // //                 variant="outline"
// // //                 onClick={handlePreviousStep}
// // //                 className="flex items-center"
// // //               >
// // //                 <ArrowLeft className="h-4 w-4 mr-2" />
// // //                 {bookingFlow.step === 1 ? 'Back to search' : 'Previous'}
// // //               </Button>
              
// // //               <Button
// // //                 onClick={handleNextStep}
// // //                 loading={loading}
// // //                 disabled={loading}
// // //                 className="flex items-center"
// // //               >
// // //                 {bookingFlow.step === 3 ? 'Complete Booking' : 'Continue'}
// // //                 {bookingFlow.step < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
// // //               </Button>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Step 1: Booking Details
// // // const BookingDetailsStep = ({ errors }) => {
// // //   const { bookingFlow, setBookingFlow } = useBookingStore();
  
// // //   const today = new Date();
// // //   const maxDate = new Date();
// // //   maxDate.setFullYear(today.getFullYear() + 1);

// // //   return (
// // //     <Card>
// // //       <CardHeader>
// // //         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
// // //           Select Date & Guests
// // //         </h2>
// // //         <p className="text-gray-600 dark:text-gray-400">
// // //           Choose your preferred date and number of guests
// // //         </p>
// // //       </CardHeader>
// // //       <CardContent className="space-y-6">
// // //         <div className="grid md:grid-cols-2 gap-6">
// // //           <div>
// // //             <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// // //               <Calendar className="inline h-4 w-4 mr-2" />
// // //               Date *
// // //             </label>
// // //             <input
// // //               id="date"
// // //               type="date"
// // //               value={bookingFlow.data.date || ''}
// // //               onChange={(e) => setBookingFlow({
// // //                 data: { date: e.target.value }
// // //               })}
// // //               min={today.toISOString().split('T')[0]}
// // //               max={maxDate.toISOString().split('T')[0]}
// // //               className={`
// // //                 w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// // //                 dark:bg-gray-800 dark:border-gray-600 dark:text-white
// // //                 ${errors.date ? 'border-red-500' : 'border-gray-300'}
// // //               `}
// // //               required
// // //             />
// // //             {errors.date && (
// // //               <p className="mt-1 text-sm text-red-600 flex items-center">
// // //                 <AlertCircle className="h-4 w-4 mr-1" />
// // //                 {errors.date}
// // //               </p>
// // //             )}
// // //           </div>
          
// // //           <div>
// // //             <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// // //               <Clock className="inline h-4 w-4 mr-2" />
// // //               Preferred Time (Optional)
// // //             </label>
// // //             <select
// // //               id="time"
// // //               value={bookingFlow.data.time || ''}
// // //               onChange={(e) => setBookingFlow({
// // //                 data: { time: e.target.value }
// // //               })}
// // //               className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // //             >
// // //               <option value="">Flexible timing</option>
// // //               <option value="09:00">9:00 AM</option>
// // //               <option value="10:00">10:00 AM</option>
// // //               <option value="11:00">11:00 AM</option>
// // //               <option value="12:00">12:00 PM</option>
// // //               <option value="14:00">2:00 PM</option>
// // //               <option value="15:00">3:00 PM</option>
// // //               <option value="16:00">4:00 PM</option>
// // //               <option value="17:00">5:00 PM</option>
// // //             </select>
// // //           </div>
// // //         </div>
        
// // //         <div>
// // //           <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// // //             <Users className="inline h-4 w-4 mr-2" />
// // //             Number of Guests *
// // //           </label>
// // //           <select
// // //             id="partySize"
// // //             value={bookingFlow.data.partySize || 1}
// // //             onChange={(e) => setBookingFlow({
// // //               data: { partySize: parseInt(e.target.value) }
// // //             })}
// // //             className={`
// // //               w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// // //               dark:bg-gray-800 dark:border-gray-600 dark:text-white
// // //               ${errors.partySize ? 'border-red-500' : 'border-gray-300'}
// // //             `}
// // //             required
// // //           >
// // //             {Array.from({ length: 15 }, (_, i) => i + 1).map(size => (
// // //               <option key={size} value={size}>
// // //                 {size} {size === 1 ? 'guest' : 'guests'}
// // //               </option>
// // //             ))}
// // //           </select>
// // //           {errors.partySize && (
// // //             <p className="mt-1 text-sm text-red-600 flex items-center">
// // //               <AlertCircle className="h-4 w-4 mr-1" />
// // //               {errors.partySize}
// // //             </p>
// // //           )}
// // //         </div>

// // //         {/* Important Information */}
// // //         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
// // //           <div className="flex items-start">
// // //             <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
// // //             <div className="text-sm text-blue-800 dark:text-blue-300">
// // //               <p className="font-medium mb-1">Good to know:</p>
// // //               <ul className="list-disc list-inside space-y-1">
// // //                 <li>Free cancellation up to 24 hours before the experience</li>
// // //                 <li>Instant confirmation upon booking</li>
// // //                 <li>Mobile ticket accepted</li>
// // //               </ul>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // // Step 2: Guest Information
// // // const GuestInformationStep = ({ errors, quote }) => {
// // //   const { bookingFlow, setBookingFlow } = useBookingStore();

// // //   const updateGuestDetails = (field, value) => {
// // //     setBookingFlow({
// // //       data: {
// // //         guestDetails: {
// // //           ...bookingFlow.data.guestDetails,
// // //           [field]: value
// // //         }
// // //       }
// // //     });
// // //   };

// // //   return (
// // //     <div className="space-y-6">
// // //       <Card>
// // //         <CardHeader>
// // //           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
// // //             Guest Information
// // //           </h2>
// // //           <p className="text-gray-600 dark:text-gray-400">
// // //             Please provide contact details for the booking
// // //           </p>
// // //         </CardHeader>
// // //         <CardContent className="space-y-4">
// // //           <div className="grid md:grid-cols-2 gap-4">
// // //             <div>
// // //               <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// // //                 Full Name *
// // //               </label>
// // //               <input
// // //                 id="name"
// // //                 type="text"
// // //                 value={bookingFlow.data.guestDetails?.name || ''}
// // //                 onChange={(e) => updateGuestDetails('name', e.target.value)}
// // //                 className={`
// // //                   w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// // //                   dark:bg-gray-800 dark:border-gray-600 dark:text-white
// // //                   ${errors.name ? 'border-red-500' : 'border-gray-300'}
// // //                 `}
// // //                 placeholder="Enter your full name"
// // //                 required
// // //               />
// // //               {errors.name && (
// // //                 <p className="mt-1 text-sm text-red-600 flex items-center">
// // //                   <AlertCircle className="h-4 w-4 mr-1" />
// // //                   {errors.name}
// // //                 </p>
// // //               )}
// // //             </div>
            
// // //             <div>
// // //               <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// // //                 Email Address *
// // //               </label>
// // //               <input
// // //                 id="email"
// // //                 type="email"
// // //                 value={bookingFlow.data.guestDetails?.email || ''}
// // //                 onChange={(e) => updateGuestDetails('email', e.target.value)}
// // //                 className={`
// // //                   w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// // //                   dark:bg-gray-800 dark:border-gray-600 dark:text-white
// // //                   ${errors.email ? 'border-red-500' : 'border-gray-300'}
// // //                 `}
// // //                 placeholder="Enter your email address"
// // //                 required
// // //               />
// // //               {errors.email && (
// // //                 <p className="mt-1 text-sm text-red-600 flex items-center">
// // //                   <AlertCircle className="h-4 w-4 mr-1" />
// // //                   {errors.email}
// // //                 </p>
// // //               )}
// // //             </div>
// // //           </div>
          
// // //           <div>
// // //             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// // //               Phone Number *
// // //             </label>
// // //             <input
// // //               id="phone"
// // //               type="tel"
// // //               value={bookingFlow.data.guestDetails?.phone || ''}
// // //               onChange={(e) => updateGuestDetails('phone', e.target.value)}
// // //               className={`
// // //                 w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// // //                 dark:bg-gray-800 dark:border-gray-600 dark:text-white
// // //                 ${errors.phone ? 'border-red-500' : 'border-gray-300'}
// // //               `}
// // //               placeholder="Enter your phone number"
// // //               required
// // //             />
// // //             {errors.phone && (
// // //               <p className="mt-1 text-sm text-red-600 flex items-center">
// // //                 <AlertCircle className="h-4 w-4 mr-1" />
// // //                 {errors.phone}
// // //               </p>
// // //             )}
// // //           </div>
          
// // //           <div>
// // //             <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// // //               Special Requirements (Optional)
// // //             </label>
// // //             <textarea
// // //               id="specialRequests"
// // //               value={bookingFlow.data.guestDetails?.specialRequests || ''}
// // //               onChange={(e) => updateGuestDetails('specialRequests', e.target.value)}
// // //               rows="3"
// // //               className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// // //               placeholder="Any dietary restrictions, accessibility needs, special occasions..."
// // //             />
// // //           </div>
// // //         </CardContent>
// // //       </Card>
      
// // //       {/* Price Summary */}
// // //       {quote && <PriceSummary quote={quote} />}
// // //     </div>
// // //   );
// // // };

// // // // Step 3: Payment
// // // const PaymentStep = ({ errors, holdTimer, quote }) => {
// // //   const { bookingFlow, setBookingFlow } = useBookingStore();

// // //   const formatTime = (seconds) => {
// // //     const mins = Math.floor(seconds / 60);
// // //     const secs = seconds % 60;
// // //     return `${mins}:${secs.toString().padStart(2, '0')}`;
// // //   };

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Hold Timer */}
// // //       {holdTimer && holdTimer > 0 && (
// // //         <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
// // //           <CardContent className="p-4">
// // //             <div className="flex items-center text-amber-800 dark:text-amber-300">
// // //               <Clock className="h-5 w-5 mr-3 flex-shrink-0" />
// // //               <div>
// // //                 <div className="font-medium">Booking Reserved</div>
// // //                 <div className="text-sm">
// // //                   Your booking is held for {formatTime(holdTimer)}. Complete payment to confirm.
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       )}

// // //       <Card>
// // //         <CardHeader>
// // //           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
// // //             Payment Information
// // //           </h2>
// // //           <p className="text-gray-600 dark:text-gray-400">
// // //             Secure payment powered by industry-standard encryption
// // //           </p>
// // //         </CardHeader>
// // //         <CardContent className="space-y-6">
// // //           {/* Payment Methods */}
// // //           <div>
// // //             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
// // //               Choose Payment Method
// // //             </h3>
            
// // //             <div className="space-y-3">
// // //               <label className={`
// // //                 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors
// // //                 ${bookingFlow.data.paymentMethod === 'card' 
// // //                   ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
// // //                   : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
// // //                 }
// // //               `}>
// // //                 <input
// // //                   type="radio"
// // //                   name="paymentMethod"
// // //                   value="card"
// // //                   checked={bookingFlow.data.paymentMethod === 'card'}
// // //                   onChange={(e) => setBookingFlow({
// // //                     data: { paymentMethod: e.target.value }
// // //                   })}
// // //                   className="sr-only"
// // //                 />
// // //                 <div className="flex items-center flex-1">
// // //                   <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
// // //                   <div className="flex-1">
// // //                     <div className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</div>
// // //                     <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
// // //                   </div>
// // //                   <div className={`
// // //                     w-4 h-4 rounded-full border-2 flex items-center justify-center
// // //                     ${bookingFlow.data.paymentMethod === 'card' 
// // //                       ? 'border-primary-600' 
// // //                       : 'border-gray-300'
// // //                     }
// // //                   `}>
// // //                     {bookingFlow.data.paymentMethod === 'card' && (
// // //                       <div className="w-2 h-2 bg-primary-600 rounded-full" />
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               </label>
              
// // //               <label className={`
// // //                 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors
// // //                 ${bookingFlow.data.paymentMethod === 'upi' 
// // //                   ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
// // //                   : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
// // //                 }
// // //               `}>
// // //                 <input
// // //                   type="radio"
// // //                   name="paymentMethod"
// // //                   value="upi"
// // //                   checked={bookingFlow.data.paymentMethod === 'upi'}
// // //                   onChange={(e) => setBookingFlow({
// // //                     data: { paymentMethod: e.target.value }
// // //                   })}
// // //                   className="sr-only"
// // //                 />
// // //                 <div className="flex items-center flex-1">
// // //                   <div className="h-5 w-5 mr-3 text-lg">📱</div>
// // //                   <div className="flex-1">
// // //                     <div className="font-medium text-gray-900 dark:text-white">UPI Payment</div>
// // //                     <div className="text-sm text-gray-500">Pay using UPI ID or QR code</div>
// // //                   </div>
// // //                   <div className={`
// // //                     w-4 h-4 rounded-full border-2 flex items-center justify-center
// // //                     ${bookingFlow.data.paymentMethod === 'upi' 
// // //                       ? 'border-primary-600' 
// // //                       : 'border-gray-300'
// // //                     }
// // //                   `}>
// // //                     {bookingFlow.data.paymentMethod === 'upi' && (
// // //                       <div className="w-2 h-2 bg-primary-600 rounded-full" />
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               </label>
// // //             </div>
// // //           </div>

// // //           {/* Security Notice */}
// // //           <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
// // //             <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
// // //             <div className="text-sm text-green-800 dark:text-green-300">
// // //               <div className="font-medium mb-1">Your payment is secure</div>
// // //               <div>Protected by SSL encryption and PCI compliance. We never store your payment details.</div>
// // //             </div>
// // //           </div>
// // //         </CardContent>
// // //       </Card>
      
// // //       {/* Final Price Summary */}
// // //       {quote && <PriceSummary quote={quote} showTotal />}
// // //     </div>
// // //   );
// // // };

// // // // Step 4: Confirmation
// // // const ConfirmationStep = () => {
// // //   const navigate = useNavigate();
  
// // //   return (
// // //     <div className="text-center space-y-8">
// // //       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
// // //         <CheckCircle className="h-12 w-12 text-green-600" />
// // //       </div>
      
// // //       <div>
// // //         <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
// // //           Booking Confirmed!
// // //         </h2>
// // //         <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// // //           Your experience has been successfully booked. Check your email for confirmation details and important information.
// // //         </p>
// // //       </div>

// // //       <Card className="max-w-md mx-auto">
// // //         <CardHeader>
// // //           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
// // //             What happens next?
// // //           </h3>
// // //         </CardHeader>
// // //         <CardContent className="space-y-4 text-left">
// // //           <div className="flex items-start space-x-3">
// // //             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
// // //               1
// // //             </div>
// // //             <div>
// // //               <div className="font-medium text-gray-900 dark:text-white">Check your email</div>
// // //               <div className="text-sm text-gray-600 dark:text-gray-400">
// // //                 Confirmation with booking details sent
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="flex items-start space-x-3">
// // //             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
// // //               2
// // //             </div>
// // //             <div>
// // //               <div className="font-medium text-gray-900 dark:text-white">Host contact</div>
// // //               <div className="text-sm text-gray-600 dark:text-gray-400">
// // //                 You'll be contacted 24-48 hours before
// // //               </div>
// // //             </div>
// // //           </div>
          
// // //           <div className="flex items-start space-x-3">
// // //             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
// // //               3
// // //             </div>
// // //             <div>
// // //               <div className="font-medium text-gray-900 dark:text-white">Enjoy your experience!</div>
// // //               <div className="text-sm text-gray-600 dark:text-gray-400">
// // //                 Show up and have an amazing time
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </CardContent>
// // //       </Card>
      
// // //       <div className="flex flex-col sm:flex-row gap-4 justify-center">
// // //         <Button
// // //           variant="outline"
// // //           onClick={() => navigate('/dashboard/traveller')}
// // //         >
// // //           View My Bookings
// // //         </Button>
// // //         <Button onClick={() => navigate('/')}>
// // //           Book Another Experience
// // //         </Button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // Price Summary Component
// // // const PriceSummary = ({ quote, showTotal = false }) => (
// // //   <Card>
// // //     <CardHeader>
// // //       <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
// // //         Price Summary
// // //       </h3>
// // //     </CardHeader>
// // //     <CardContent>
// // //       <div className="space-y-3">
// // //         <div className="flex justify-between">
// // //           <span className="text-gray-600 dark:text-gray-400">Base price</span>
// // //           <span className="font-medium">₹{quote.basePrice?.toLocaleString()}</span>
// // //         </div>
        
// // //         {quote.fees > 0 && (
// // //           <div className="flex justify-between">
// // //             <span className="text-gray-600 dark:text-gray-400">Service fee</span>
// // //             <span className="font-medium">₹{quote.fees?.toLocaleString()}</span>
// // //           </div>
// // //         )}
        
// // //         {quote.taxes > 0 && (
// // //           <div className="flex justify-between">
// // //             <span className="text-gray-600 dark:text-gray-400">Taxes & fees</span>
// // //             <span className="font-medium">₹{quote.taxes?.toLocaleString()}</span>
// // //           </div>
// // //         )}
        
// // //         {showTotal && (
// // //           <>
// // //             <hr className="border-gray-200 dark:border-gray-600" />
// // //             <div className="flex justify-between text-lg font-bold">
// // //               <span>Total</span>
// // //               <span>₹{quote.total?.toLocaleString()}</span>
// // //             </div>
// // //           </>
// // //         )}
// // //       </div>
      
// // //       <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
// // //         <div className="flex items-center">
// // //           <Check className="h-3 w-3 mr-1 text-green-500" />
// // //           Free cancellation up to 24 hours before
// // //         </div>
// // //         <div className="flex items-center">
// // //           <Check className="h-3 w-3 mr-1 text-green-500" />
// // //           Instant confirmation
// // //         </div>
// // //         <div className="flex items-center">
// // //           <Check className="h-3 w-3 mr-1 text-green-500" />
// // //           Secure payment processing
// // //         </div>
// // //       </div>
// // //     </CardContent>
// // //   </Card>
// // // );

// // // export default BookingFlow;


// // import { useState, useEffect, useCallback } from 'react';
// // // import { useNavigate, useSearchParams } from 'react-router-dom';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //   ArrowLeft, 
// //   ArrowRight, 
// //   CheckCircle, 
// //   CreditCard, 
// //   Clock, 
// //   Calendar,
// //   Users,
// //   MapPin,
// //   Star,
// //   Shield,
// //   AlertCircle,
// //   Check,
// //   X
// // } from 'lucide-react';
// // import { useBookingStore } from '@/store/bookings';
// // import { Card, CardContent, CardHeader } from '@/components/ui/Card';
// // import Button from '@/components/ui/Button';
// // import toast from 'react-hot-toast';

// // const BOOKING_STEPS = [
// //   { id: 1, name: 'Details', description: 'Select date and guests' },
// //   { id: 2, name: 'Information', description: 'Guest details' },
// //   { id: 3, name: 'Payment', description: 'Secure checkout' },
// //   { id: 4, name: 'Confirmation', description: 'Booking confirmed' }
// // ];

// // const BookingFlow = () => {
// //   const navigate = useNavigate();
// //   // const [searchParams] = useSearchParams();
// //   const {
// //     bookingFlow,
// //     setBookingFlow,
// //     nextStep,
// //     prevStep,
// //     resetBookingFlow,
// //     createQuote,
// //     holdBooking,
// //     confirmBooking
// //   } = useBookingStore();

// //   const [loading, setLoading] = useState(false);
// //   const [quote, setQuote] = useState(null);
// //   const [holdTimer, setHoldTimer] = useState(null);
// //   const [errors, setErrors] = useState({});

// //   // Initialize booking flow
// //   useEffect(() => {
// //     const targetType = searchParams.get('type');
// //     const targetId = searchParams.get('id');
    
// //     if (!targetType || !targetId) {
// //       toast.error('Invalid booking parameters');
// //       navigate('/search');
// //       return;
// //     }

// //     setBookingFlow({
// //       data: { 
// //         targetType, 
// //         targetId,
// //         date: '',
// //         time: '',
// //         partySize: 1,
// //         guestDetails: {
// //           name: '',
// //           email: '',
// //           phone: '',
// //           specialRequests: ''
// //         },
// //         paymentMethod: 'card'
// //       }
// //     });

// //     return () => resetBookingFlow();
// //   }, 
// //   // [searchParams, setBookingFlow, navigate, resetBookingFlow]);
// //   [setBookingFlow, navigate, resetBookingFlow]);

// //   Hold timer countdown
// //   useEffect(() => {
// //     if (holdTimer && holdTimer > 0) {
// //       const interval = setInterval(() => {
// //         setHoldTimer(prev => {
// //           if (prev <= 1) {
// //             toast.error('Booking hold expired. Please start over.');
// //             navigate('/search');
// //             return 0;
// //           }
// //           return prev - 1;
// //         });
// //       }, 1000);

// //       return () => clearInterval(interval);
// //     }
// //   }, [holdTimer, navigate]);
  
// //   Validation functions
// //   const validateStep = useCallback((step, data) => {
// //     const newErrors = {};

// //     switch (step) {
// //       case 1:
// //         if (!data.date) newErrors.date = 'Please select a date';
// //         if (!data.partySize || data.partySize < 1) newErrors.partySize = 'Please select number of guests';
// //         break;
      
// //       case 2:
// //         if (!data.guestDetails?.name?.trim()) newErrors.name = 'Name is required';
// //         if (!data.guestDetails?.email?.trim()) newErrors.email = 'Email is required';
// //         else if (!/\S+@\S+\.\S+/.test(data.guestDetails.email)) newErrors.email = 'Invalid email format';
// //         if (!data.guestDetails?.phone?.trim()) newErrors.phone = 'Phone number is required';
// //         else if (!/^\+?[\d\s-()]+$/.test(data.guestDetails.phone)) newErrors.phone = 'Invalid phone format';
// //         break;
      
// //       case 3:
// //         if (!data.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
// //         break;
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   }, []);

// //   // Step handlers
// //   const handleNextStep = async () => {
// //     if (!validateStep(bookingFlow.step, bookingFlow.data)) {
// //       toast.error('Please fill in all required fields');
// //       return;
// //     }

// //     setLoading(true);
    
// //     try {
// //       if (bookingFlow.step === 1) {
// //         const quoteData = await createQuote(bookingFlow.data);
// //         setQuote(quoteData);
// //         nextStep();
// //       } else if (bookingFlow.step === 2) {
// //         const booking = await holdBooking({
// //           ...bookingFlow.data,
// //           quote
// //         });
// //         setHoldTimer(Math.floor((new Date(booking.expiresAt) - new Date()) / 1000));
// //         nextStep();
// //       } else if (bookingFlow.step === 3) {
// //         await handleConfirmBooking();
// //       } else {
// //         nextStep();
// //       }
// //     } catch (error) {
// //       toast.error(error.message || 'Something went wrong. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleConfirmBooking = async () => {
// //     try {
// //       const booking = await confirmBooking(bookingFlow.data.bookingId, {
// //         paymentMethod: bookingFlow.data.paymentMethod,
// //         paymentDetails: bookingFlow.data.paymentDetails
// //       });
      
// //       nextStep();
// //       toast.success('Booking confirmed successfully!');
// //     } catch (error) {
// //       throw error;
// //     }
// //   };

// //   const handlePreviousStep = () => {
// //     if (bookingFlow.step === 1) {
// //       navigate(-1);
// //     } else {
// //       prevStep();
// //     }
// //   };

// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins}:${secs.toString().padStart(2, '0')}`;
// //   };

// //   const renderStepContent = () => {
// //     switch (bookingFlow.step) {
// //       case 1:
// //         return <BookingDetailsStep errors={errors} />;
// //       case 2:
// //         return <GuestInformationStep errors={errors} quote={quote} />;
// //       case 3:
// //         return <PaymentStep errors={errors} holdTimer={holdTimer} quote={quote} />;
// //       case 4:
// //         return <ConfirmationStep />;
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
// //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <button
// //             onClick={() => navigate(-1)}
// //             className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
// //             aria-label="Go back"
// //           >
// //             <ArrowLeft className="h-4 w-4 mr-2" />
// //             Back to search
// //           </button>
          
// //           {/* Progress Steps */}
// //           <div className="mb-8">
// //             <div className="flex items-center justify-between">
// //               {BOOKING_STEPS.map((step, index) => (
// //                 <div key={step.id} className="flex items-center">
// //                   <div className={`
// //                     relative flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all
// //                     ${step.id < bookingFlow.step 
// //                       ? 'bg-green-500 text-white' 
// //                       : step.id === bookingFlow.step
// //                       ? 'bg-primary-600 text-white'
// //                       : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
// //                     }
// //                   `}>
// //                     {step.id < bookingFlow.step ? (
// //                       <CheckCircle className="h-5 w-5" />
// //                     ) : (
// //                       step.id
// //                     )}
// //                   </div>
                  
// //                   {index < BOOKING_STEPS.length - 1 && (
// //                     <div className={`
// //                       flex-1 h-0.5 mx-4 transition-colors
// //                       ${step.id < bookingFlow.step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
// //                     `} />
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
            
// //             <div className="flex justify-between mt-4">
// //               {BOOKING_STEPS.map(step => (
// //                 <div key={step.id} className="text-center">
// //                   <div className="font-medium text-sm text-gray-900 dark:text-white">
// //                     {step.name}
// //                   </div>
// //                   <div className="text-xs text-gray-500 dark:text-gray-400">
// //                     {step.description}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Step Content */}
// //         <div className="space-y-6">
// //           {renderStepContent()}
          
// //           {/* Navigation Buttons */}
// //           {bookingFlow.step < 4 && (
// //             <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
// //               <Button
// //                 variant="outline"
// //                 onClick={handlePreviousStep}
// //                 className="flex items-center"
// //               >
// //                 <ArrowLeft className="h-4 w-4 mr-2" />
// //                 {bookingFlow.step === 1 ? 'Back to search' : 'Previous'}
// //               </Button>
              
// //               <Button
// //                 onClick={handleNextStep}
// //                 loading={loading}
// //                 disabled={loading}
// //                 className="flex items-center"
// //               >
// //                 {bookingFlow.step === 3 ? 'Complete Booking' : 'Continue'}
// //                 {bookingFlow.step < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
// //               </Button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Step 1: Booking Details
// // const BookingDetailsStep = ({ errors }) => {
// //   const { bookingFlow, setBookingFlow } = useBookingStore();
  
// //   const today = new Date();
// //   const maxDate = new Date();
// //   maxDate.setFullYear(today.getFullYear() + 1);

// //   return (
// //     <Card>
// //       <CardHeader>
// //         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
// //           Select Date & Guests
// //         </h2>
// //         <p className="text-gray-600 dark:text-gray-400">
// //           Choose your preferred date and number of guests
// //         </p>
// //       </CardHeader>
// //       <CardContent className="space-y-6">
// //         <div className="grid md:grid-cols-2 gap-6">
// //           <div>
// //             <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //               <Calendar className="inline h-4 w-4 mr-2" />
// //               Date *
// //             </label>
// //             <input
// //               id="date"
// //               type="date"
// //               value={bookingFlow.data.date || ''}
// //               onChange={(e) => setBookingFlow({
// //                 data: { date: e.target.value }
// //               })}
// //               min={today.toISOString().split('T')[0]}
// //               max={maxDate.toISOString().split('T')[0]}
// //               className={`
// //                 w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// //                 dark:bg-gray-800 dark:border-gray-600 dark:text-white
// //                 ${errors.date ? 'border-red-500' : 'border-gray-300'}
// //               `}
// //               required
// //             />
// //             {errors.date && (
// //               <p className="mt-1 text-sm text-red-600 flex items-center">
// //                 <AlertCircle className="h-4 w-4 mr-1" />
// //                 {errors.date}
// //               </p>
// //             )}
// //           </div>
          
// //           <div>
// //             <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //               <Clock className="inline h-4 w-4 mr-2" />
// //               Preferred Time (Optional)
// //             </label>
// //             <select
// //               id="time"
// //               value={bookingFlow.data.time || ''}
// //               onChange={(e) => setBookingFlow({
// //                 data: { time: e.target.value }
// //               })}
// //               className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// //             >
// //               <option value="">Flexible timing</option>
// //               <option value="09:00">9:00 AM</option>
// //               <option value="10:00">10:00 AM</option>
// //               <option value="11:00">11:00 AM</option>
// //               <option value="12:00">12:00 PM</option>
// //               <option value="14:00">2:00 PM</option>
// //               <option value="15:00">3:00 PM</option>
// //               <option value="16:00">4:00 PM</option>
// //               <option value="17:00">5:00 PM</option>
// //             </select>
// //           </div>
// //         </div>
        
// //         <div>
// //           <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //             <Users className="inline h-4 w-4 mr-2" />
// //             Number of Guests *
// //           </label>
// //           <select
// //             id="partySize"
// //             value={bookingFlow.data.partySize || 1}
// //             onChange={(e) => setBookingFlow({
// //               data: { partySize: parseInt(e.target.value) }
// //             })}
// //             className={`
// //               w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// //               dark:bg-gray-800 dark:border-gray-600 dark:text-white
// //               ${errors.partySize ? 'border-red-500' : 'border-gray-300'}
// //             `}
// //             required
// //           >
// //             {Array.from({ length: 15 }, (_, i) => i + 1).map(size => (
// //               <option key={size} value={size}>
// //                 {size} {size === 1 ? 'guest' : 'guests'}
// //               </option>
// //             ))}
// //           </select>
// //           {errors.partySize && (
// //             <p className="mt-1 text-sm text-red-600 flex items-center">
// //               <AlertCircle className="h-4 w-4 mr-1" />
// //               {errors.partySize}
// //             </p>
// //           )}
// //         </div>

// //         {/* Important Information */}
// //         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
// //           <div className="flex items-start">
// //             <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
// //             <div className="text-sm text-blue-800 dark:text-blue-300">
// //               <p className="font-medium mb-1">Good to know:</p>
// //               <ul className="list-disc list-inside space-y-1">
// //                 <li>Free cancellation up to 24 hours before the experience</li>
// //                 <li>Instant confirmation upon booking</li>
// //                 <li>Mobile ticket accepted</li>
// //               </ul>
// //             </div>
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // // Step 2: Guest Information
// // const GuestInformationStep = ({ errors, quote }) => {
// //   const { bookingFlow, setBookingFlow } = useBookingStore();

// //   const updateGuestDetails = (field, value) => {
// //     setBookingFlow({
// //       data: {
// //         guestDetails: {
// //           ...bookingFlow.data.guestDetails,
// //           [field]: value
// //         }
// //       }
// //     });
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <Card>
// //         <CardHeader>
// //           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
// //             Guest Information
// //           </h2>
// //           <p className="text-gray-600 dark:text-gray-400">
// //             Please provide contact details for the booking
// //           </p>
// //         </CardHeader>
// //         <CardContent className="space-y-4">
// //           <div className="grid md:grid-cols-2 gap-4">
// //             <div>
// //               <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                 Full Name *
// //               </label>
// //               <input
// //                 id="name"
// //                 type="text"
// //                 value={bookingFlow.data.guestDetails?.name || ''}
// //                 onChange={(e) => updateGuestDetails('name', e.target.value)}
// //                 className={`
// //                   w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// //                   dark:bg-gray-800 dark:border-gray-600 dark:text-white
// //                   ${errors.name ? 'border-red-500' : 'border-gray-300'}
// //                 `}
// //                 placeholder="Enter your full name"
// //                 required
// //               />
// //               {errors.name && (
// //                 <p className="mt-1 text-sm text-red-600 flex items-center">
// //                   <AlertCircle className="h-4 w-4 mr-1" />
// //                   {errors.name}
// //                 </p>
// //               )}
// //             </div>
            
// //             <div>
// //               <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //                 Email Address *
// //               </label>
// //               <input
// //                 id="email"
// //                 type="email"
// //                 value={bookingFlow.data.guestDetails?.email || ''}
// //                 onChange={(e) => updateGuestDetails('email', e.target.value)}
// //                 className={`
// //                   w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// //                   dark:bg-gray-800 dark:border-gray-600 dark:text-white
// //                   ${errors.email ? 'border-red-500' : 'border-gray-300'}
// //                 `}
// //                 placeholder="Enter your email address"
// //                 required
// //               />
// //               {errors.email && (
// //                 <p className="mt-1 text-sm text-red-600 flex items-center">
// //                   <AlertCircle className="h-4 w-4 mr-1" />
// //                   {errors.email}
// //                 </p>
// //               )}
// //             </div>
// //           </div>
          
// //           <div>
// //             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //               Phone Number *
// //             </label>
// //             <input
// //               id="phone"
// //               type="tel"
// //               value={bookingFlow.data.guestDetails?.phone || ''}
// //               onChange={(e) => updateGuestDetails('phone', e.target.value)}
// //               className={`
// //                 w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
// //                 dark:bg-gray-800 dark:border-gray-600 dark:text-white
// //                 ${errors.phone ? 'border-red-500' : 'border-gray-300'}
// //               `}
// //               placeholder="Enter your phone number"
// //               required
// //             />
// //             {errors.phone && (
// //               <p className="mt-1 text-sm text-red-600 flex items-center">
// //                 <AlertCircle className="h-4 w-4 mr-1" />
// //                 {errors.phone}
// //               </p>
// //             )}
// //           </div>
          
// //           <div>
// //             <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
// //               Special Requirements (Optional)
// //             </label>
// //             <textarea
// //               id="specialRequests"
// //               value={bookingFlow.data.guestDetails?.specialRequests || ''}
// //               onChange={(e) => updateGuestDetails('specialRequests', e.target.value)}
// //               rows="3"
// //               className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
// //               placeholder="Any dietary restrictions, accessibility needs, special occasions..."
// //             />
// //           </div>
// //         </CardContent>
// //       </Card>
      
// //       {/* Price Summary */}
// //       {quote && <PriceSummary quote={quote} />}
// //     </div>
// //   );
// // };

// // // Step 3: Payment
// // const PaymentStep = ({ errors, holdTimer, quote }) => {
// //   const { bookingFlow, setBookingFlow } = useBookingStore();

// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins}:${secs.toString().padStart(2, '0')}`;
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* Hold Timer */}
// //       {holdTimer && holdTimer > 0 && (
// //         <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
// //           <CardContent className="p-4">
// //             <div className="flex items-center text-amber-800 dark:text-amber-300">
// //               <Clock className="h-5 w-5 mr-3 flex-shrink-0" />
// //               <div>
// //                 <div className="font-medium">Booking Reserved</div>
// //                 <div className="text-sm">
// //                   Your booking is held for {formatTime(holdTimer)}. Complete payment to confirm.
// //                 </div>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}

// //       <Card>
// //         <CardHeader>
// //           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
// //             Payment Information
// //           </h2>
// //           <p className="text-gray-600 dark:text-gray-400">
// //             Secure payment powered by industry-standard encryption
// //           </p>
// //         </CardHeader>
// //         <CardContent className="space-y-6">
// //           {/* Payment Methods */}
// //           <div>
// //             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
// //               Choose Payment Method
// //             </h3>
            
// //             <div className="space-y-3">
// //               <label className={`
// //                 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors
// //                 ${bookingFlow.data.paymentMethod === 'card' 
// //                   ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
// //                   : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
// //                 }
// //               `}>
// //                 <input
// //                   type="radio"
// //                   name="paymentMethod"
// //                   value="card"
// //                   checked={bookingFlow.data.paymentMethod === 'card'}
// //                   onChange={(e) => setBookingFlow({
// //                     data: { paymentMethod: e.target.value }
// //                   })}
// //                   className="sr-only"
// //                 />
// //                 <div className="flex items-center flex-1">
// //                   <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
// //                   <div className="flex-1">
// //                     <div className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</div>
// //                     <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
// //                   </div>
// //                   <div className={`
// //                     w-4 h-4 rounded-full border-2 flex items-center justify-center
// //                     ${bookingFlow.data.paymentMethod === 'card' 
// //                       ? 'border-primary-600' 
// //                       : 'border-gray-300'
// //                     }
// //                   `}>
// //                     {bookingFlow.data.paymentMethod === 'card' && (
// //                       <div className="w-2 h-2 bg-primary-600 rounded-full" />
// //                     )}
// //                   </div>
// //                 </div>
// //               </label>
              
// //               <label className={`
// //                 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors
// //                 ${bookingFlow.data.paymentMethod === 'upi' 
// //                   ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
// //                   : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
// //                 }
// //               `}>
// //                 <input
// //                   type="radio"
// //                   name="paymentMethod"
// //                   value="upi"
// //                   checked={bookingFlow.data.paymentMethod === 'upi'}
// //                   onChange={(e) => setBookingFlow({
// //                     data: { paymentMethod: e.target.value }
// //                   })}
// //                   className="sr-only"
// //                 />
// //                 <div className="flex items-center flex-1">
// //                   <div className="h-5 w-5 mr-3 text-lg">📱</div>
// //                   <div className="flex-1">
// //                     <div className="font-medium text-gray-900 dark:text-white">UPI Payment</div>
// //                     <div className="text-sm text-gray-500">Pay using UPI ID or QR code</div>
// //                   </div>
// //                   <div className={`
// //                     w-4 h-4 rounded-full border-2 flex items-center justify-center
// //                     ${bookingFlow.data.paymentMethod === 'upi' 
// //                       ? 'border-primary-600' 
// //                       : 'border-gray-300'
// //                     }
// //                   `}>
// //                     {bookingFlow.data.paymentMethod === 'upi' && (
// //                       <div className="w-2 h-2 bg-primary-600 rounded-full" />
// //                     )}
// //                   </div>
// //                 </div>
// //               </label>
// //             </div>
// //           </div>

// //           {/* Security Notice */}
// //           <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
// //             <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
// //             <div className="text-sm text-green-800 dark:text-green-300">
// //               <div className="font-medium mb-1">Your payment is secure</div>
// //               <div>Protected by SSL encryption and PCI compliance. We never store your payment details.</div>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>
      
// //       {/* Final Price Summary */}
// //       {quote && <PriceSummary quote={quote} showTotal />}
// //     </div>
// //   );
// // };

// // // Step 4: Confirmation
// // const ConfirmationStep = () => {
// //   const navigate = useNavigate();
  
// //   return (
// //     <div className="text-center space-y-8">
// //       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
// //         <CheckCircle className="h-12 w-12 text-green-600" />
// //       </div>
      
// //       <div>
// //         <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
// //           Booking Confirmed!
// //         </h2>
// //         <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// //           Your experience has been successfully booked. Check your email for confirmation details and important information.
// //         </p>
// //       </div>

// //       <Card className="max-w-md mx-auto">
// //         <CardHeader>
// //           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
// //             What happens next?
// //           </h3>
// //         </CardHeader>
// //         <CardContent className="space-y-4 text-left">
// //           <div className="flex items-start space-x-3">
// //             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
// //               1
// //             </div>
// //             <div>
// //               <div className="font-medium text-gray-900 dark:text-white">Check your email</div>
// //               <div className="text-sm text-gray-600 dark:text-gray-400">
// //                 Confirmation with booking details sent
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="flex items-start space-x-3">
// //             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
// //               2
// //             </div>
// //             <div>
// //               <div className="font-medium text-gray-900 dark:text-white">Host contact</div>
// //               <div className="text-sm text-gray-600 dark:text-gray-400">
// //                 You'll be contacted 24-48 hours before
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="flex items-start space-x-3">
// //             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
// //               3
// //             </div>
// //             <div>
// //               <div className="font-medium text-gray-900 dark:text-white">Enjoy your experience!</div>
// //               <div className="text-sm text-gray-600 dark:text-gray-400">
// //                 Show up and have an amazing time
// //               </div>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>
      
// //       <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //         <Button
// //           variant="outline"
// //           onClick={() => navigate('/dashboard/traveller')}
// //         >
// //           View My Bookings
// //         </Button>
// //         <Button onClick={() => navigate('/')}>
// //           Book Another Experience
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // };

// // // Price Summary Component
// // const PriceSummary = ({ quote, showTotal = false }) => (
// //   <Card>
// //     <CardHeader>
// //       <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
// //         Price Summary
// //       </h3>
// //     </CardHeader>
// //     <CardContent>
// //       <div className="space-y-3">
// //         <div className="flex justify-between">
// //           <span className="text-gray-600 dark:text-gray-400">Base price</span>
// //           <span className="font-medium">₹{quote.basePrice?.toLocaleString()}</span>
// //         </div>
        
// //         {quote.fees > 0 && (
// //           <div className="flex justify-between">
// //             <span className="text-gray-600 dark:text-gray-400">Service fee</span>
// //             <span className="font-medium">₹{quote.fees?.toLocaleString()}</span>
// //           </div>
// //         )}
        
// //         {quote.taxes > 0 && (
// //           <div className="flex justify-between">
// //             <span className="text-gray-600 dark:text-gray-400">Taxes & fees</span>
// //             <span className="font-medium">₹{quote.taxes?.toLocaleString()}</span>
// //           </div>
// //         )}
        
// //         {showTotal && (
// //           <>
// //             <hr className="border-gray-200 dark:border-gray-600" />
// //             <div className="flex justify-between text-lg font-bold">
// //               <span>Total</span>
// //               <span>₹{quote.total?.toLocaleString()}</span>
// //             </div>
// //           </>
// //         )}
// //       </div>
      
// //       <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
// //         <div className="flex items-center">
// //           <Check className="h-3 w-3 mr-1 text-green-500" />
// //           Free cancellation up to 24 hours before
// //         </div>
// //         <div className="flex items-center">
// //           <Check className="h-3 w-3 mr-1 text-green-500" />
// //           Instant confirmation
// //         </div>
// //         <div className="flex items-center">
// //           <Check className="h-3 w-3 mr-1 text-green-500" />
// //           Secure payment processing
// //         </div>
// //       </div>
// //     </CardContent>
// //   </Card>
// // );

// // export default BookingFlow;

// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { 
//   ArrowLeft, 
//   ArrowRight, 
//   CheckCircle, 
//   CreditCard, 
//   Clock, 
//   Calendar,
//   Users,
//   MapPin,
//   Star,
//   Shield,
//   AlertCircle,
//   Check,
//   X
// } from 'lucide-react';
// import { useBookingStore } from '@/store/bookings';
// import { Card, CardContent, CardHeader } from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
// import toast from 'react-hot-toast';

// const BOOKING_STEPS = [
//   { id: 1, name: 'Details', description: 'Select date and guests' },
//   { id: 2, name: 'Information', description: 'Guest details' },
//   { id: 3, name: 'Payment', description: 'Secure checkout' },
//   { id: 4, name: 'Confirmation', description: 'Booking confirmed' }
// ];

// const BookingFlow = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const {
//     bookingFlow,
//     setBookingFlow,
//     nextStep,
//     prevStep,
//     resetBookingFlow,
//     createQuote,
//     holdBooking,
//     confirmBooking
//   } = useBookingStore();

//   const [loading, setLoading] = useState(false);
//   const [quote, setQuote] = useState(null);
//   const [holdTimer, setHoldTimer] = useState(null);
//   const [errors, setErrors] = useState({});

//   // Initialize booking flow
//   useEffect(() => {
//     const targetType = searchParams.get('type');
//     const targetId = searchParams.get('id');
    
//     if (!targetType || !targetId) {
//       toast.error('Invalid booking parameters');
//       navigate('/search');
//       return;
//     }

//     setBookingFlow({
//       data: { 
//         targetType, 
//         targetId,
//         date: '',
//         time: '',
//         partySize: 1,
//         guestDetails: {
//           name: '',
//           email: '',
//           phone: '',
//           specialRequests: ''
//         },
//         paymentMethod: 'card'
//       }
//     });

//     return () => resetBookingFlow();
//   }, [searchParams, setBookingFlow, navigate, resetBookingFlow]);

//   // Hold timer countdown
//   useEffect(() => {
//     if (holdTimer && holdTimer > 0) {
//       const interval = setInterval(() => {
//         setHoldTimer(prev => {
//           if (prev <= 1) {
//             toast.error('Booking hold expired. Please start over.');
//             navigate('/search');
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [holdTimer, navigate]);

//   // Validation functions
//   const validateStep = useCallback((step, data) => {
//     const newErrors = {};

//     switch (step) {
//       case 1:
//         if (!data.date) newErrors.date = 'Please select a date';
//         if (!data.partySize || data.partySize < 1) newErrors.partySize = 'Please select number of guests';
//         break;
      
//       case 2:
//         if (!data.guestDetails?.name?.trim()) newErrors.name = 'Name is required';
//         if (!data.guestDetails?.email?.trim()) newErrors.email = 'Email is required';
//         else if (!/\S+@\S+\.\S+/.test(data.guestDetails.email)) newErrors.email = 'Invalid email format';
//         if (!data.guestDetails?.phone?.trim()) newErrors.phone = 'Phone number is required';
//         else if (!/^\+?[\d\s-()]+$/.test(data.guestDetails.phone)) newErrors.phone = 'Invalid phone format';
//         break;
      
//       case 3:
//         if (!data.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
//         break;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, []);

//   // Step handlers
//   const handleNextStep = async () => {
//     if (!validateStep(bookingFlow.step, bookingFlow.data)) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       if (bookingFlow.step === 1) {
//         const quoteData = await createQuote(bookingFlow.data);
//         setQuote(quoteData);
//         nextStep();
//       } else if (bookingFlow.step === 2) {
//         const booking = await holdBooking({
//           ...bookingFlow.data,
//           quote
//         });
//         setHoldTimer(Math.floor((new Date(booking.expiresAt) - new Date()) / 1000));
//         nextStep();
//       } else if (bookingFlow.step === 3) {
//         await handleConfirmBooking();
//       } else {
//         nextStep();
//       }
//     } catch (error) {
//       toast.error(error.message || 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmBooking = async () => {
//     try {
//       const booking = await confirmBooking(bookingFlow.data.bookingId, {
//         paymentMethod: bookingFlow.data.paymentMethod,
//         paymentDetails: bookingFlow.data.paymentDetails
//       });
      
//       nextStep();
//       toast.success('Booking confirmed successfully!');
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handlePreviousStep = () => {
//     if (bookingFlow.step === 1) {
//       navigate(-1);
//     } else {
//       prevStep();
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const renderStepContent = () => {
//     switch (bookingFlow.step) {
//       case 1:
//         return <BookingDetailsStep errors={errors} />;
//       case 2:
//         return <GuestInformationStep errors={errors} quote={quote} />;
//       case 3:
//         return <PaymentStep errors={errors} holdTimer={holdTimer} quote={quote} />;
//       case 4:
//         return <ConfirmationStep />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
//             aria-label="Go back"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to search
//           </button>
          
//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               {BOOKING_STEPS.map((step, index) => (
//                 <div key={step.id} className="flex items-center">
//                   <div className={`
//                     relative flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-all
//                     ${step.id < bookingFlow.step 
//                       ? 'bg-green-500 text-white' 
//                       : step.id === bookingFlow.step
//                       ? 'bg-primary-600 text-white'
//                       : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
//                     }
//                   `}>
//                     {step.id < bookingFlow.step ? (
//                       <CheckCircle className="h-5 w-5" />
//                     ) : (
//                       step.id
//                     )}
//                   </div>
                  
//                   {index < BOOKING_STEPS.length - 1 && (
//                     <div className={`
//                       flex-1 h-0.5 mx-4 transition-colors
//                       ${step.id < bookingFlow.step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
//                     `} />
//                   )}
//                 </div>
//               ))}
//             </div>
            
//             <div className="flex justify-between mt-4">
//               {BOOKING_STEPS.map(step => (
//                 <div key={step.id} className="text-center">
//                   <div className="font-medium text-sm text-gray-900 dark:text-white">
//                     {step.name}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {step.description}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Step Content */}
//         <div className="space-y-6">
//           {renderStepContent()}
          
//           {/* Navigation Buttons */}
//           {bookingFlow.step < 4 && (
//             <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
//               <Button
//                 variant="outline"
//                 onClick={handlePreviousStep}
//                 className="flex items-center"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 {bookingFlow.step === 1 ? 'Back to search' : 'Previous'}
//               </Button>
              
//               <Button
//                 onClick={handleNextStep}
//                 loading={loading}
//                 disabled={loading}
//                 className="flex items-center"
//               >
//                 {bookingFlow.step === 3 ? 'Complete Booking' : 'Continue'}
//                 {bookingFlow.step < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Step 1: Booking Details
// const BookingDetailsStep = ({ errors }) => {
//   const { bookingFlow, setBookingFlow } = useBookingStore();
  
//   const today = new Date();
//   const maxDate = new Date();
//   maxDate.setFullYear(today.getFullYear() + 1);

//   return (
//     <Card>
//       <CardHeader>
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//           Select Date & Guests
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400">
//           Choose your preferred date and number of guests
//         </p>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               <Calendar className="inline h-4 w-4 mr-2" />
//               Date *
//             </label>
//             <input
//               id="date"
//               type="date"
//               value={bookingFlow.data.date || ''}
//               onChange={(e) => setBookingFlow({
//                 data: { date: e.target.value }
//               })}
//               min={today.toISOString().split('T')[0]}
//               max={maxDate.toISOString().split('T')[0]}
//               className={`
//                 w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
//                 dark:bg-gray-800 dark:border-gray-600 dark:text-white
//                 ${errors.date ? 'border-red-500' : 'border-gray-300'}
//               `}
//               required
//             />
//             {errors.date && (
//               <p className="mt-1 text-sm text-red-600 flex items-center">
//                 <AlertCircle className="h-4 w-4 mr-1" />
//                 {errors.date}
//               </p>
//             )}
//           </div>
          
//           <div>
//             <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               <Clock className="inline h-4 w-4 mr-2" />
//               Preferred Time (Optional)
//             </label>
//             <select
//               id="time"
//               value={bookingFlow.data.time || ''}
//               onChange={(e) => setBookingFlow({
//                 data: { time: e.target.value }
//               })}
//               className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
//             >
//               <option value="">Flexible timing</option>
//               <option value="09:00">9:00 AM</option>
//               <option value="10:00">10:00 AM</option>
//               <option value="11:00">11:00 AM</option>
//               <option value="12:00">12:00 PM</option>
//               <option value="14:00">2:00 PM</option>
//               <option value="15:00">3:00 PM</option>
//               <option value="16:00">4:00 PM</option>
//               <option value="17:00">5:00 PM</option>
//             </select>
//           </div>
//         </div>
        
//         <div>
//           <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             <Users className="inline h-4 w-4 mr-2" />
//             Number of Guests *
//           </label>
//           <select
//             id="partySize"
//             value={bookingFlow.data.partySize || 1}
//             onChange={(e) => setBookingFlow({
//               data: { partySize: parseInt(e.target.value) }
//             })}
//             className={`
//               w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
//               dark:bg-gray-800 dark:border-gray-600 dark:text-white
//               ${errors.partySize ? 'border-red-500' : 'border-gray-300'}
//             `}
//             required
//           >
//             {Array.from({ length: 15 }, (_, i) => i + 1).map(size => (
//               <option key={size} value={size}>
//                 {size} {size === 1 ? 'guest' : 'guests'}
//               </option>
//             ))}
//           </select>
//           {errors.partySize && (
//             <p className="mt-1 text-sm text-red-600 flex items-center">
//               <AlertCircle className="h-4 w-4 mr-1" />
//               {errors.partySize}
//             </p>
//           )}
//         </div>

//         {/* Important Information */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
//           <div className="flex items-start">
//             <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
//             <div className="text-sm text-blue-800 dark:text-blue-300">
//               <p className="font-medium mb-1">Good to know:</p>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>Free cancellation up to 24 hours before the experience</li>
//                 <li>Instant confirmation upon booking</li>
//                 <li>Mobile ticket accepted</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Step 2: Guest Information
// const GuestInformationStep = ({ errors, quote }) => {
//   const { bookingFlow, setBookingFlow } = useBookingStore();

//   const updateGuestDetails = (field, value) => {
//     setBookingFlow({
//       data: {
//         guestDetails: {
//           ...bookingFlow.data.guestDetails,
//           [field]: value
//         }
//       }
//     });
//   };

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Guest Information
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Please provide contact details for the booking
//           </p>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Full Name *
//               </label>
//               <input
//                 id="name"
//                 type="text"
//                 value={bookingFlow.data.guestDetails?.name || ''}
//                 onChange={(e) => updateGuestDetails('name', e.target.value)}
//                 className={`
//                   w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
//                   dark:bg-gray-800 dark:border-gray-600 dark:text-white
//                   ${errors.name ? 'border-red-500' : 'border-gray-300'}
//                 `}
//                 placeholder="Enter your full name"
//                 required
//               />
//               {errors.name && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-1" />
//                   {errors.name}
//                 </p>
//               )}
//             </div>
            
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Email Address *
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={bookingFlow.data.guestDetails?.email || ''}
//                 onChange={(e) => updateGuestDetails('email', e.target.value)}
//                 className={`
//                   w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
//                   dark:bg-gray-800 dark:border-gray-600 dark:text-white
//                   ${errors.email ? 'border-red-500' : 'border-gray-300'}
//                 `}
//                 placeholder="Enter your email address"
//                 required
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-1" />
//                   {errors.email}
//                 </p>
//               )}
//             </div>
//           </div>
          
//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Phone Number *
//             </label>
//             <input
//               id="phone"
//               type="tel"
//               value={bookingFlow.data.guestDetails?.phone || ''}
//               onChange={(e) => updateGuestDetails('phone', e.target.value)}
//               className={`
//                 w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
//                 dark:bg-gray-800 dark:border-gray-600 dark:text-white
//                 ${errors.phone ? 'border-red-500' : 'border-gray-300'}
//               `}
//               placeholder="Enter your phone number"
//               required
//             />
//             {errors.phone && (
//               <p className="mt-1 text-sm text-red-600 flex items-center">
//                 <AlertCircle className="h-4 w-4 mr-1" />
//                 {errors.phone}
//               </p>
//             )}
//           </div>
          
//           <div>
//             <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Special Requirements (Optional)
//             </label>
//             <textarea
//               id="specialRequests"
//               value={bookingFlow.data.guestDetails?.specialRequests || ''}
//               onChange={(e) => updateGuestDetails('specialRequests', e.target.value)}
//               rows="3"
//               className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
//               placeholder="Any dietary restrictions, accessibility needs, special occasions..."
//             />
//           </div>
//         </CardContent>
//       </Card>
      
//       {/* Price Summary */}
//       {quote && <PriceSummary quote={quote} />}
//     </div>
//   );
// };

// // Step 3: Payment
// const PaymentStep = ({ errors, holdTimer, quote }) => {
//   const { bookingFlow, setBookingFlow } = useBookingStore();

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="space-y-6">
//       {/* Hold Timer */}
//       {holdTimer && holdTimer > 0 && (
//         <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
//           <CardContent className="p-4">
//             <div className="flex items-center text-amber-800 dark:text-amber-300">
//               <Clock className="h-5 w-5 mr-3 flex-shrink-0" />
//               <div>
//                 <div className="font-medium">Booking Reserved</div>
//                 <div className="text-sm">
//                   Your booking is held for {formatTime(holdTimer)}. Complete payment to confirm.
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <Card>
//         <CardHeader>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Payment Information
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Secure payment powered by industry-standard encryption
//           </p>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Payment Methods */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               Choose Payment Method
//             </h3>
            
//             <div className="space-y-3">
//               <label className={`
//                 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors
//                 ${bookingFlow.data.paymentMethod === 'card' 
//                   ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
//                   : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
//                 }
//               `}>
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="card"
//                   checked={bookingFlow.data.paymentMethod === 'card'}
//                   onChange={(e) => setBookingFlow({
//                     data: { paymentMethod: e.target.value }
//                   })}
//                   className="sr-only"
//                 />
//                 <div className="flex items-center flex-1">
//                   <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
//                   <div className="flex-1">
//                     <div className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</div>
//                     <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
//                   </div>
//                   <div className={`
//                     w-4 h-4 rounded-full border-2 flex items-center justify-center
//                     ${bookingFlow.data.paymentMethod === 'card' 
//                       ? 'border-primary-600' 
//                       : 'border-gray-300'
//                     }
//                   `}>
//                     {bookingFlow.data.paymentMethod === 'card' && (
//                       <div className="w-2 h-2 bg-primary-600 rounded-full" />
//                     )}
//                   </div>
//                 </div>
//               </label>
              
//               <label className={`
//                 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors
//                 ${bookingFlow.data.paymentMethod === 'upi' 
//                   ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
//                   : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
//                 }
//               `}>
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="upi"
//                   checked={bookingFlow.data.paymentMethod === 'upi'}
//                   onChange={(e) => setBookingFlow({
//                     data: { paymentMethod: e.target.value }
//                   })}
//                   className="sr-only"
//                 />
//                 <div className="flex items-center flex-1">
//                   <div className="h-5 w-5 mr-3 text-lg">📱</div>
//                   <div className="flex-1">
//                     <div className="font-medium text-gray-900 dark:text-white">UPI Payment</div>
//                     <div className="text-sm text-gray-500">Pay using UPI ID or QR code</div>
//                   </div>
//                   <div className={`
//                     w-4 h-4 rounded-full border-2 flex items-center justify-center
//                     ${bookingFlow.data.paymentMethod === 'upi' 
//                       ? 'border-primary-600' 
//                       : 'border-gray-300'
//                     }
//                   `}>
//                     {bookingFlow.data.paymentMethod === 'upi' && (
//                       <div className="w-2 h-2 bg-primary-600 rounded-full" />
//                     )}
//                   </div>
//                 </div>
//               </label>
//             </div>
//           </div>

//           {/* Security Notice */}
//           <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
//             <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
//             <div className="text-sm text-green-800 dark:text-green-300">
//               <div className="font-medium mb-1">Your payment is secure</div>
//               <div>Protected by SSL encryption and PCI compliance. We never store your payment details.</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       {/* Final Price Summary */}
//       {quote && <PriceSummary quote={quote} showTotal />}
//     </div>
//   );
// };

// // Step 4: Confirmation
// const ConfirmationStep = () => {
//   const navigate = useNavigate();
  
//   return (
//     <div className="text-center space-y-8">
//       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//         <CheckCircle className="h-12 w-12 text-green-600" />
//       </div>
      
//       <div>
//         <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
//           Booking Confirmed!
//         </h2>
//         <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//           Your experience has been successfully booked. Check your email for confirmation details and important information.
//         </p>
//       </div>

//       <Card className="max-w-md mx-auto">
//         <CardHeader>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//             What happens next?
//           </h3>
//         </CardHeader>
//         <CardContent className="space-y-4 text-left">
//           <div className="flex items-start space-x-3">
//             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//               1
//             </div>
//             <div>
//               <div className="font-medium text-gray-900 dark:text-white">Check your email</div>
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 Confirmation with booking details sent
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-start space-x-3">
//             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//               2
//             </div>
//             <div>
//               <div className="font-medium text-gray-900 dark:text-white">Host contact</div>
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 You'll be contacted 24-48 hours before
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-start space-x-3">
//             <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//               3
//             </div>
//             <div>
//               <div className="font-medium text-gray-900 dark:text-white">Enjoy your experience!</div>
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 Show up and have an amazing time
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <div className="flex flex-col sm:flex-row gap-4 justify-center">
//         <Button
//           variant="outline"
//           onClick={() => navigate('/dashboard/traveller')}
//         >
//           View My Bookings
//         </Button>
//         <Button onClick={() => navigate('/')}>
//           Book Another Experience
//         </Button>
//       </div>
//     </div>
//   );
// };

// // Price Summary Component
// const PriceSummary = ({ quote, showTotal = false }) => (
//   <Card>
//     <CardHeader>
//       <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//         Price Summary
//       </h3>
//     </CardHeader>
//     <CardContent>
//       <div className="space-y-3">
//         <div className="flex justify-between">
//           <span className="text-gray-600 dark:text-gray-400">Base price</span>
//           <span className="font-medium">₹{quote.basePrice?.toLocaleString()}</span>
//         </div>
        
//         {quote.fees > 0 && (
//           <div className="flex justify-between">
//             <span className="text-gray-600 dark:text-gray-400">Service fee</span>
//             <span className="font-medium">₹{quote.fees?.toLocaleString()}</span>
//           </div>
//         )}
        
//         {quote.taxes > 0 && (
//           <div className="flex justify-between">
//             <span className="text-gray-600 dark:text-gray-400">Taxes & fees</span>
//             <span className="font-medium">₹{quote.taxes?.toLocaleString()}</span>
//           </div>
//         )}
        
//         {showTotal && (
//           <>
//             <hr className="border-gray-200 dark:border-gray-600" />
//             <div className="flex justify-between text-lg font-bold">
//               <span>Total</span>
//               <span>₹{quote.total?.toLocaleString()}</span>
//             </div>
//           </>
//         )}
//       </div>
      
//       <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
//         <div className="flex items-center">
//           <Check className="h-3 w-3 mr-1 text-green-500" />
//           Free cancellation up to 24 hours before
//         </div>
//         <div className="flex items-center">
//           <Check className="h-3 w-3 mr-1 text-green-500" />
//           Instant confirmation
//         </div>
//         <div className="flex items-center">
//           <Check className="h-3 w-3 mr-1 text-green-500" />
//           Secure payment processing
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// export default BookingFlow;










// BookingFlow.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { AlertTriangle, Calendar, Users, Mail, Phone, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

/** Helper: ensure document is admin-uploaded & approved */
const isAdminApproved = (doc) =>
  !!doc &&
  (doc.approved === true || doc.isApproved === true) &&
  (doc.source === "admin" ||
    doc.createdByRole === "admin" ||
    doc?.createdBy?.role === "admin");

/** Simple INR formatter */
const inr = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n)
    : "₹—";

export default function BookingFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  // activityId may come from state (preferred) or query param (?activityId=)
  const stateActivityId = location?.state?.activityId;
  const qpActivityId = params.get("activityId");
  const activityId = stateActivityId || qpActivityId || "";

  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");

  // Booking form state
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const guestOptions = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        value: String(i + 1),
        label: `${i + 1} Guest${i ? "s" : ""}`,
      })),
    []
  );

  // 1) Load activity (admin-approved only)
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");

        if (!activityId) {
          setError("No activity selected.");
          setActivity(null);
          return;
        }

        // Ask server for admin-only approved document
        const res = await api.get(`/activities/${activityId}`, {
          signal: ac.signal,
          silenceToast: true,
          params: { approved: true, source: "admin" },
        });

        const data = res?.data?.data || null;
        setActivity(isAdminApproved(data) ? data : null);
        if (!isAdminApproved(data)) {
          setError("This activity is not available to the public.");
        }
      } catch (e) {
        if (e?.name !== "CanceledError") {
          console.error(e);
          setError("Failed to load activity.");
          setActivity(null);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [activityId]);

  // 2) Derived price (basePrice * guests)
  const totalPrice = useMemo(() => {
    const base = typeof activity?.basePrice === "number" ? activity.basePrice : 0;
    const g = Number(guests || 1) || 1;
    return base * g;
  }, [activity, guests]);

  const formValid =
    !!activity &&
    !!date &&
    Number(guests) > 0 &&
    name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(email) &&
    phone.trim().length >= 8;

  // 3) Submit booking (re-check approval on server)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    try {
      setSubmitting(true);
      setError("");

      // Optional: re-fetch approval quickly (server-side must enforce anyway)
      const check = await api.get(`/activities/${activityId}`, {
        silenceToast: true,
        params: { approved: true, source: "admin" },
      });
      const fresh = check?.data?.data || null;
      if (!isAdminApproved(fresh)) {
        setError("This activity is no longer available to the public.");
        setSubmitting(false);
        return;
      }

      // Create booking (adjust this to your backend route)
      // Include server-trustable IDs; keep client data minimal
      const payload = {
        activityId,
        date,
        guests: Number(guests),
        customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
      };

      // Example endpoint: /bookings (change to your actual)
      const resp = await api.post("/bookings", payload, { silenceToast: false });

      // If you redirect to payment (Razorpay, etc.), do it here based on backend response
      // For now, navigate to a confirmation or booking detail page
      const bookingId = resp?.data?.data?._id || "";
      navigate(`/booking/confirm${bookingId ? `?id=${bookingId}` : ""}`, {
        state: { bookingId, activityId },
        replace: true,
      });
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.message ||
          "Unable to create booking. Please check details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- UI ---------- */

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  // Guard: not available or not admin-approved
  if (!activity) {
    return <Unavailable error={error} />;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-[1.4fr_1fr] gap-8">
      {/* Left: activity summary + form */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold dark:text-white">
                  {activity.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1 capitalize">
                  {String(activity.category || "").replace("_", " ") || "Experience"}
                </p>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-full h-fit">
                Admin curated
              </span>
            </div>

            <div className="mt-4 text-gray-700 dark:text-gray-300">
              {activity.description || "—"}
            </div>
          </CardContent>
        </Card>

        {/* Booking form */}
        <Card>
          <CardContent className="p-5 space-y-5">
            <h2 className="text-lg font-semibold dark:text-white">Book this activity</h2>

            {error ? (
              <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-800 p-3 text-sm">
                {error}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Date */}
                <label className="relative block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Date
                  </span>
                  <Calendar className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                    required
                  />
                </label>

                {/* Guests */}
                <label className="relative block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Guests
                  </span>
                  <Users className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                  >
                    {guestOptions.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Name */}
                <label className="relative block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Full name
                  </span>
                  <User className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                    placeholder="Your name"
                    required
                  />
                </label>

                {/* Email */}
                <label className="relative block">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Email
                  </span>
                  <Mail className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                {/* Phone */}
                <label className="relative block md:col-span-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 block">
                    Phone
                  </span>
                  <Phone className="absolute left-3 bottom-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
                    placeholder="Your contact number"
                    required
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={!formValid || submitting}
                  className="min-w-[160px]"
                >
                  {submitting ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    `Pay ${inr(totalPrice)}`
                  )}
                </Button>
                <Button as={Link} to={`/activities/${activityId}`} variant="outline">
                  Back to activity
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right: price summary */}
      <aside className="space-y-4">
        <Card>
          <CardContent className="p-5 space-y-2">
            <h3 className="text-lg font-semibold dark:text-white">Price summary</h3>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Base price</span>
              <span>{inr(activity?.basePrice)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Guests</span>
              <span>× {guests}</span>
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between font-semibold">
              <span className="dark:text-white">Total</span>
              <span className="dark:text-white">{inr(totalPrice)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 text-sm text-gray-600 dark:text-gray-400">
            By continuing, you agree that bookings are subject to availability and
            venue/provider terms. Only **admin-approved** activities are eligible.
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Unavailable({ error = "" }) {
  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-amber-600" />
      </div>
      <h2 className="text-xl font-semibold mb-2 dark:text-white">
        Activity unavailable
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        This activity isn’t available to the public. Only{" "}
        <strong>admin-approved</strong> content can be booked.
      </p>
      {error ? <p className="mt-2 text-xs text-gray-500">({error})</p> : null}
      <div className="mt-6">
        <Button as={Link} to="/search" variant="outline">
          Back to search
        </Button>
      </div>
    </div>
  );
}
