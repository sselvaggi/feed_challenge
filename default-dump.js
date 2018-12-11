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
  await UserModel.deleteMany({});
  await FeedItemModel.deleteMany({});
  await Promise.all(UserData.map(async (userData) => {
    const user = UserModel({
      id: userData.userid,
      username: userData.username,
      createdAt: userData.createdAt,
    });
    return user.save((err, data) => { console.log(err || `user #${data.id} saved`); });
  }));
  await Promise.all(FeedData.map(async (feedData) => {
    let comments = CommentsData.filter(comment => (comment.feedid === feedData.feedid))
      .map(async (comment) => {
        const commentuser = await UserModel.find({ id: comment.userid });
        console.log('commentuser', commentuser);
        return {
          text: comment.commentText,
          owner: mongoose.Types.ObjectId(commentuser._id),
        };
      });
    comments = await Promise.all(comments);
    const user = await UserModel.find({ id: feedData.userid });
    const feedItem = FeedItemModel({
      id: feedData.feedid,
      text: feedData.FeedText,
      createdAt: feedData.createdAt,
      owner: mongoose.Types.ObjectId(user._id),
      comments,
    });
    return feedItem.save((err, data) => { console.log(err || `feed #${data.id} saved`); });
  }));
  console.log('finished!');
})();
