import axios from 'axios';

const API_BASE_URL = 'https://b2b-rosy.vercel.app/api';

// Mock flight data for fallback
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
  }
];

export const realFlightService = {
  async getFlightById(flightId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/flights/${flightId}`, {
        timeout: 7000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.data) {
        console.log('No flight data received, using mock data');
        return mockFlights[0];
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching real flight by ID:', error);
      console.log('Falling back to mock data');
      return mockFlights[0];
    }
  },
  async searchFlights(params) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_BASE_URL}/flights/flights?${query}`, {
        timeout: 7000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.data || response.data.length === 0) {
        console.log('No flights found, using mock data');
        return mockFlights;
      }
      return response.data;
    } catch (error) {
      console.error('Error searching real flights:', error);
      console.log('Falling back to mock data');
      return mockFlights;
    }
  }
};