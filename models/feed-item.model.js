const mongoose = require('mongoose');

const FeedItem = mongoose.model('FeedItem', new mongoose.Schema({
  text: String,
  comments: [{ text: String, owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}));
module.exports = FeedItem;
