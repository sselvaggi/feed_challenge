process.env.MONGODB_URI_TEST = 'mongodb://localhost:27017/feed-test';
const { log } = console;
const { expect } = require('chai');
const should = require('chai').should(); // actually call the function
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const FeedItemModel = require('../models/feed-item.model');
const UserModel = require('../models/user.model');

chai.use(chaiHttp);
// The API should have a method to list all of the feedItems, with their associated
// comments and user names in a single request.

// If any of the data is missing on either a user, comment, or feedItem,
// the element with missing data should not be returned by the API.
// For example, if the username of a commenter is missing, the comment should not be displayed at all.
describe('/GET feed', async () => {
  beforeEach(async () => {
    const user1 = new UserModel({ username: 'Sergio', id: 1 });
    const user2 = new UserModel({ username: 'Tommy', id: 1 });
    console.log('user2', user2);
    await user1.save();
    await user2.save();
    const feed1 = new FeedItemModel({ text: 'fun fun function', owner: user1.id, id: 1 });
    const feed2 = new FeedItemModel({ text: 'JS in Action', owner: user2.id, id: 2 });
    const feedUnknown = new FeedItemModel({ text: 'Unknown user feed', owner: -1, id: 2 });
    await feed1.save();
    await feed2.save();
    await feedUnknown.save();
  });
  afterEach(async () => {
    await UserModel.deleteMany({});
    await FeedItemModel.deleteMany({});
  });
  it('rest feed query', async (done) => {
    chai.request(server).get('/api/feed');
    done();
  });
});
