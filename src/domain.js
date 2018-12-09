const feedItemsData = require('../FeedItems.json');
const userData = require('../Users.json');
const commentsData = require('../Comments.json');

const domain = {
  findUserById(id) {
    return userData.find(x => x.userid === id);
  },
  findCommentsByFeedId(feedid) {
    const result = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const comment of commentsData) {
      if (comment.feedid === feedid) {
        const commentUser = this.findUserById(comment.userid);
        if (commentUser) {
          result.push({
            username: commentUser.username,
            createdAt: comment.createdAt,
            text: comment.commentText,
          });
        }
      }
    }
    return result;
  },
  feed() {
    const result = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const feedItem of feedItemsData) {
      const user = this.findUserById(feedItem.userid);
      if (user) {
        result.push({
          username: user.username,
          text: feedItem.FeedText,
          createdAt: feedItem.createdAt,
          comments: this.findCommentsByFeedId(feedItem.feedid),
        });
      }
    }
    return result;
  },
};
module.exports = domain;
