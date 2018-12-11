require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const {
  buildSchema, graphql, GraphQLObjectType, GraphQLSchema,
} = require('graphql');
const expressGraphql = require('express-graphql');
const cors = require('cors');
const helmet = require('helmet');
const UserModel = require('./models/user.model');
const FeedItemModel = require('./models/feed-item.model');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => { log(`connection open: ${process.env.MONGODB_URI}`); });

const { log } = console;
const app = express();
const apiRouter = express.Router();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
apiRouter.get('/feed', (req, res) => {
  FeedItemModel.find({}, (err, data) => {
    res.json(data);
  });
});
app.use('/api', apiRouter);
app.use(express.static('public'));

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
  rootValue: {
    feed(args) {
      const id = args.filterFeedByOwnerId ? args.filterFeedByOwnerId : 0;
      const filter = id ? { id } : null;
      const result = FeedItemModel.find(filter);
      return result;
    },
  },
}));

app.listen(process.env.PORT || 8080, () => log(`Server listening on port ${process.env.PORT || 8080}...`));
module.exports = app;
