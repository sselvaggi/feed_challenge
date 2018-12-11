process.env.MONGODB_URI_TEST = 'mongodb://localhost:27017/feed-test';
const { log } = console;
const request = require('supertest');
const { expect, should } = require('chai');
const server = require('../index');
const FeedItemModel = require('../models/feed-item.model');
const UserModel = require('../models/user.model');

// The API should have a method to list all of the feedItems, with their associated
// comments and user names in a single request.

// If any of the data is missing on either a user, comment, or feedItem,
// the element with missing data should not be returned by the API.
// For example, if the username of a commenter is missing, the comment should not be displayed at all.
describe('/GET feed', async () => {
  beforeEach(async () => {
    const user1 = new UserModel({ username: 'Sergio', id: 1 });
    const user2 = new UserModel({ username: 'Tommy', id: 2 });
    const user3 = new UserModel({ username: 'Other', id: 3 });
    await user1.save();
    await user2.save();
    const feed1 = new FeedItemModel({
      text: 'Fun Fun Function',
      owner: user1.id,
      id: 1,
      comments: [{
        text: 'Hola Sergio, buen post!',
        owner: 2,
      }, {
        text: 'Gracias!',
        owner: 1,
      }],
    });
    const feed2 = new FeedItemModel({
      text: 'JS in Action',
      owner: user2.id,
      id: 2,
      comments: [{ text: 'I´ve never had an account... Bad data', owner: -1 }],
    });
    const feedUnknown = new FeedItemModel({ text: 'Unknown user feed', owner: -1, id: 3 });
    await feed1.save();
    await feed2.save();
    await feedUnknown.save();
  });
  afterEach(async () => {
    await UserModel.deleteMany({});
    await FeedItemModel.deleteMany({});
  });
  it('rest feed query', (done) => {
    request(server)
      .get('/api/feed')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.length).to.be.eq(2);
        done();
      });
  });
  it('grapql feed query', (done) => {
    request(server)
      .post('/graphql?')
      .type('application/json')
      .send({
        query: `
        query getSingleFeedItem($feedOwnerId: Int) {
          feed(filterFeedByOwnerId: $feedOwnerId) {
            text
            createdAt
            owner {
              username
            }
            comments {
              text
              owner {
                username
              }
            }
          }
        }`,
        operationName: 'getSingleFeedItem',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        console.log('res', res.body.data.feed[0]);
        if (err) throw err;
        expect(res.body.data.feed.length).to.be.eq(2);
        res.body.data.feed.forEach(x => {
          expect(x).to.have.a.property('text');
          expect(x).to.have.a.property('owner');
          expect(x).to.have.a.property('comments');
        });
        done();
      });
  });
});
