const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  id: Number,
  username: String,
  createdAt: { type: Date, default: new Date() },
}));
module.exports = User;
