
const {RefreshToken}=require('../models');
/**
 * @namespace refreshTokenRepository
 */
const refreshTokenRepository={
  /**
      * This function returns list of all refresh tokens
      * @function
      * @memberof refreshTokenRepository
      * @returns {Array}
      */
  findAll(){
    return RefreshToken.query();
  },


  /**
     * This function returns one token based on informations provided by entity object
     * @function
     * @memberof RefreshTokenRepository
     * @param {object} entity
     * @returns { object}
     */
  async findBy(entity){
    const refresh=await RefreshToken.query().where(entity).first();
    return refresh;
  },


  /** Create a refresh token based on informations provided by entity object and returns the created token
      * @function
      * @memberof refreshTokenRepository
      * @param {object} entity
      * @returns {object}
      */
  create(entity){
    return RefreshToken.query().insert(entity).returning('*');
  },

  /**
     * Delete a refresh token based on informations provided by entity object and returns the deleted token
     * @function
     * @memberof refreshTokenRepository
     * @param {object} entity
     * @returns {object}
     */
  remove(entity){
    return RefreshToken.query().where(entity).delete().returning('*');
  },

};
module.exports= refreshTokenRepository;
