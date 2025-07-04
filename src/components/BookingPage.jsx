import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    },
    paymentInfo: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    }
  });

  const flight = state?.flight;
  const searchParams = state?.searchParams;

  // Initialize passengers based on search params
  React.useEffect(() => {
    if (searchParams?.travellers) {
      const initialPassengers = Array.from({ length: searchParams.travellers }, (_, index) => ({
        id: index + 1,
        type: index === 0 ? 'Adult' : 'Adult',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        passportNumber: '',
        seatPreference: 'Window'
      }));
      setPassengers(initialPassengers);
    }
  }, [searchParams]);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleContactChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }));
  };

  const handlePaymentChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      paymentInfo: { ...prev.paymentInfo, [field]: value }
    }));
  };

  const calculateTotalPrice = () => {
    const basePrice = flight?.price?.amount || 0;
    const totalPrice = basePrice * (searchParams?.travellers || 1);
    const taxes = totalPrice * 0.18; // 18% GST
    return {
      basePrice: totalPrice,
      taxes: taxes,
      total: totalPrice + taxes
    };
  };

  const handleBooking = async () => {
    try {
      // Here you would typically send the booking data to your backend
      const bookingPayload = {
        flight: flight,
        passengers: passengers,
        contactInfo: bookingData.contactInfo,
        paymentInfo: bookingData.paymentInfo,
        totalAmount: calculateTotalPrice().total,
        bookingDate: new Date().toISOString()
      };

      console.log('Booking payload:', bookingPayload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to confirmation page
      navigate('/booking-confirmation', { 
        state: { 
          bookingId: 'BK' + Date.now(),
          bookingData: bookingPayload 
        } 
      });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!flight || !searchParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Invalid booking data</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const pricing = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">
            {searchParams.from} → {searchParams.to} • {formatDate(searchParams.departure)}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="ml-2">Passenger Details</span>
                </div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="ml-2">Contact Info</span>
                </div>
                <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className="ml-2">Payment</span>
                </div>
              </div>
            </div>

            {/* Step 1: Passenger Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Passenger Details</h2>
                {passengers.map((passenger, index) => (
                  <div key={passenger.id} className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
                    <h3 className="text-lg font-medium mb-4">Passenger {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={passenger.dateOfBirth}
                          onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                        <input
                          type="text"
                          value={passenger.passportNumber}
                          onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Seat Preference</label>
                        <select
                          value={passenger.seatPreference}
                          onChange={(e) => handlePassengerChange(index, 'seatPreference', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="Window">Window</option>
                          <option value="Aisle">Aisle</option>
                          <option value="Middle">Middle</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={passengers.some(p => !p.firstName || !p.lastName || !p.dateOfBirth || !p.passportNumber)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={bookingData.contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={bookingData.contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={bookingData.contactInfo.address}
                      onChange={(e) => handleContactChange('address', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows="3"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!bookingData.contactInfo.email || !bookingData.contactInfo.phone || !bookingData.contactInfo.address}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={bookingData.paymentInfo.cardholderName}
                      onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={bookingData.paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={bookingData.paymentInfo.expiryDate}
                      onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      value={bookingData.paymentInfo.cvv}
                      onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={!bookingData.paymentInfo.cardNumber || !bookingData.paymentInfo.expiryDate || !bookingData.paymentInfo.cvv || !bookingData.paymentInfo.cardholderName}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Flight Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Flight Summary</h3>
              
              {/* Flight Details */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {flight.airline?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{flight.airline?.name}</h4>
                    <p className="text-sm text-gray-500">Flight {flight.flight?.iata}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">From:</span>
                    <span className="text-sm font-medium">{flight.departure?.airport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">To:</span>
                    <span className="text-sm font-medium">{flight.arrival?.airport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-medium">{formatDate(flight.departure?.scheduled)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time:</span>
                    <span className="text-sm font-medium">
                      {formatTime(flight.departure?.scheduled)} - {formatTime(flight.arrival?.scheduled)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{flight.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Class:</span>
                    <span className="text-sm font-medium">{searchParams?.travelClass}</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Fare ({searchParams?.travellers} × ₹{flight.price?.amount?.toLocaleString()})</span>
                  <span className="text-sm">₹{pricing.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxes & Fees (18%)</span>
                  <span className="text-sm">₹{pricing.taxes.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-semibold text-lg text-green-600">₹{pricing.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 