import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { flightApi } from '../services/flightApi';
import FlightSearchFilter from './FlightSearchFilter';

const MIN_PRICE = 2000;
const MAX_PRICE = 20000;

const defaultFilters = {
  popular: [],
  airlines: [],
  stops: [],
  depTime: [],
  arrTime: [],
  depAirport: '',
  price: MAX_PRICE, // single value
};

const stopsMap = {
  nonstop: 0,
  '1stop': 1,
  '2plus': 2,
};

const timeSlotRanges = {
  before6: [0, 6],
  '6to12': [6, 12],
  '12to18': [12, 18],
  after18: [18, 24],
};

function getHour(dateString) {
  if (!dateString) return null;
  return new Date(dateString).getHours();
}

function isReturnFlight(flight, state) {
  // Return flight: from = state.to, to = state.from, date = state.returnDate
  return (
    state.tripType === 'ROUND_TRIP' &&
    flight.departure?.airport?.includes(state.to) &&
    flight.arrival?.airport?.includes(state.from)
  );
}

function isOutboundFlight(flight, state) {
  // Outbound: from = state.from, to = state.to, date = state.departure
  return (
    flight.departure?.airport?.includes(state.from) &&
    flight.arrival?.airport?.includes(state.to)
  );
}

const FlightResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [filterClass, setFilterClass] = useState('all');
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [direction, setDirection] = useState('both'); // outbound, return, both

  useEffect(() => {
    if (!state) {
      setError('❌ No search data provided.');
      setLoading(false);
      return;
    }

    const fetchFlights = async () => {
      try {
        setLoading(true);
        const flightData = await flightApi.searchFlights(state);
        setFlights(flightData);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('🚨 Error fetching flight data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [state]);

  // Filter and sort flights (per direction)
  const filterFlights = (flightsArr, which) => {
    let filtered = flightsArr;
    // Only apply filters if direction matches or is 'both'
    if (direction === 'both' || direction === which) {
      if (filters.airlines.length > 0) {
        filtered = filtered.filter(f => filters.airlines.includes(f.airline?.name));
      }
      if (filters.stops.length > 0) {
        filtered = filtered.filter(f => {
          if (filters.stops.includes('nonstop')) return true;
          return false;
        });
      }
      if (filters.depAirport) {
        filtered = filtered.filter(f => f.departure?.airport?.includes(filters.depAirport));
      }
      filtered = filtered.filter(f => {
        const price = f.price?.amount || 0;
        return price >= MIN_PRICE && price <= filters.price;
      });
      if (filters.depTime.length > 0) {
        filtered = filtered.filter(f => {
          const hour = getHour(f.departure?.scheduled);
          return filters.depTime.some(slot => {
            const [start, end] = timeSlotRanges[slot];
            return hour >= start && hour < end;
          });
        });
      }
      if (filters.arrTime.length > 0) {
        filtered = filtered.filter(f => {
          const hour = getHour(f.arrival?.scheduled);
          return filters.arrTime.some(slot => {
            const [start, end] = timeSlotRanges[slot];
            return hour >= start && hour < end;
          });
        });
      }
      if (filterClass !== 'all') {
        filtered = filtered.filter(flight => flight.travelClass === filterClass || !flight.travelClass);
      }
    }
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.price?.amount || 0) - (b.price?.amount || 0);
        case 'duration':
          return (a.duration || '0h 0m').localeCompare(b.duration || '0h 0m');
        case 'departure':
          return new Date(a.departure?.scheduled || 0) - new Date(b.departure?.scheduled || 0);
        default:
          return 0;
      }
    });
  };

  // Split flights for round trip
  let outboundFlights = flights;
  let returnFlights = [];
  if (state?.tripType === 'ROUND_TRIP') {
    outboundFlights = filterFlights(flights.filter(f => isOutboundFlight(f, state)), 'outbound');
    returnFlights = filterFlights(flights.filter(f => isReturnFlight(f, state)), 'return');
  } else {
    outboundFlights = filterFlights(flights, 'outbound');
  }

  // Price calculation
  const getTotalFare = () => {
    let total = 0;
    if (selectedOutbound) total += selectedOutbound.price?.amount || 0;
    if (selectedReturn) total += selectedReturn.price?.amount || 0;
    if (discount > 0) total = Math.max(0, total - discount);
    return total * (state?.travellers || 1);
  };

  // Promo code logic (simple demo)
  const handleApplyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'SAVE10'.toLowerCase()) {
      setDiscount(500);
      setPromoApplied(true);
    } else {
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const handleBookNow = () => {
    if (state?.tripType === 'ROUND_TRIP') {
      if (!selectedOutbound || !selectedReturn) return alert('Please select both outbound and return flights.');
      navigate('/booking', {
        state: {
          outbound: selectedOutbound,
          return: selectedReturn,
          searchParams: state,
          totalFare: getTotalFare(),
        },
      });
    } else {
      if (!selectedOutbound) return alert('Please select a flight.');
      navigate('/booking', {
        state: {
          flight: selectedOutbound,
          searchParams: state,
          totalFare: getTotalFare(),
        },
      });
    }
  };

  const handleClearAll = () => {
    setFilters(defaultFilters);
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Searching for flights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚨</div>
          <p className="text-xl text-red-600 font-semibold mb-4">{error}</p>
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

  // --- FLIGHT CARD ---
  const FlightCard = ({ flight, selected, onSelect, type }) => (
    <div
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow relative ${selected ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
      tabIndex={0}
      aria-label={`Flight ${flight.flight?.iata}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Airline logo placeholder */}
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">
                {flight.airline?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {flight.airline?.name || 'Unknown Airline'}
              </h3>
              <p className="text-sm text-gray-500">
                Flight {flight.flight?.iata || 'N/A'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ₹{flight.price?.amount?.toLocaleString() || 'N/A'}
            </div>
            <p className="text-sm text-gray-500">per adult</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Departure</div>
            <div className="font-semibold">{formatTime(flight.departure?.scheduled)}</div>
            <div className="text-sm text-gray-600">{flight.departure?.airport}</div>
            <div className="text-xs text-gray-500">{formatDate(flight.departure?.scheduled)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Duration</div>
            <div className="font-semibold">{flight.duration || 'N/A'}</div>
            <div className="text-xs text-gray-500">{flight.stops || 'Non-stop'}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Arrival</div>
            <div className="font-semibold">{formatTime(flight.arrival?.scheduled)}</div>
            <div className="text-sm text-gray-600">{flight.arrival?.airport}</div>
            <div className="text-xs text-gray-500">{formatDate(flight.arrival?.scheduled)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <input
            type="radio"
            name={type}
            checked={selected}
            onChange={onSelect}
            className="accent-blue-500 w-5 h-5"
            aria-label={`Select ${type} flight`}
          />
          <span className="text-sm">Select {type === 'outbound' ? 'Outbound' : 'Return'} Flight</span>
        </div>
      </div>
      {selected && <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Selected</div>}
    </div>
  );

  // --- SUMMARY ---
  const Summary = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6 md:top-6 z-10 md:relative md:w-auto w-full fixed bottom-0 left-0 right-0 md:rounded-lg md:shadow-lg md:p-6 border-t md:border-0">
      <h3 className="text-lg font-semibold mb-4">Selected Flight Summary</h3>
      <div className="mb-2 text-sm text-gray-600">{state?.travellers || 1} Traveler(s) • {state?.travelClass || 'Economy'}</div>
      <div className="mb-4">
        <div className="font-medium text-gray-700 mb-2">Outbound Flight</div>
        {selectedOutbound ? (
          <div className="text-sm mb-2">
            <span className="font-semibold">{selectedOutbound.airline?.name}</span> • {formatTime(selectedOutbound.departure?.scheduled)} → {formatTime(selectedOutbound.arrival?.scheduled)}<br />
            {selectedOutbound.departure?.airport} → {selectedOutbound.arrival?.airport}<br />
            ₹{selectedOutbound.price?.amount?.toLocaleString()} per adult
          </div>
        ) : <div className="text-gray-400 text-sm">No outbound flight selected</div>}
      </div>
      {state?.tripType === 'ROUND_TRIP' && (
        <div className="mb-4">
          <div className="font-medium text-gray-700 mb-2">Return Flight</div>
          {selectedReturn ? (
            <div className="text-sm mb-2">
              <span className="font-semibold">{selectedReturn.airline?.name}</span> • {formatTime(selectedReturn.departure?.scheduled)} → {formatTime(selectedReturn.arrival?.scheduled)}<br />
              {selectedReturn.departure?.airport} → {selectedReturn.arrival?.airport}<br />
              ₹{selectedReturn.price?.amount?.toLocaleString()} per adult
            </div>
          ) : <div className="text-gray-400 text-sm">No return flight selected</div>}
        </div>
      )}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Fare</span>
          <span className="text-lg font-bold text-green-600">₹{getTotalFare().toLocaleString()}</span>
        </div>
        {promoApplied && <div className="text-green-600 text-xs mt-1">Promo applied: {promoCode} (-₹{discount})</div>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
            placeholder="Enter promo code"
            disabled={promoApplied}
          />
          <button
            onClick={handleApplyPromo}
            className={`px-4 py-2 rounded-lg text-white ${promoApplied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}
            disabled={promoApplied}
          >
            {promoApplied ? 'Applied' : 'Apply'}
          </button>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleBookNow}
          className={`flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 font-medium ${state?.tripType === 'ROUND_TRIP' && (!selectedOutbound || !selectedReturn) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={state?.tripType === 'ROUND_TRIP' ? (!selectedOutbound || !selectedReturn) : !selectedOutbound}
        >
          Book Now
        </button>
        <button
          className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 font-medium"
        >
          Lock Price
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Flight Results
              </h1>
              {state && (
                <p className="text-gray-600">
                  {state.from} → {state.to} • {formatDate(state.departure)}
                  {state.tripType === 'ROUND_TRIP' && state.returnDate && 
                    ` • Return: ${formatDate(state.returnDate)}`
                  }
                </p>
              )}
            </div>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 md:mt-0 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              New Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Results */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <div className="md:w-72 w-full flex-shrink-0">
          <FlightSearchFilter
            filters={filters}
            setFilters={setFilters}
            onClearAll={handleClearAll}
            isRoundTrip={state?.tripType === 'ROUND_TRIP'}
            direction={direction}
            setDirection={setDirection}
          />
        </div>

        {/* Results Section */}
        <div className="flex-1 min-w-0 flex flex-col lg:flex-row gap-8">
          {/* Outbound and Return Columns */}
          <div className={`flex-1 ${state?.tripType === 'ROUND_TRIP' ? 'lg:w-1/2' : ''} ${direction === 'outbound' ? 'ring-2 ring-blue-400' : ''}`}>
            <h2 className="text-lg font-semibold mb-4">{state?.tripType === 'ROUND_TRIP' ? 'Outbound Flights' : 'Available Flights'}</h2>
            <div className="grid gap-6">
              {outboundFlights.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-6xl mb-4">✈️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No flights found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or dates.
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Modify Search
                  </button>
                </div>
              ) : (
                outboundFlights.map((flight, index) => (
                  <FlightCard
                    key={index}
                    flight={flight}
                    selected={selectedOutbound && selectedOutbound.flight?.iata === flight.flight?.iata}
                    onSelect={() => setSelectedOutbound(flight)}
                    type="outbound"
                  />
                ))
              )}
            </div>
          </div>
          {state?.tripType === 'ROUND_TRIP' && (
            <div className={`flex-1 lg:w-1/2 ${direction === 'return' ? 'ring-2 ring-blue-400' : ''}`}>
              <h2 className="text-lg font-semibold mb-4">Return Flights</h2>
              <div className="grid gap-6">
                {returnFlights.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-6xl mb-4">✈️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No return flights found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or dates.
                    </p>
                  </div>
                ) : (
                  returnFlights.map((flight, index) => (
                    <FlightCard
                      key={index}
                      flight={flight}
                      selected={selectedReturn && selectedReturn.flight?.iata === flight.flight?.iata}
                      onSelect={() => setSelectedReturn(flight)}
                      type="return"
                    />
                  ))
                )}
              </div>
            </div>
          )}
          {/* Summary Sidebar (sticky on desktop, fixed on mobile) */}
          <div className="w-full lg:w-80 mt-8 lg:mt-0 lg:ml-8">
            <Summary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
