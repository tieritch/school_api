
const jwt=require('jsonwebtoken');
/**
 * @namespace createToken
 */

const createToken={
  /**
     * create an access token with a user as parameter
     * @function
     * @memberof createToken
     * @param {object} user
     * @returns {string}
     */
  access(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'3600s'});
  },

  /**
     * create a refresh token with a user as parameter
     * @function
     * @memberof createToken
     * @param {object} user
     * @returns {string}
     */
  refresh(user){
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
  },
};
module.exports=createToken;
