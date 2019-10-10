'use strict'
const utilsToken = require('../utils/token');
const tokenObj = require('../models/token');

module.exports.tokenPost = (req, res) => {
  utilsToken.postApiTokenRequest().then((tokenResponse) => {
    if (tokenResponse) {
      tokenObj.accessToken = tokenResponse.accessToken;
      tokenObj.accessTokenExpiresAt = tokenResponse.accessTokenExpiresAt;
      tokenObj.clientId = tokenResponse.client.id;
      tokenObj.userId = tokenResponse.user.id;

      res.status(200).json(tokenResponse);
    } else {
      res.status(404).json('route problem');
    }
  }).catch((err) => {
    const errMsg = 'Error posting API token request: ' + err;
    res.status(400).json(errMsg);
  })
};

module.exports.tokenDelete = (req, res) => {
  const accessToken = req.params.tokenId;

  utilsToken.deleteApiToken(accessToken).then((delTokenResponse) => {
    if (delTokenResponse) {
      res.status(200).json(delTokenResponse);
    } else {
      const errMsg = 'Problem deleting API token';
      res.status(400).json(errMsg);
    }
  }).catch((err) => {
    const errMsg = 'Error deleting API token: ' + err;
    res.status(400).json(errMsg);
  })
}
