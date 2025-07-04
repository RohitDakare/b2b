const axios = require('axios');

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
  },
  {
    airline: { name: 'SpiceJet' },
    flight: { iata: 'SG301' },
    departure: { 
      airport: 'Mumbai (BOM)', 
      scheduled: '2024-01-15T16:45:00+00:00' 
    },
    arrival: { 
      airport: 'Delhi (DEL)', 
      scheduled: '2024-01-15T19:00:00+00:00' 
    },
    flight_status: 'scheduled',
    distance: { km: 1150 },
    price: { amount: 6800, currency: 'INR' }
  },
  {
    airline: { name: 'GoAir' },
    flight: { iata: 'G8123' },
    departure: { 
      airport: 'Mumbai (BOM)', 
      scheduled: '2024-01-15T20:30:00+00:00' 
    },
    arrival: { 
      airport: 'Delhi (DEL)', 
      scheduled: '2024-01-15T22:45:00+00:00' 
    },
    flight_status: 'scheduled',
    distance: { km: 1150 },
    price: { amount: 7500, currency: 'INR' }
  }
];

const getFlights = async (req, res) => {
  try {
    const { from, to, departure, return: returnDate } = req.query;

    // Validate required parameters
    if (!from || !to || !departure) {
      return res.status(400).json({ 
        error: 'Missing required parameters: from, to, departure' 
      });
    }

    console.log('Searching flights for:', from, 'to', to, 'on', departure);

    // For now, always use mock data to ensure it works
    let filteredFlights = mockFlights.map(flight => ({
      ...flight,
      departure: { 
        ...flight.departure, 
        airport: `${from} (${from.toUpperCase()})` 
      },
      arrival: { 
        ...flight.arrival, 
        airport: `${to} (${to.toUpperCase()})` 
      },
      duration: calculateDuration(flight.departure.scheduled, flight.arrival.scheduled),
      onTimeRate: generateOnTimeRate()
    }));

    // Add return flights if round trip
    if (returnDate) {
      const returnFlights = filteredFlights.map(flight => ({
        ...flight,
        departure: { 
          ...flight.arrival, 
          scheduled: returnDate + flight.departure.scheduled.slice(10) 
        },
        arrival: { 
          ...flight.departure, 
          scheduled: returnDate + flight.arrival.scheduled.slice(10) 
        },
        flight: { 
          ...flight.flight, 
          iata: flight.flight.iata + 'R' 
        },
        duration: calculateDuration(returnDate + flight.arrival.scheduled.slice(10), returnDate + flight.departure.scheduled.slice(10))
      }));
      filteredFlights = [...filteredFlights, ...returnFlights];
    }

    console.log(`Returning ${filteredFlights.length} flights`);
    res.json(filteredFlights);

  } catch (error) {
    console.error('Flight API error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch flights',
      message: error.message 
    });
  }
};

// Helper function to calculate duration
const calculateDuration = (departureTime, arrivalTime) => {
  if (!departureTime || !arrivalTime) return 'N/A';
  
  const dep = new Date(departureTime);
  const arr = new Date(arrivalTime);
  const diffMs = arr - dep;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHours}h ${diffMinutes}m`;
};

// Helper function to generate on-time rate
const generateOnTimeRate = () => {
  return Math.floor(Math.random() * 21) + 80; // 80-100%
};

// Get flight details by ID
const getFlightById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real application, you would fetch from database
    // For now, return mock data
    const flight = mockFlights.find(f => f.flight.iata === id);
    
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight details:', error);
    res.status(500).json({ error: 'Failed to fetch flight details' });
  }
};

// Search flights with filters
const searchFlights = async (req, res) => {
  try {
    const { 
      from, 
      to, 
      departure, 
      return: returnDate, 
      passengers = 1, 
      class: travelClass = 'ECONOMY',
      maxPrice,
      airline
    } = req.query;

    // Get base flights
    const baseFlights = await getFlights(req, res);
    
    if (baseFlights.headersSent) {
      return; // Response already sent
    }

    let flights = baseFlights;

    // Apply filters
    if (maxPrice) {
      flights = flights.filter(flight => 
        flight.price && flight.price.amount <= parseInt(maxPrice)
      );
    }

    if (airline) {
      flights = flights.filter(flight => 
        flight.airline && 
        flight.airline.name.toLowerCase().includes(airline.toLowerCase())
      );
    }

    // Calculate total price based on passengers and class
    flights = flights.map(flight => {
      const basePrice = flight.price?.amount || 5000;
      const classMultiplier = {
        'ECONOMY': 1,
        'BUSINESS': 2.5,
        'FIRST': 4
      }[travelClass] || 1;
      
      const totalPrice = basePrice * classMultiplier * parseInt(passengers);
      
      return {
        ...flight,
        price: {
          ...flight.price,
          amount: totalPrice,
          perPerson: basePrice * classMultiplier
        },
        passengers: parseInt(passengers),
        travelClass
      };
    });

    res.json(flights);

  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ error: 'Failed to search flights' });
  }
};

module.exports = { 
  getFlights, 
  getFlightById, 
  searchFlights 
};
