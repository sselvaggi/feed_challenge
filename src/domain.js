const feedItemsData = require('../FeedItems.json');
const userData = require('../Users.json');
const commentsData = require('../Comments.json');

const domain = {
  findUserById(id) {
    const rawUser = userData.find(x => x.userid === id);
    if (!rawUser) {
      return null;
    }
    return {
      username: rawUser.username,
      id: rawUser.userid,
      createdAt: rawUser.createdAt,
    };
  },
  findCommentsByFeedId(feedid) {
    const result = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const comment of commentsData) {
      if (comment.feedid === feedid) {
        const commentUser = this.findUserById(comment.userid);
        if (commentUser) {
          result.push({
            owner: commentUser,
            createdAt: comment.createdAt,
            text: comment.commentText,
          });
        }
      }
    }
    return result;
  },
  feed(args = {}) {
    const result = [];
    const {
      filterFeedByOwnerId = null,
    } = args;
    // eslint-disable-next-line no-restricted-syntax
    for (const feedItem of feedItemsData) {
      const user = this.findUserById(feedItem.userid);
      if (user && (!filterFeedByOwnerId || filterFeedByOwnerId === user.id)) {
        result.push({
          owner: user,
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
