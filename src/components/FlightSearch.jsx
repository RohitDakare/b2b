import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FlightSearch = () => {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState('ONE_WAY');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [fareType, setFareType] = useState('REGULAR');
  const [travellers, setTravellers] = useState(1);
  const [travelClass, setTravelClass] = useState('ECONOMY');

  const handleSearch = () => {
    // Redirect to /results with search data
    navigate('/results', {
      state: {
        from,
        to,
        departure,
        returnDate,
        tripType,
        fareType,
        travelClass,
        travellers
      }
    });
  };

  return (
    <div className="min-h-[80vh] bg-cover bg-center flex items-center justify-center p-4" 
      style={{ backgroundImage: "url('/bg.jpg')" }}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl">
        {/* Blur Background */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>

        {/* Foreground Form */}
        <div className="relative z-10 p-8">
          {/* Trip Type */}
          <div className="flex gap-4 mb-6">
            <button onClick={() => setTripType('ONE_WAY')} className={`px-5 py-2 rounded-full ${tripType === 'ONE_WAY' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              ONE WAY
            </button>
            <button onClick={() => setTripType('ROUND_TRIP')} className={`px-5 py-2 rounded-full ${tripType === 'ROUND_TRIP' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              ROUND TRIP
            </button>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="font-medium text-white">From</label>
              <input value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="font-medium text-white">To</label>
              <input value={to} onChange={(e) => setTo(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="font-medium text-white">Departure</label>
              <input type="date" value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            {tripType === 'ROUND_TRIP' && (
              <div>
                <label className="font-medium text-white">Return</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full border p-2 rounded" />
              </div>
            )}
            <div>
              <label className="font-medium text-white">Traveller(s)</label>
              <input type="number" min="1" value={travellers} onChange={(e) => setTravellers(parseInt(e.target.value))} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="font-medium text-white">Class</label>
              <select value={travelClass} onChange={(e) => setTravelClass(e.target.value)} className="w-full border p-2 rounded">
                <option value="ECONOMY">Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First</option>
              </select>
            </div>
          </div>

          {/* Fare Type */}
          <div className="mt-6">
            <label className="font-medium text-white">Select Fare Type</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {['REGULAR', 'STUDENT', 'SENIOR_CITIZEN', 'DEFENCE'].map((type) => (
                <button key={type} onClick={() => setFareType(type)} className={`px-4 py-1 rounded-full ${fareType === type ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-8 text-center">
            <button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
