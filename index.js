require('dotenv').config();
const monk = require('monk');
const express = require('express');
const bodyParser = require('body-parser');
const {
  buildSchema, // graphql, GraphQLObjectType, GraphQLSchema,
} = require('graphql');
const expressGraphql = require('express-graphql');
const cors = require('cors');
const helmet = require('helmet');
const FeedModel = require('./models/feed-item.model');

const db = monk(process.env.MONGODB_URI);
FeedModel.setUserBucket(db.get('users'));
FeedModel.setFeedItemBucket(db.get('feeditems'));
const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('db', db);
const appRouter = {
  async feed(args) {
    const id = args.filterFeedByOwnerId ? args.filterFeedByOwnerId : 0;
    const filter = id ? { id } : null;
    return FeedModel.getAll(filter);
  },
};
app.use('/graphql', expressGraphql({
  graphiql: true,
  schema: buildSchema(`
    type Query {
      feed(filterFeedByOwnerId: Int): [FeedItem]
    },
    type FeedItem {
      createdAt: String,
      text: String,
      owner: User,
      comments: [Comment]
    },
    type User {
      username: String,
      createdAt: String
    },
    type Comment {
      text: String,
      owner: User
    },
  `),
  rootValue: appRouter,
}));
const apiRouter = express.Router();
apiRouter.get('/feed', async (req, res) => {
  res.json(await appRouter.feed(req.params));
});
app.use('/api', apiRouter);
app.listen(process.env.PORT || 8080, () => console.log(`Server listening on port ${process.env.PORT || 8080}...`));

// TODO wrap in a function or a library 
function exitHandler(options, exitCode) {
  db.close();
  if (options.cleanup) console.log('clean');
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

module.exports = app;
