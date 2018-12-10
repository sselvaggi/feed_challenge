const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  createdAt: { type: Date, default: new Date() },
}));
module.exports = User;
