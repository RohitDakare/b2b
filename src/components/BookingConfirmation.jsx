import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const bookingId = state?.bookingId;
  const bookingData = state?.bookingData;

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

  if (!bookingId || !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Invalid booking confirmation</h2>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Success Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-4">Your flight has been successfully booked</p>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg inline-block">
              <span className="font-semibold">Booking ID:</span> {bookingId}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Flight Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {bookingData.flight.airline?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{bookingData.flight.airline?.name}</h3>
                    <p className="text-gray-500">Flight {bookingData.flight.flight?.iata}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Departure</div>
                    <div className="font-semibold">{formatTime(bookingData.flight.departure?.scheduled)}</div>
                    <div className="text-sm text-gray-600">{bookingData.flight.departure?.airport}</div>
                    <div className="text-xs text-gray-500">{formatDate(bookingData.flight.departure?.scheduled)}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-semibold">{bookingData.flight.duration}</div>
                    <div className="text-xs text-gray-500">Direct Flight</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Arrival</div>
                    <div className="font-semibold">{formatTime(bookingData.flight.arrival?.scheduled)}</div>
                    <div className="text-sm text-gray-600">{bookingData.flight.arrival?.airport}</div>
                    <div className="text-xs text-gray-500">{formatDate(bookingData.flight.arrival?.scheduled)}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Confirmed
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Class:</span>
                  <span className="ml-2 font-medium">Economy</span>
                </div>
                <div>
                  <span className="text-gray-500">Passengers:</span>
                  <span className="ml-2 font-medium">{bookingData.passengers.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="ml-2 font-medium text-green-600">₹{bookingData.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
              <div className="space-y-4">
                {bookingData.passengers.map((passenger, index) => (
                  <div key={passenger.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Passenger {index + 1}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="ml-2 font-medium">{passenger.firstName} {passenger.lastName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">DOB:</span>
                        <span className="ml-2 font-medium">{formatDate(passenger.dateOfBirth)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Passport:</span>
                        <span className="ml-2 font-medium">{passenger.passportNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Seat:</span>
                        <span className="ml-2 font-medium">{passenger.seatPreference}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 font-medium">{bookingData.contactInfo.email}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 font-medium">{bookingData.contactInfo.phone}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500">Address:</span>
                  <span className="ml-2 font-medium">{bookingData.contactInfo.address}</span>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• Please arrive at the airport at least 2 hours before departure</li>
                <li>• Carry a valid government ID and passport for international flights</li>
                <li>• Check-in online 24 hours before departure</li>
                <li>• Keep your booking confirmation handy</li>
                <li>• Contact airline for any schedule changes</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID</span>
                  <span className="font-medium">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date</span>
                  <span className="font-medium">{formatDate(bookingData.bookingDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-green-600">₹{bookingData.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => window.print()}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Download Ticket
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Book Another Flight
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
                >
                  Contact Support
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-2">Our customer support is available 24/7</p>
                <p className="text-sm text-gray-600">📞 +1-800-FLIGHTS</p>
                <p className="text-sm text-gray-600">✉️ support@tripar.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 