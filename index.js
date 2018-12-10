require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const expressGraphql = require('express-graphql');
const {
  buildSchema, graphql, GraphQLObjectType, GraphQLSchema,
} = require('graphql');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {});
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  createdAt: { type: Date, default: new Date() },
}));
const FeedItem = mongoose.model('FeedItem', new mongoose.Schema({
  text: String,
  comments: [{ text: String, owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}));

const { log } = console;
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const apiRouter = express.Router();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
apiRouter.get('/feed', async (req, res) => {
  res.json(await FeedItem.find());
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
    feed: FeedItem.find,
  },
}));

app.listen(process.env.PORT || 8080, () => log(`Server listening on port ${process.env.PORT || 8080}...`));
module.exports = app;
