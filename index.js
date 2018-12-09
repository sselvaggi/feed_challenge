const app = require('express')();
const bodyParser = require('body-parser');
const expressGraphql = require('express-graphql');
const { buildSchema } = require('graphql');
const feedItemsData = require('./FeedItems.json');

const { log } = console;
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Vary', 'Accept-Encoding');
  next();
});

app.use('/api', expressGraphql({
  graphiql: true,
  schema: buildSchema(`
    type Query {
      feedItem(id: Int!): FeedItem
      feedItems(userId: Int): [FeedItem]
    },
    type FeedItem {
      id: Int
      FeedText: String
    }
  `),
  rootValue: {
    feedItem(args) {
      log('args', args);
      return feedItemsData.filter(x => x.feedid === args.id)[0];
    },
    feedItems(args) {
      if (args.userid) {
        return feedItemsData.filter(x => x.userid === args.topic);
      }
      return feedItemsData;
    },
  },
}));
app.listen(8080, () => log('Server listening on port 8080...'));
module.exports = app;
