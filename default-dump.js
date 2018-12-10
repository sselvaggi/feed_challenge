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
  await UserModel.remove();
  await FeedItemModel.remove();
  UserData.forEach((userData) => {
    const user = UserModel({
      id: userData.userid,
      username: userData.username,
      createdAt: userData.createdAt,
    });
    user.save((err, data) => { console.log(`user #${data.id} saved`)});
  });
  FeedData.forEach(async (feedData) => {
    const comments = CommentsData.filter(comment => (comment.feedid === feedData.feedid));
    const user = await UserModel.find({ id: feedData.userid });
    comments.map(async (comment) => {
      const commentuser = await UserModel.find({ id: comment.userid });
      return {
        text: comment.commentText,
        owner: commentuser._id,
      };
    });
    const feedItem = FeedItemModel({
      id: feedData.feedid,
      text: feedData.FeedText,
      createdAt: feedData.createdAt,
      owner: user._id,
      comments,
    });
    feedItem.save((err, data)=>{console.log(`feed #${data.id} saved`)});
  });
  console.log('finished!');
})();