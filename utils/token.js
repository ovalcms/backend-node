'use strict'
const request = require('request');

// Base URL
const protocol = process.env.API_PROTOCOL;
const host = process.env.API_HOST;
const port = process.env.API_PORT;

// Credentials
const client_id = process.env.OVAL_CLIENT_ID;
const client_secret = process.env.OVAL_CLIENT_SECRET;
const client_id_secret = client_id + ':' + client_secret;

let path = '';
let apiUrl = '';

/**
 * Promise that checks if access token has expired
 * @param  {Object} oauthTokenObject  OAUTH2 token object with accessTokenExpiresAt set
 * @return {Boolean} true if token Unexpired else false
 */
function isTokenUnexpiredProm(oauthTokenObject) {
  return new Promise(((resolve, reject) => {
    if (oauthTokenObject.accessToken === '') {
      resolve(false);
    }

    const dtNow = new Date();
    const dtNowUTC = new Date(dtNow.toUTCString().slice(0, -4));

    const dtTokenExpires = new Date(oauthTokenObject.accessTokenExpiresAt);
    const dtTokenExpiresUTC2 = new Date(dtTokenExpires.toUTCString().slice(0, -4));

    if (dtTokenExpiresUTC2.toString() === 'Invalid Date') {
      reject('Invalid Date');
    } else {
      if (dtTokenExpiresUTC2 >= dtNowUTC) {
        resolve(true);
      } else {
        resolve(false);
      }
    }
  }));
}

/**
 * Promise that posts a request for new token
 * @return {object} object with access token and client
 */
function postApiTokenRequestProm() {
  return new Promise(((resolve, reject) => {
    path = 'oauth/token';

    if (process.env.NODE_ENV === 'development') {
      apiUrl = `${protocol}://${host}:${port}/${path}`;
    } else {
      apiUrl = `${protocol}://${host}/${path}`;
    }

    const options = {
      method: 'POST',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(client_id_secret).toString('base64')}`
      },
      form: {
        grant_type: 'client_credentials'
      }
    };

    // The request
    request(options, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  }));
}

/**
 * Promise that posts a request for new token
 * @param  {string} accessToken  OAUTH2 access token
 * @return {object} removed:token else error
 */
function deleteApiTokenProm(accessToken) {
  return new Promise(((resolve, reject) => {
    path = 'api/token/' + accessToken;

    if (process.env.NODE_ENV === 'development') {
      apiUrl = `${protocol}://${host}:${port}/${path}`;
    } else {
      apiUrl = `${protocol}://${host}/${path}`;
    }

    const options = {
      url: apiUrl,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(client_id_secret).toString('base64')}`
      }
    };

    // The request
    request(options, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  }));
}

async function isTokenUnexpired(oauthTokenObject) {
  try {
    return await isTokenUnexpiredProm(oauthTokenObject);
    //return users[0].name;
  } catch (err) {
    return {
      error: 'error'
    };
  }
}

async function postApiTokenRequest() {
  try {
    return await postApiTokenRequestProm();
    //return users[0].name;
  } catch (err) {
    return {
      error: 'error'
    };
  }
}

async function deleteApiToken(accessToken) {
  try {
    return await deleteApiTokenProm(accessToken);
    //return users[0].name;
  } catch (err) {
    return {
      error: 'error'
    };
  }
}

module.exports = {
  deleteApiToken,
  isTokenUnexpired,
  postApiTokenRequest
};
