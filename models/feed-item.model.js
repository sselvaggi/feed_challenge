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
  async getAll(filter) {
    const list = await new Promise((resolve, reject) => {
      Model.feedItems.find(filter, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    let feeds = list.map(async (feed) => {
      const owner = await Model.users.findOne({ id: feed.id });
      const { text } = feed;
      let comments = [];
      try {
        comments = await Promise.all(feed.comments.map(async (comment) => {
          const commentOwner = await Model.users.findOne({ id: comment.owner });
          return {
            text: comment.text,
            owner: {
              username: commentOwner.username,
            },
          };
        }));
      } catch (e) {
        console.log(feed.comments);
        console.log(e);
      }
      return {
        owner,
        text,
        comments,
      };
    });
    feeds = await Promise.all(feeds);
    return feeds.filter(x => x.owner);
  },
};
module.exports = Model;
