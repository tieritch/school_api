const {CourseAssign}=require('../models');
const {Model}=require("objection");

/**
 * @namespace
 */

const CourseAssignRepository={

     /**
      * This function returns list of all course assignments
      * @function 
      * @memberof courseAssignRepository
      * @returns {Array}
      */
     findAll(){
        return CourseAssign.query();
    },

    /**
      * This function returns one course assignment  based on informations provided by entity object
      * @function
      * @memberof courseRepository
      * @param {object} entity 
      * @returns { object}
      */
     async findBy(entity){
            const courseAssign =await CourseAssign.query().where(entity).first();
            return courseAssign;
    },
    
    /** Create a courseAssignment  based on informations provided by entity object and returns the created course assignment 
      * @function 
      * @memberof courseAssignRepository
      * @param {object} entity
      * @returns {object}
      */
     create(entity) {
        return CourseAssign.query().insert(entity).returning('*') 
      },
      
        /**
     * Delete a course assignment based on informations provided by entity object and returns the deleted course assignment 
     * @function 
     * @memberof courseAssignRepository
     * @param {object} entity 
     * @returns {object}
     */
    async remove(entity){
        const courses = await CourseAssign.relatedQuery('scores').for(entity.id);
        if (courses.length > 0) {
            throw new Error('Cannot delete this course assignment  because it is associated with existing scores.');
        }
        return CourseAssign.query().where(entity)
                .delete().returning('*');
    },

    /**
     * Update a course assignment  with information based on condition
     * @function
     * @memberof courseAssignRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
      updateBy(information,condition){
        return CourseAssign.query().patch(information).where(condition).returning('*');
     }

}

module.exports=CourseAssignRepository;