const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  from: String,
  to: String,
  date: Date,
  fareType: String,
  travelClass: String,
});
module.exports = mongoose.model('Ticket', ticketSchema);
