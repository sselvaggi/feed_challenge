process.env.MONGODB_URI = 'mongodb://localhost/feed-text';
const { log } = console;
const { expect } = require('chai');
const should = require('chai').should(); // actually call the function
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index');
const FeedItemModel = require('./models/feed-item.model');
const UserModel = require('./models/user.model');

describe('/GET feed', async () => {
  beforeEach(async() => {
    await UserModel.remove({});
  });
  it('it should GET all the feed items', async (done) => {
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
