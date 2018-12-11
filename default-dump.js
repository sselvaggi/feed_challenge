require('dotenv').config();
const mongoose = require('mongoose');
const UserModel = require('./models/user.model');
const FeedItemModel = require('./models/feed-item.model');
const FeedData = require('./FeedItems.json');
const UserData = require('./Users.json');
const CommentsData = require('./Comments.json');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {});

(async () => {
  await Promise.all([UserModel.deleteMany({}), FeedItemModel.deleteMany({})]);
  const usersById = {};
  const allUserPromises = [];
  UserData.forEach((userData) => {
    const user = UserModel({
      id: userData.userid,
      username: userData.username,
      createdAt: userData.createdAt,
    });
    usersById[userData.userid] = user;
    allUserPromises.push(new Promise((resolve, reject) => {
      user.save((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }));
  });
  await Promise.all(allUserPromises);
  const allFeedItemPromises = [];
  FeedData.forEach((feedData) => {
    const comments = CommentsData.filter(comment => (comment.feedid === feedData.feedid && comment.userid && usersById[comment.userid]))
      .map(comment => ({
        text: comment.commentText,
        owner: usersById[comment.userid].id,
      }));
    if (usersById[feedData.userid]) {
      const feedItem = FeedItemModel({
        id: feedData.feedid,
        text: feedData.FeedText,
        createdAt: feedData.createdAt,
        owner: usersById[feedData.userid].id,
        comments,
      });
      allFeedItemPromises.push(new Promise((resolve, reject) => {
        feedItem.save((err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }));
    }
  });
  await Promise.all(allFeedItemPromises);
  console.log('Finish.');
  process.exit();
})();
