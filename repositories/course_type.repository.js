const {CourseType}=require('../models');
const {Model}=require("objection");

/**
 * @namespace
 */
const courseTypeRepository={

     /**
      * This function returns list of all course types
      * @function 
      * @memberof courseRepository
      * @returns {Array}
      */
     findAll(){
        return CourseType.query();
    },

     /**
     * This function returns one course type based on informations provided by entity object
     * @function
     * @memberof courseTypeRepository
     * @param {object} entity 
     * @returns { object}
     */
     async findBy(entity){
        const type=await CourseType.query().where(entity).first();
        return type;
    },

     /** Create a course repository based on informations provided by entity object and returns the created course type
      * @function 
      * @memberof courseTypeRepository
      * @param {object} entity
      * @returns {object}
      */
     create(entity) {
        return CourseType.query().insert(entity).returning('*') 
      },

    /**
     * Delete a course type based on informations provided by entity object and returns the deleted course type
     * @function 
     * @memberof courseTypeRepository
     * @param {object} entity 
     * @returns {object}
     */
    async remove(entity){
        const courses = await CourseType.relatedQuery('courses').for(entity.id);
        if (courses.length > 0) {
            throw new Error('Cannot delete this course type because it is associated with existing courses.');
        }
        return CourseType.query().where(entity)
                .delete().returning('*');
    },

       /**
     * Update a course type with information based on condition
     * @function
     * @memberof courseTypeRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
       updateBy(information,condition){
        return CourseType.query().patch(information).where(condition).returning('*');
     }
}

module.exports=courseTypeRepository;