const jwt = require('jsonwebtoken');

/**
 * @namespace
 */
let createToken1={};

/**
 * Create an access token with a user as parameter
 * @function
 * @memberof createToken
 * @param {object} user
 * @returns {string}
 */
function access(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
}

/**
 * Create a refresh token with a user as parameter
 * @function
 * @memberof createToken
 * @param {object} user
 * @returns {string}
 */
function refresh(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

createToken1 = {
  access,
  refresh,
};

module.exports = createToken1;
