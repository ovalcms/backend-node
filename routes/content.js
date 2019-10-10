'use strict'
const utilsContent = require('../utils/content');

module.exports.contentGet = (req, res) => {
  const reqEntryId = req.params.entryId;

  // Will check for cached and unexpired access token
  utilsContent.getApiContent(reqEntryId).then((contentResponse) => {
    if (contentResponse) {
      res.status(200).json(contentResponse);
    } else {
      res.status(404).json('route problem');
    }
  }).catch((err) => {
    const errMsg = 'Error getting API content: ' + err;
    res.status(400).json(errMsg);
  })
};
