const mongoose = require('mongoose');
const UserModel = require('./user.model');

const FeedItem = mongoose.model('FeedItem', new mongoose.Schema({
  id: Number,
  text: String,
  comments: Array,
  owner: Number,
}));
module.exports = FeedItem;
