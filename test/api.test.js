// process.env.MONGODB_URI_TEST = 'mongodb://localhost:27017/feed-test';
const request = require('supertest');
const { expect, should } = require('chai');
const app = require('../index');

const db = app.get('db');
const users = db.get('users');
const feeditems = db.get('feeditems');

// The API should have a method to list all of the feedItems, with their associated
// comments and user names in a single request.

// If any of the data is missing on either a user, comment, or feedItem,
// the element with missing data should not be returned by the API.
// For example, if the username of a commenter is missing, the comment should not be displayed at all.
describe('/GET feed', async () => {
  beforeEach(async () => {
    const user1 = await users.insert({ username: 'Sergio', id: 1 });
    const user2 = await users.insert({ username: 'Tommy', id: 2 });
    const user3 = await users.insert({ username: 'Other', id: 3 });
    const feed1 = await feeditems.insert({
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
    const feed2 = await feeditems.insert({
      text: 'JS in Action',
      owner: user2.id,
      id: 2,
      comments: [{ text: 'I´ve never had an account... Bad data', owner: -1 }],
    });
    const feedUnknown = await feeditems.insert({ text: 'Unknown user feed', owner: -1, id: -1 });
  });
  afterEach(async () => {
    await users.drop({});
    await feeditems.drop({});
  });
  it('rest feed query', (done) => {
    request(app)
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
    request(app)
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
        if (err) throw err;
        console.log('res.body.data.feed', res.body.data.feed);
        expect(res.body.data.feed.length).to.be.eq(2);
        res.body.data.feed.forEach((feed) => {
          expect(feed).to.have.a.property('text');
          expect(feed).to.have.a.property('owner');
          expect(feed.owner).to.have.a.property('username');
          expect(feed).to.have.a.property('comments');
          feed.comments.forEach((comment) => {
            expect(comment).to.have.a.property('owner');
            expect(comment.owner).to.have.a.property('username');
          });
        });
        done();
      });
  });
});
