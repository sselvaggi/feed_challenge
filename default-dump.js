require('dotenv').config();
const monk = require('monk');
const FeedData = require('./FeedItems.json');
const UserData = require('./Users.json');
const CommentsData = require('./Comments.json');

const db = monk(process.env.MONGODB_URI);
const users = db.get('users');
const feeditems = db.get('feeditems');

(async () => {
  await Promise.all([users.drop({}), feeditems.drop({})]);
  const allUserPromises = [];
  UserData.forEach((userData) => {
    allUserPromises.push(users.insert({
      id: userData.userid,
      username: userData.username,
      createdAt: userData.createdAt,
    }));
  });
  await Promise.all(allUserPromises);
  const allFeedItemPromises = [];
  FeedData.forEach((feedData) => {
    console.log('FeedData', feedData);
    allFeedItemPromises.push(feeditems.insert({
      id: feedData.feedid,
      text: feedData.FeedText,
      createdAt: feedData.createdAt,
      owner: feedData.userid,
      comments: CommentsData.filter(comment => comment.feedid === feedData.feedid).map(comment => ({
        text: comment.commentText,
        owner: comment.userid,
      })),
    }));
  });
  await Promise.all(allFeedItemPromises);
  console.log('allFeedItemPromises', allFeedItemPromises);
  console.log('Finish.');
  // process.exit();
})();
