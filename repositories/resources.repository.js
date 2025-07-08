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

    /** Create a resource based on informations provided by entity object and returns the created resource
      * @function 
      * @memberof resourceRepository
      * @param {object} entity
      * @returns {object}
      */
    create(entity){
       return Resource.query().insert({entity}).returning('*');
    },

    
    /**
     * Update a reource with information based on condition
     * @function
     * @memberof resourceRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
    updateBy(information,condition){
        return Resource.query().patch(information)
        .where(condition).returning('*');
    },

      /**
     * Delete a recource based on informations provided by entity object and returns the deleted resource
     * @function 
     * @memberof resourceRepository
     * @param {object} entity 
     * @returns {object}
     */
    async remove(entity){
       // const resource=await Resource.relatedQuery('permissions').for( Resource.query().select('id').where(entity)).first();
        await Resource.relatedQuery('permissions').for(entity.id).unrelate();    
        return Resource.query().where(entity).delete().returning('*');        
    },
}
module.exports=resourceRepository