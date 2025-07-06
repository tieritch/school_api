const {Student}=require('../models');
const {db_connect}=require('../db/db_connect');
const {Model}=require("objection");

db_connect(process.env.NODE_ENV);
/**
 * @namespace
 */
const studentRepository={

    /**
    * This function returns list of all students
    * @function 
    * @memberof studentRepository
    * @returns {Array}
    */
    findAll(){
        return Student.query();
     },
    
     /**
     * This function returns one student based on informations provided by entity object
     * @function
     * @memberof studentRepository
     * @param {object} entity 
     * @returns { object}
     */
    async findBy(entity){
        const student=await Student.query().where(entity).first();
        return student;
    },

    /** Create a student based on informations provided by entity object and returns the created student
      * @function 
      * @memberof studentRepository
      * @param {object} entity
      * @returns {object}
      */
    create(entity) {
        return Student.query().insert(entity).returning('*') 
    },

    /**
     * Delete a student based on informations provided by entity object and returns the deleted student
     * @function 
     * @memberof studentRepository
     * @param {object} entity 
     * @returns {object}
     */
      async remove(entity){
        await Student.relatedQuery('grades').for(entity.id).unrelate();
        await Student.relatedQuery('schoolYears').for(entity.id).unrelate();
        await Student.relatedQuery('enrollments').for(entity.id).unrelate();
        return Student.query().where(entity)
                .delete().returning('*');
    },

      /**
     * Update a student with information based on condition
     * @function
     * @memberof studentRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
      updateBy(information,condition){
        return Student.query().patch(information).where(condition).returning('*');
     }
}
module.exports=studentRepository;