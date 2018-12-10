const { log } = console;
const { expect } = require('chai');
const should = require('chai').should(); // actually call the function
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index');

chai.use(chaiHttp);
// The API should have a method to list all of the feedItems, with their associated
// comments and user names in a single request.

// If any of the data is missing on either a user, comment, or feedItem,
// the element with missing data should not be returned by the API.
// For example, if the username of a commenter is missing, the comment should not be displayed at all.
describe('listFeedItems', () => {
  // it('Should have a name field of type String', () => {
  //   const feedItems = feedService.fetch();
  //   feedItems.forEach((feedItem) => {
  //     feedItem.should.be.a('object');
  //     feedItem.should.have.a.property('createdAt');
  //     try {
  //       feedItem.should.have.a.property('text');
  //     } catch (e) {
  //       log(feedItem, ' has not text', e);
  //     }
  //     feedItem.should.have.a.property('owner').with.has.a.property('username');
  //     feedItem.comments.forEach((comment) => {
  //       try {
  //         comment.should.have.a.property('text');
  //         comment.should.have.a.property('username');
  //         comment.should.have.a.property('createdAt');
  //       } catch (e) {
  //         log(comment, 'missing property ', e);
  //       }
  //     });
  //   });
  // });
  // it('Should be filtered by filterFeedByOwnerId', () => {
  //   const feedItems = feedService.fetch({filterFeedByOwnerId: 10 });
  //   feedItems.forEach((feedItem) => {
  //     feedItem.should.be.a('object');
  //     feedItem.should.have.a.property('owner').with.has.a.property('id');
  //     expect(feedItem.owner.id).be.equal(10);
  //   });
  // });
});

describe('/GET feed', () => {
  it('it should GET all the feed items', (done) => {
    chai.request(server)
      .get('/api/feed')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        // res.body.length.should.be.eql(0);
        done();
      });
  });
});
