const {Enrollment}=require('../models');
//const {db_connect}=require('../db/db_connect');
const {Model}=require("objection");
//db_connect(process.env.NODE_ENV);

/**
 * @namespace
 */

const enrollmentRepository={
  /**
      * This function returns list of all enrollments
      * @function 
      * @memberof enrollmentRepository
      * @returns {Array}
      */
  findAll(){
    return Enrollment.query();
  },

   /**
     * This function returns one enrollment based on informations provided by entity object
     * @function
     * @memberof enrollmentRepository
     * @param {object} entity 
     * @returns { object}
     */
   async findBy(entity){
     const enrollment=await Enrollment.query().where(entity).first();
     return enrollment;
   },
   
    /** Create a Enrollment based on informations provided by entity object and returns the created Enrollment
      * @function 
      * @memberof enrollmentRepository
      * @param {object} entity
      * @returns {object}
      */
    create(entity) {
        return Enrollment.query().insert(entity).returning('*') 
    },
   
    /**
     * Delete an enrollment based on informations provided by entity object and returns the deleted enrollment
     * @function 
     * @memberof enrollmentRepository
     * @param {object} entity 
     * @returns {object}
     */
    remove(entity){
        console.log('entity',entity)
        return Enrollment.query().where(entity)
                .delete().returning('*');
    },

     /**
     * Update an enrollment with information based on condition
     * @function
     * @memberof enrollmentRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
     updateBy(information,condition){
        return Enrollment.query().patch(information).where(condition).returning('*');
     } 

}

module.exports=enrollmentRepository;