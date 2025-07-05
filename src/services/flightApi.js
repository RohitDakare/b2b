import axios from 'axios';

// Flight API Service
const API_BASE_URL = 'https://b2b-rosy.vercel.app/api';

// Mock flight data for fallback when API is unavailable
const mockFlights = [
  {
    airline: { name: 'Air India' },
    flight: { iata: 'AI101' },
    departure: { 
      airport: 'Mumbai (BOM)', 
      scheduled: '2024-01-15T10:30:00+00:00' 
    },
    arrival: { 
      airport: 'Delhi (DEL)', 
      scheduled: '2024-01-15T12:45:00+00:00' 
    },
    flight_status: 'scheduled',
    distance: { km: 1150 },
    price: { amount: 8500, currency: 'INR' }
  },
  {
    airline: { name: 'IndiGo' },
    flight: { iata: '6E202' },
    departure: { 
      airport: 'Mumbai (BOM)', 
      scheduled: '2024-01-15T11:15:00+00:00' 
    },
    arrival: { 
      airport: 'Delhi (DEL)', 
      scheduled: '2024-01-15T13:20:00+00:00' 
    },
    flight_status: 'scheduled',
    distance: { km: 1150 },
    price: { amount: 7200, currency: 'INR' }
  },
  {
    airline: { name: 'Vistara' },
    flight: { iata: 'UK805' },
    departure: { 
      airport: 'Mumbai (BOM)', 
      scheduled: '2024-01-15T14:00:00+00:00' 
    },
    arrival: { 
      airport: 'Delhi (DEL)', 
      scheduled: '2024-01-15T16:15:00+00:00' 
    },
    flight_status: 'scheduled',
    distance: { km: 1150 },
    price: { amount: 9500, currency: 'INR' }
  }
];

export const flightApi = {
  // Search flights with parameters
  async searchFlights(searchParams) {
    try {
      const { from, to, departure, returnDate, tripType, travellers, travelClass } = searchParams;
      
      // Build query parameters
      const params = new URLSearchParams({
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        departure: departure
      });

      if (returnDate && tripType === 'ROUND_TRIP') {
        params.append('return', returnDate);
      }

      // Use axios for better error/timeout handling
      let data;
      try {
        const response = await axios.get(`${API_BASE_URL}/flights/flights?${params}`, {
          timeout: 7000, // 7 seconds timeout for latency handling
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        data = response.data;
      } catch (err) {
        console.error('Real-time API error or timeout:', err.message);
        data = null;
      }
      
      // If API returns empty data, use mock data
      if (!data || data.length === 0) {
        console.log('Using mock flight data');
        return this.processFlightData(mockFlights, searchParams);
      }

      return this.processFlightData(data, searchParams);
    } catch (error) {
      console.error('Error fetching flights:', error);
      console.log('Falling back to mock data');
      return this.processFlightData(mockFlights, searchParams);
    }
  },

  // Process and enhance flight data
  processFlightData(flights, searchParams) {
    return flights.map(flight => ({
      ...flight,
      // Add calculated fields
      duration: this.calculateDuration(flight.departure?.scheduled, flight.arrival?.scheduled),
      price: flight.price || this.generatePrice(searchParams.travelClass),
      onTimeRate: this.generateOnTimeRate(),
      // Ensure all required fields exist
      airline: flight.airline || { name: 'Unknown Airline' },
      flight: flight.flight || { iata: 'N/A' },
      departure: flight.departure || { airport: 'N/A', scheduled: 'N/A' },
      arrival: flight.arrival || { airport: 'N/A', scheduled: 'N/A' },
      flight_status: flight.flight_status || 'Unknown',
      distance: flight.distance || { km: 'N/A' }
    }));
  },

  // Calculate flight duration
  calculateDuration(departureTime, arrivalTime) {
    if (!departureTime || !arrivalTime) return 'N/A';
    
    const dep = new Date(departureTime);
    const arr = new Date(arrivalTime);
    const diffMs = arr - dep;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
  },

  // Generate price based on travel class
  generatePrice(travelClass) {
    const basePrice = 5000;
    const multipliers = {
      'ECONOMY': 1,
      'BUSINESS': 2.5,
      'FIRST': 4
    };
    
    const multiplier = multipliers[travelClass] || 1;
    const price = Math.floor(basePrice * multiplier);
    
    return {
      amount: price,
      currency: 'INR'
    };
  },

  // Generate on-time rate
  generateOnTimeRate() {
    return Math.floor(Math.random() * 21) + 80; // 80-100%
  }
};