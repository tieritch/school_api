const {Grade}=require('../models');
const {db_connect}=require('../db/db_connect');
const {Model}=require("objection");

db_connect(process.env.NODE_ENV);

/**
 * @namespace
 */

const gradeRepository={
     /**
      * This function returns list of all grades
      * @function 
      * @memberof gradeRepository
      * @returns {Array}
      */
    findAll(){
        return Grade.query();
    },
    
    /**
     * This function returns one grade based on informations provided by entity object
     * @function
     * @memberof gradeRepository
     * @param {object} entity 
     * @returns { object}
     */
    async findBy(entity){
        const grade=await Grade.query().where(entity).first();
        return grade;
    },

     /** Create a Grade based on informations provided by entity object and returns the created Grade
      * @function 
      * @memberof gradeRepository
      * @param {object} entity
      * @returns {object}
      */
    create(entity) {
      return Grade.query().insert({entity}).returning('*') 
    },

    /**
     * Delete a grade based on informations provided by entity object and returns the deleted grade
     * @function 
     * @memberof gradeRepository
     * @param {object} entity 
     * @returns {object}
     */
    async remove(entity){
        await Grade.relatedQuery('students').for(entity.id).unrelate();
        await Grade.relatedQuery('schoolYears').for(entity.id).unrelate();
        await Grade.relatedQuery('unrollments').for(entity.id).unrelate();
        return Grade.query().where(entity)
                .delete().returning('*');
    },

    /**
     * Update a grade with information based on condition
     * @function
     * @memberof gradeRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
     updateBy(information,condition){
       return Grade.query().patch(information).where(condition).returning('*');
    }

}
module.exports=gradeRepository