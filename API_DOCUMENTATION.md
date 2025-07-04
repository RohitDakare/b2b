# Flight Booking API Documentation

## Overview
This API provides flight search and booking functionality for the Tripar flight booking platform. It includes both real-time flight data from Aviation Stack API and fallback mock data for development and testing.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API doesn't require authentication for flight search endpoints. Admin endpoints may require authentication in the future.

## Endpoints

### 1. Search Flights
**GET** `/flights/flights`

Search for available flights based on route and date.

#### Query Parameters
- `from` (required): Departure airport code (e.g., "MUM", "DEL")
- `to` (required): Arrival airport code (e.g., "DEL", "BOM")
- `departure` (required): Departure date in YYYY-MM-DD format
- `return` (optional): Return date for round trips in YYYY-MM-DD format

#### Example Request
```
GET /api/flights/flights?from=MUM&to=DEL&departure=2024-01-15
```

#### Example Response
```json
[
  {
    "airline": {
      "name": "Air India"
    },
    "flight": {
      "iata": "AI101"
    },
    "departure": {
      "airport": "MUM (MUM)",
      "scheduled": "2024-01-15T10:30:00+00:00"
    },
    "arrival": {
      "airport": "DEL (DEL)",
      "scheduled": "2024-01-15T12:45:00+00:00"
    },
    "flight_status": "scheduled",
    "distance": {
      "km": 1150
    },
    "price": {
      "amount": 8500,
      "currency": "INR"
    },
    "duration": "2h 15m",
    "onTimeRate": 95
  }
]
```

### 2. Get Flight Details
**GET** `/flights/flights/:id`

Get detailed information about a specific flight.

#### Path Parameters
- `id`: Flight IATA code (e.g., "AI101")

#### Example Request
```
GET /api/flights/flights/AI101
```

#### Example Response
```json
{
  "airline": {
    "name": "Air India"
  },
  "flight": {
    "iata": "AI101"
  },
  "departure": {
    "airport": "Mumbai (BOM)",
    "scheduled": "2024-01-15T10:30:00+00:00"
  },
  "arrival": {
    "airport": "Delhi (DEL)",
    "scheduled": "2024-01-15T12:45:00+00:00"
  },
  "flight_status": "scheduled",
  "distance": {
    "km": 1150
  },
  "price": {
    "amount": 8500,
    "currency": "INR"
  }
}
```

### 3. Advanced Flight Search
**GET** `/flights/search`

Search flights with advanced filters including price, class, and passenger count.

#### Query Parameters
- `from` (required): Departure airport code
- `to` (required): Arrival airport code
- `departure` (required): Departure date
- `return` (optional): Return date for round trips
- `passengers` (optional): Number of passengers (default: 1)
- `class` (optional): Travel class - ECONOMY, BUSINESS, FIRST (default: ECONOMY)
- `maxPrice` (optional): Maximum price filter
- `airline` (optional): Airline name filter

#### Example Request
```
GET /api/flights/search?from=MUM&to=DEL&departure=2024-01-15&passengers=2&class=BUSINESS&maxPrice=20000
```

#### Example Response
```json
[
  {
    "airline": {
      "name": "Air India"
    },
    "flight": {
      "iata": "AI101"
    },
    "departure": {
      "airport": "MUM (MUM)",
      "scheduled": "2024-01-15T10:30:00+00:00"
    },
    "arrival": {
      "airport": "DEL (DEL)",
      "scheduled": "2024-01-15T12:45:00+00:00"
    },
    "flight_status": "scheduled",
    "distance": {
      "km": 1150
    },
    "price": {
      "amount": 42500,
      "currency": "INR",
      "perPerson": 21250
    },
    "passengers": 2,
    "travelClass": "BUSINESS"
  }
]
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required parameters: from, to, departure"
}
```

### 404 Not Found
```json
{
  "error": "Flight not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch flights",
  "message": "Detailed error message"
}
```

## Data Sources

### Real-time Data
When available, the API fetches real flight data from the Aviation Stack API. This requires:
- Valid `AVIATION_API_KEY` environment variable
- Internet connectivity
- Valid API quota

### Mock Data
When real-time data is unavailable, the API serves mock flight data including:
- 5 major Indian airlines (Air India, IndiGo, Vistara, SpiceJet, GoAir)
- Realistic pricing and timing
- Common domestic routes

## Environment Variables

Create a `.env` file in the `flight-admin-panel` directory:

```env
PORT=5000
AVIATION_API_KEY=your_aviation_stack_api_key_here
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd flight-admin-panel
   npm install
   ```

2. **Set Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Aviation Stack API key (optional)

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Test the API**
   ```bash
   curl "http://localhost:5000/api/flights/flights?from=MUM&to=DEL&departure=2024-01-15"
   ```

## Frontend Integration

The frontend React application includes:

### Components
- `FlightSearch.jsx`: Search form for flights
- `FlightResults.jsx`: Display search results with filtering and sorting
- `BookingPage.jsx`: Multi-step booking process
- `BookingConfirmation.jsx`: Booking confirmation page

### API Service
- `src/services/flightApi.js`: Centralized API service with error handling and fallback data

### Features
- Real-time flight search
- Price calculation based on class and passengers
- Sorting and filtering options
- Responsive design
- Booking workflow
- Error handling and loading states

## Development Notes

### Mock Data Structure
The mock data includes realistic flight information:
- Airline names and flight numbers
- Departure and arrival times
- Airport codes and names
- Pricing information
- Flight status and distance

### Error Handling
- Graceful fallback to mock data when API is unavailable
- Comprehensive error messages
- Loading states for better UX
- Input validation

### Performance
- Request timeouts (10 seconds)
- Efficient data processing
- Minimal API calls
- Caching considerations for production

## Future Enhancements

1. **Database Integration**
   - Store bookings and user data
   - Flight availability tracking
   - Booking history

2. **Authentication**
   - User registration and login
   - JWT token authentication
   - Role-based access control

3. **Payment Integration**
   - Payment gateway integration
   - Booking confirmation emails
   - Invoice generation

4. **Real-time Updates**
   - WebSocket connections for flight status
   - Price change notifications
   - Booking confirmations

5. **Advanced Features**
   - Seat selection
   - Meal preferences
   - Baggage options
   - Multi-city bookings 