// routes/flightRoutes.js
const express = require("express");
const router = express.Router();
const { getFlights, getFlightById, searchFlights } = require("../controllers/flightController");

// Get flights with search parameters
router.get("/flights", getFlights); // uses ?from=MUM&to=DEL&departure=2025-07-01

// Get flight details by ID
router.get("/flights/:id", getFlightById);

// Search flights with advanced filters
router.get("/search", searchFlights); // uses ?from=MUM&to=DEL&departure=2025-07-01&passengers=2&class=BUSINESS&maxPrice=10000

module.exports = router;
