const {SchoolYear}=require('../models');
const {Model}=require("objection");

/**
 * @namespace
 */
const schoolYeaRepository={
    /**
     * This function returns list of all school years
    * @function 
    * @memberof schoolYearRepository
    * @returns {Array}
    */
    findAll(){
        return SchoolYear.query();
    },

   /**
     * This function returns one school year based on informations provided by entity object
     * @function
     * @memberof schoolYearRepository
     * @param {object} entity 
     * @returns { object}
     */
    async findBy(entity){
        const sch=await SchoolYear.query().where(entity).first();
        return sch;
    },

    /** Create a  schoolYear based on informations provided by entity object and returns the created school year
      * @function 
      * @memberof schoolYearRepository
      * @param {object} entity
      * @returns {object}
      */
   create(entity){
        return SchoolYear.query().insert(entity).returning('*');
   },

    /**
     * Delete a school year based on informations provided by entity object and returns the deleted shool year
     * @function 
     * @memberof schoolYearRepository
     * @param {object} entity 
     * @returns {object}
     */
    remove(entity){
        return SchoolYear.query().where(entity).delete().returning('*');
    },

    /**
     * Update a school year with information based on condition
     * @function
     * @memberof schoolYearRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
    update(information,condition){
        return SchoolYear.query().patch(information).where(condition).returning('*');
             
    }
}
module.exports=schoolYeaRepository;
