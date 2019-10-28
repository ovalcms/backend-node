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
      // The pageId from OvalCMS.com dashboard
      const pageId = '7db4855b4da24b0c7f739c17';

      chai.request(server)
        // content route checks for token
        .get('/content/' + pageId)
        .send()
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.result.titleBlock.should.be.a('object');
          res.body.result.titleBlock.authorId.should.be.a('string');
          res.body.result.titleBlock.editor.should.be.a('string');
          res.body.result.titleBlock.pageId.should.be.a('string');
          res.body.result.titleBlock.publishDate.should.be.a('string');
          res.body.result.titleBlock.status.should.be.a('string');
          res.body.result.titleBlock.title.should.be.a('string');

          done();
        });
    });
  });
