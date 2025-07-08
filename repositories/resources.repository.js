const {db_connect}=require('../db/db_connect');
const {Resource}=require('../models');
/**
 * @namespace resourceRepository
 */

const resourceRepository={
     
    /**
      * This function returns list of all resources
      * @function 
      * @memberof resourceRepository
      * @returns {Array}
      */
     findAll(){
        return Resource.query();
     },

      /**
      * This function returns one resource based on informations provided by entity object
      * @function
      * @memberof resourceRepository
      * @param {object} entity 
      * @returns { object}
      */
    async findBy(entity){
        const resource=await Resource.query().where(entity).first();
        return resource;
    },

}
module.exports=resourceRepository