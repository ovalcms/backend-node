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
 * Promise that get the chosen content
 * @param  {String} pageId  id of chosen page of content
 * @param  {Object} oauthTokenObject  OAUTH2 token object with accessTokenExpiresAt set
 * @return {Boolean} true if token Unexpired else false
 */
function getContent(pageId, oauthTokenObject) {
  return new Promise(((resolve, reject) => {
    // Base URL
    const protocol = process.env.API_PROTOCOL;
    const host = process.env.API_HOST;
    const path = 'api/v1/content/' + pageId;
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
        resolve(respObj);
      }
    });
  }));
}

async function getApiContent(reqPageId) {
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
        return await getContent(reqPageId, JSON.parse(cachedData));
      } else {
        const tokenResponse = await utilsToken.postApiTokenRequest;

        // build the oauth object
        const oauthTokenObject = {
          accessToken: tokenResponse.accessToken,
          accessTokenExpiresAt: tokenResponse.accessTokenExpiresAt,
          clientId: tokenResponse.client.id,
          userId: tokenResponse.client.id
        }

        return await getContent(reqPageId, oauthTokenObject);
      }
    } else {
      // get the data and cache it afterwards
      const tokenResponse = await utilsToken.postApiTokenRequest();

      // build the oauth object
      const oauthTokenObject = {
        accessToken: tokenResponse.accessToken,
        accessTokenExpiresAt: tokenResponse.accessTokenExpiresAt,
        clientId: tokenResponse.client.id,
        userId: tokenResponse.client.id
      }

      // 1 hour = 3600 seconds
      const timeToLive = 3600;

      // cache the data
      await setRedisCacheValue(cacheKey, oauthTokenObject, timeToLive);

      return await getContent(reqPageId, oauthTokenObject);
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
