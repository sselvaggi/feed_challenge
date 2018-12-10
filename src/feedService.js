const service = {
  setDB(db) {
    service.db = db;
  },
  findUserById(id) {
    const rawUser = service.db.user.find(x => x.userid === id);
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
    for (const comment of service.db.comments) {
      if (comment.feedid === feedid) {
        const commentUser = service.findUserById(comment.userid);
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
  fetch(args = {}) {
    const result = [];
    const {
      filterFeedByOwnerId = null,
    } = args;
    // eslint-disable-next-line no-restricted-syntax
    for (const feedItem of service.db.feeds) {
      const user = service.findUserById(feedItem.userid);
      if (user && (!filterFeedByOwnerId || filterFeedByOwnerId === user.id)) {
        result.push({
          owner: user,
          text: feedItem.FeedText,
          createdAt: feedItem.createdAt,
          comments: service.findCommentsByFeedId(feedItem.feedid),
        });
      }
    }
    return result;
  },
};
module.exports = service;
