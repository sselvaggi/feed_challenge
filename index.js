const express = require('express');
const bodyParser = require('body-parser');
const expressGraphql = require('express-graphql');
const {
  buildSchema, graphql, GraphQLObjectType, GraphQLSchema,
} = require('graphql');
const feedService = require('./src/feedService');
const feeds = require('./FeedItems.json');
const user = require('./Users.json');
const comments = require('./Comments.json');

feedService.setDB({
  feeds,
  user,
  comments,
});

const { log } = console;
const app = express();
const apiRouter = express.Router();
app.use(bodyParser.json());
apiRouter.get('/feed', (req, res) => {
  res.json(feedService.fetch(res.fields, req.filters));
});
app.use('/api', apiRouter);
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Vary', 'Accept-Encoding');
  next();
});

app.use('/graphql', expressGraphql({
  graphiql: true,
  schema: buildSchema(`
    type Query {
      feed(filterFeedByOwnerId: Int): [FeedItem]
    },
    type FeedItem {
      id: Int,
      createdAt: String,
      text: String,
      owner: User,
      comments: [Comment]
    },
    type User {
      id: Int
      username: String,
      createdAt: String
    },
    type Comment {
      id: Int
      text: String,
      owner: User
    },
  `),
  rootValue: {
    feed: feedService.fetch,
  },
}));

app.listen(process.env.PORT || 8080, () => log(`Server listening on port ${process.env.PORT || 8080}...`));
module.exports = app;
