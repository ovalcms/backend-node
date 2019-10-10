'use strict'
const request = require('request');

const NodeCache = require('node-cache');
const myCache = new NodeCache();
const cacheKey = 'accTokenObj';

// const utilsToken = require('../token');
const utilsToken = require('../utils/token');

// Base URL
const protocol = process.env.API_PROTOCOL;
const host = process.env.API_HOST;
const port = process.env.API_PORT;

let path = '';
let apiUrl = '';

/**
 * Promise that checks if access token has expired
 * @param  {Object} oauthTokenObject  OAUTH2 token object with accessTokenExpiresAt set
 * @return {Boolean} true if token Unexpired else false
 */
function getContent(oauthTokenObject) {
  return new Promise(((resolve, reject) => {
    path = 'api/content/' + oauthTokenObject.entryId;

    if (process.env.NODE_ENV === 'development') {
      apiUrl = `${protocol}://${host}:${port}/${path}`;
    } else {
      apiUrl = `${protocol}://${host}/${path}`;
    }

    const options = {
      url: apiUrl,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oauthTokenObject.accessToken}`
      }
    };

    // The request
    request(options, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        const respObj = JSON.parse(body);
        resolve(buildRespObject(respObj));
      }
    });
  }));
}

function buildRespObject(resp) {
  if (process.env.NODE_ENV === 'production') {

    const respObj = {
      modified: '',
      authorId: '',
      entry: '',
      pageId: '',
      publishDate: '',
      status: '',
      title: ''
    }

    respObj.modified = resp.result.modified;
    respObj.authorId = resp.result.authorId;
    respObj.entry = resp.result.entry;
    respObj.pageId = resp.result.pageId;
    respObj.publishDate = resp.result.publishDate;
    respObj.status = resp.result.status;
    respObj.title = resp.result.title;


    return respObj;
  } else {
    const respObj = {
      modified: '',
      authorId: '',
      entry: '',
      pageId: '',
      publishDate: '',
      status: '',
      title: '',
      accessToken: ''
    }

    respObj.modified = resp.result.modified;
    respObj.authorId = resp.result.authorId;
    respObj.entry = resp.result.entry;
    respObj.pageId = resp.result.pageId;
    respObj.publishDate = resp.result.publishDate;
    respObj.status = resp.result.status;
    respObj.title = resp.result.title;
    respObj.accessToken = resp.result.accessToken;

    return respObj;
  }
}

async function getApiContent(reqEntryId) {
  try {
    // try to get cached object
    const cachedData = myCache.get(cacheKey);

    // != null also checks for undefined
    if (cachedData != null) {
      // serve the object from cache
      const isUnexpired = await utilsToken.isTokenUnexpired(cachedData);
      if (isUnexpired) {
        return await getContent(cachedData);
      } else {
        const tokenResponse = await utilsToken.postApiTokenRequest;

        // build the oauth object
        const oauthTokenObject = {
          accessToken: tokenResponse.accessToken,
          accessTokenExpiresAt: tokenResponse.accessTokenExpiresAt,
          clientId: tokenResponse.client.id,
          userId: tokenResponse.client.id,
          entryId: reqEntryId
        }

        return await getContent(oauthTokenObject);
      }
    } else {
      // get the data and cache it afterwards
      const tokenResponse = await utilsToken.postApiTokenRequest();

      // build the oauth object
      const oauthTokenObject = {
        accessToken: tokenResponse.accessToken,
        accessTokenExpiresAt: tokenResponse.accessTokenExpiresAt,
        clientId: tokenResponse.client.id,
        userId: tokenResponse.client.id,
        entryId: reqEntryId
      }

      // 1 hour = 3600 seconds
      const timeToLive = 3600;

      // cache the data
      myCache.set(cacheKey, oauthTokenObject, timeToLive);

      return await getContent(oauthTokenObject);
    }
  } catch (err) {
    return {
      error: 'error'
    };
  }
}

module.exports = {
  getApiContent
};
