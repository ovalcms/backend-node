'use strict'
//Require the dev-dependencies
const path = require('path');
const dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath });

const chai = require('chai');
const chaiHttp = require('chai-http');
// eslint-disable-next-line no-unused-vars
const server = require('../app');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
// eslint-disable-next-line no-unused-vars
const expect = chai.expect;
chai.use(chaiHttp);

const utilsToken = require('../utils/token');

/* eslint-disable prefer-arrow-callback */
// Passing arrow functions (aka "lambdas") to Mocha is discouraged.
// Lambdas lexically bind this and cannot access the Mocha context.
describe('Check For Expired Token', function () {
  // Describe vars
  let testTokenValue;
  let dtNow;
  let tokenExpires;

  beforeEach(function () {
    // Runs before each test in this block
    // Initialize
    // 1A. ARRANGE
    testTokenValue = 'cebbb46f42354908164f34f3507fbd5bead5';

    // UTC time as Date object
    dtNow = new Date();
    // tokenExpires = new Date(dtNow.toUTCString().slice(0, -4));
    tokenExpires = new Date(dtNow);
  });

  it('should not be expired: +1 hour', function () {
    // 1B. ARRANGE

    // UTC time one hour from now
    tokenExpires.setHours(tokenExpires.getHours() + 1);

    const oauthTokenObject = {
      accessToken: testTokenValue,
      accessTokenExpiresAt: tokenExpires
    }

    // 2. ACT
    return utilsToken.isTokenUnexpired(oauthTokenObject).then(function (result) {
      // 3. ASSERT
      expect(result).to.equal(true);
    });
  });

  it('should not be expired: +10 minutes', function () {
    // 1B. ARRANGE

    // UTC time ten minutes from now
    tokenExpires.setMinutes(tokenExpires.getMinutes() + 10);

    const oauthTokenObject = {
      accessToken: testTokenValue,
      accessTokenExpiresAt: tokenExpires
    }

    // 2. ACT
    return utilsToken.isTokenUnexpired(oauthTokenObject).then(function (result) {
      // 3. ASSERT
      expect(result).to.equal(true);
    });
  });

  it('should not be expired: +1 minute', function () {
    // 1B. ARRANGE

    // UTC time one minute from now
    tokenExpires.setMinutes(tokenExpires.getMinutes() + 1);

    const oauthTokenObject = {
      accessToken: testTokenValue,
      accessTokenExpiresAt: tokenExpires
    }

    // 2. ACT
    return utilsToken.isTokenUnexpired(oauthTokenObject).then(function (result) {
      // 3. ASSERT
      expect(result).to.equal(true);
    });
  });

  it('should be expired: -1 minute', function () {
    // 1B. ARRANGE

    // UTC time one hour from now
    tokenExpires.setMinutes(tokenExpires.getMinutes() - 1);

    const oauthTokenObject = {
      accessToken: testTokenValue,
      accessTokenExpiresAt: tokenExpires
    }

    // 2. ACT
    return utilsToken.isTokenUnexpired(oauthTokenObject).then(function (result) {
      // 3. ASSERT
      expect(result).to.equal(false);
    });
  });
});

describe('/POST and DELETE token', function () {
  it('it should create and then delete a token', function (done) {
    let accessToken = '';

    chai.request(server)
      .post('/token')
      .send()
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.accessToken.should.be.a('string');
        res.body.accessTokenExpiresAt.should.be.a('string');
        res.body.client.should.be.a('object');
        res.body.client.should.be.a('object');
        res.body.client.should.have.property('id').eql(process.env.OVAL_CLIENT_ID);
        accessToken = res.body.accessToken;

        chai.request(server)
          .delete('/token/' + accessToken)
          .send()
          .end(function (error, response) {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('removed');
            response.body.removed.should.be.a('string');
            response.body.removed.should.equal(accessToken);
            done();
          });
      });
  });
});
