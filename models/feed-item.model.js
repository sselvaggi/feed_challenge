const Model = {
  setUserBucket(bucket) {
    Model.users = bucket;
  },
  setFeedItemBucket(bucket) {
    Model.feedItems = bucket;
  },
  schema: {
    id: Number,
    text: String,
    comments: Array,
    owner: Number,
  },
  async populateFeedItemComments(comments) {
    let result = [];
    try {
      result = await Promise.all(comments.map(async (comment) => {
        const commentOwner = await Model.users.findOne({ id: comment.owner });
        return {
          text: comment.text,
          owner: {
            username: commentOwner.username,
          },
        };
      }));
    } catch (e) {
      console.log(e);
    }
    return result;
  },
  async getAll(filter) {
    const list = await new Promise((resolve, reject) => {
      Model.feedItems.find(filter, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    const feedPromises = list.map(async (feed) => {
      const owner = await Model.users.findOne({ id: feed.id });
      const { text } = feed;
      const comments = await Model.populateFeedItemComments(feed.comments);
      return {
        owner,
        text,
        comments,
      };
    });
    const feeds = await Promise.all(feedPromises);
    return feeds.filter(x => x.owner);
  },
};
module.exports = Model;
