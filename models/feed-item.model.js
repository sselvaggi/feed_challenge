const mongoose = require('mongoose');

const FeedItemSchema = new mongoose.Schema({
  id: Number,
  text: String,
  comments: Array,
  owner: Number,
});
FeedItemSchema.methods = {
  async getOwner() {
    const owner = await new Promise((resolve, reject) => {
      this.model('User').findOne({ id: this.owner }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    return owner;
  },
};
FeedItemSchema.statics = {
  async getAll(filter) {
    const list = await new Promise((resolve, reject) => {
      this.model('FeedItem').find(filter, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    let feeds = list.map(async (feed) => {
      const owner = await feed.getOwner();
      const { text } = feed;
      return {
        owner,
        text,
      };
    });

    feeds = await Promise.all(feeds);
    return feeds.filter(x => x.owner);;
  },
};
const FeedItem = mongoose.model('FeedItem', FeedItemSchema);
module.exports = FeedItem;
