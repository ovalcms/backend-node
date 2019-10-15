'use strict'
const request = require('request');

const cacheKey = 'accTokenObj';
const redis = require('redis');
const redisClient = redis.createClient();
const { promisify } = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);
redisClient.on('connect', () => console.log('Redis connected'));

const utilsToken = require('../utils/token');

/**
 * Promise that checks if access token has expired
 * @param  {Object} oauthTokenObject  OAUTH2 token object with accessTokenExpiresAt set
 * @return {Boolean} true if token Unexpired else false
 */
function getContent(oauthTokenObject) {
  return new Promise(((resolve, reject) => {
    // Base URL
    const protocol = process.env.API_PROTOCOL;
    const host = process.env.API_HOST;
    const path = 'api/content/' + oauthTokenObject.entryId;
    const apiUrl = `${protocol}://${host}/${path}`;

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
}

async function getApiContent(reqEntryId) {
  try {

    // if for some reason token is deleted before cache clears
    // redisClient.flushdb((err, succeeded) => {
    //   console.log(succeeded); // will be true if successfull
    // });

    // try to get cached object
    const cachedData = await getRedisCacheValue();

    // != null also checks for undefined
    if (cachedData != null) {
      // serve the object from cache
      const isUnexpired = await utilsToken.isTokenUnexpired(JSON.parse(cachedData));
      if (isUnexpired) {
        return await getContent(JSON.parse(cachedData));
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
      await setRedisCacheValue(cacheKey, oauthTokenObject, timeToLive);

      return await getContent(oauthTokenObject);
    }
  } catch (err) {
    return {
      error: 'error'
    };
  }
}

async function getRedisCacheValue() {
  return await getAsync(cacheKey);
}

async function setRedisCacheValue(key, tokenObject, ttl) {
  redisClient.setex(key, ttl, JSON.stringify(tokenObject));
}

module.exports = {
  getApiContent
};
