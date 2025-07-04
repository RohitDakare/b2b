import React, { useState } from 'react';

const airlinesList = [
  'IndiGo',
  'Air India',
  'Vistara',
  'SpiceJet',
  'GoAir',
  'AirAsia India',
];

const departureAirports = [
  'Mumbai (BOM)',
  'Delhi (DEL)',
  'Bangalore (BLR)',
  'Hyderabad (HYD)',
  'Chennai (MAA)',
];

const timeSlots = [
  { label: 'Before 6 AM', value: 'before6' },
  { label: '6 AM to 12 PM', value: '6to12' },
  { label: '12 PM to 6 PM', value: '12to18' },
  { label: 'After 6 PM', value: 'after18' },
];

const stopsOptions = [
  { label: 'Non Stop', value: 'nonstop' },
  { label: '1 Stop', value: '1stop' },
  { label: '2+ Stops', value: '2plus' },
];

const popularFilters = [
  { label: 'Non Stop', value: 'nonstop' },
  { label: 'Hide Nearby Airports', value: 'hideNearby' },
  { label: 'Refundable Fares', value: 'refundable' },
];

const MIN_PRICE = 2000;
const MAX_PRICE = 20000;

const FlightSearchFilter = ({
  filters,
  setFilters,
  onClearAll,
  isRoundTrip = false,
  direction = 'both',
  setDirection,
}) => {
  // Remove filter tag
  const removeFilter = (category, value) => {
    setFilters((prev) => {
      if (Array.isArray(prev[category])) {
        return { ...prev, [category]: prev[category].filter((v) => v !== value) };
      } else {
        return { ...prev, [category]: '' };
      }
    });
  };

  // Handle checkbox change
  const handleCheckbox = (category, value) => {
    setFilters((prev) => {
      const arr = prev[category];
      if (arr.includes(value)) {
        return { ...prev, [category]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [category]: [...arr, value] };
      }
    });
  };

  // Handle radio/select change
  const handleSelect = (category, value) => {
    setFilters((prev) => ({ ...prev, [category]: value }));
  };

  // Handle price slider (single value)
  const handlePriceChange = (e) => {
    const val = Number(e.target.value);
    setFilters((prev) => ({ ...prev, price: val }));
  };

  // Applied filters as tags
  const activeTags = [];
  Object.entries(filters).forEach(([cat, val]) => {
    if (Array.isArray(val)) {
      val.forEach((v) => activeTags.push({ cat, value: v }));
    } else if (val && cat !== 'price') {
      activeTags.push({ cat, value: val });
    }
  });
  if (filters.price && filters.price !== MAX_PRICE) {
    activeTags.push({ cat: 'price', value: `Up to ₹${filters.price}` });
  }

  return (
    <aside className="w-full md:w-72 bg-white rounded-2xl shadow-lg p-6 mb-6 md:mb-0 md:mr-8 sticky top-6 max-h-[90vh] overflow-y-auto">
      {/* Outbound/Return Toggle for Round Trip */}
      {isRoundTrip && setDirection && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Filter Direction</h3>
          <div className="flex gap-2" role="group" aria-label="Filter Direction">
            <button
              className={`px-3 py-1 rounded-full border ${direction === 'both' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setDirection('both')}
              aria-label="Show filters for both outbound and return flights"
            >
              Both
            </button>
            <button
              className={`px-3 py-1 rounded-full border ${direction === 'outbound' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setDirection('outbound')}
              aria-label="Show filters for outbound flights only"
            >
              Outbound
            </button>
            <button
              className={`px-3 py-1 rounded-full border ${direction === 'return' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setDirection('return')}
              aria-label="Show filters for return flights only"
            >
              Return
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">Currently filtering: <span className="font-semibold">{direction.charAt(0).toUpperCase() + direction.slice(1)}</span></div>
        </div>
      )}

      {/* Applied Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Applied Filters</h3>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={onClearAll}
            disabled={activeTags.length === 0}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeTags.length === 0 ? (
            <span className="text-gray-400 text-sm">No filters applied</span>
          ) : (
            activeTags.map((tag, i) => (
              <span
                key={tag.cat + tag.value}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-1"
              >
                {tag.value}
                <button
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  onClick={() => removeFilter(tag.cat, tag.value)}
                  aria-label={`Remove filter ${tag.value}`}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Popular Filters */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Popular Filters</h3>
        <div className="flex flex-col gap-2">
          {popularFilters.map((f) => (
            <label key={f.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.popular.includes(f.value)}
                onChange={() => handleCheckbox('popular', f.value)}
                className="accent-blue-500"
                aria-label={`Filter by ${f.label}`}
              />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Specific Airlines (Popular) */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Specific Airlines</h3>
        <div className="flex flex-col gap-2">
          {['IndiGo', 'Air India'].map((airline) => (
            <label key={airline} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => handleCheckbox('airlines', airline)}
                className="accent-blue-500"
                aria-label={`Filter by airline ${airline}`}
              />
              <span>{airline}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time Preferences */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Departure Time Preferences</h3>
        <div className="flex flex-col gap-2">
          {timeSlots.map((slot) => (
            <label key={slot.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.depTime.includes(slot.value)}
                onChange={() => handleCheckbox('depTime', slot.value)}
                className="accent-blue-500"
                aria-label={`Filter by departure time ${slot.label}`}
              />
              <span>{slot.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Airports */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Departure Airports</h3>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          value={filters.depAirport}
          onChange={(e) => handleSelect('depAirport', e.target.value)}
          aria-label="Filter by departure airport"
        >
          <option value="">All Airports</option>
          {departureAirports.map((airport) => (
            <option key={airport} value={airport}>{airport}</option>
          ))}
        </select>
      </div>

      {/* One Way Price */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">One Way Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={filters.price}
            onChange={handlePriceChange}
            className="w-full accent-blue-500"
            aria-label="Filter by price"
          />
          <span className="text-sm">Up to ₹{filters.price}</span>
        </div>
      </div>

      {/* Stops */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Stops</h3>
        <div className="flex flex-col gap-2">
          {stopsOptions.map((stop) => (
            <label key={stop.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.stops.includes(stop.value)}
                onChange={() => handleCheckbox('stops', stop.value)}
                className="accent-blue-500"
                aria-label={`Filter by stops: ${stop.label}`}
              />
              <span>{stop.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Departure Time</h3>
        <div className="flex flex-col gap-2">
          {timeSlots.map((slot) => (
            <label key={slot.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.depTime.includes(slot.value)}
                onChange={() => handleCheckbox('depTime', slot.value)}
                className="accent-blue-500"
                aria-label={`Filter by departure time ${slot.label}`}
              />
              <span>{slot.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Arrival Time */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Arrival Time</h3>
        <div className="flex flex-col gap-2">
          {timeSlots.map((slot) => (
            <label key={slot.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.arrTime.includes(slot.value)}
                onChange={() => handleCheckbox('arrTime', slot.value)}
                className="accent-blue-500"
                aria-label={`Filter by arrival time ${slot.label}`}
              />
              <span>{slot.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Airlines</h3>
        <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
          {airlinesList.map((airline) => (
            <label key={airline} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => handleCheckbox('airlines', airline)}
                className="accent-blue-500"
                aria-label={`Filter by airline ${airline}`}
              />
              <span>{airline}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FlightSearchFilter; 