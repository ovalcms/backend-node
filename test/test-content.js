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

/* eslint-disable prefer-arrow-callback */
// Passing arrow functions (aka "lambdas") to Mocha is discouraged.
// Lambdas lexically bind this and cannot access the Mocha context.
describe('/GET content'
  , function () {
    it('it should GET content via POST token, then DELETE token', function (done) {
      let accessToken = '';
      let entryId = '';
      if (process.env.NODE_ENV === 'development') {
        entryId = '5d2b50be4b348e08c641167e'
      } else {
        entryId = '7593e5f74c6z37260d4da5y3';
      }

      chai.request(server)
        // content route checks for token
        .get('/content/' + entryId)
        .send()
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.authorId.should.be.a('string');
          res.body.entry.should.be.a('string');
          res.body.pageId.should.be.a('string');
          res.body.publishDate.should.be.a('string');
          res.body.status.should.be.a('string');
          res.body.title.should.be.a('string');
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
