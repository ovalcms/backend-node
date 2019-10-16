'use strict'
const request = require('request');

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
    // Base URL
    const protocol = process.env.API_PROTOCOL;
    const host = process.env.API_HOST;

    // Credentials
    const client_id = process.env.OVAL_CLIENT_ID;
    const client_secret = process.env.OVAL_CLIENT_SECRET;
    const client_id_secret = client_id + ':' + client_secret;

    const path = 'oauth/token';
    const apiUrl = `${protocol}://${host}/${path}`;

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

async function isTokenUnexpired(oauthTokenObject) {
  try {
    return await isTokenUnexpiredProm(oauthTokenObject);
  } catch (err) {
    return {
      error: 'error'
    };
  }
}

async function postApiTokenRequest() {
  try {
    return await postApiTokenRequestProm();
  } catch (err) {
    return {
      error: 'error'
    };
  }
}

module.exports = {
  isTokenUnexpired,
  postApiTokenRequest
};
