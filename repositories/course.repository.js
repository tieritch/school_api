const {Course}=require('../models');
const {Model}=require("objection");
/**
 * @namespace
 */
const courseRepository={

  /**
      * This function returns list of all course s
      * @function
      * @memberof courseRepository
      * @returns {Array}
      */
  findAll(){
    return Course.query();
  },

  /**
     * This function returns one course  based on informations provided by entity object
     * @function
     * @memberof courseRepository
     * @param {object} entity
     * @returns { object}
     */
  async findBy(entity){
    const course =await Course.query().where(entity).first();
    return course ;
  },

  /** Create a course based on informations provided by entity object and returns the created course
      * @function
      * @memberof courseRepository
      * @param {object} entity
      * @returns {object}
      */
  create(entity) {
    return Course.query().insert(entity).returning('*');
  },

  /**
     * Delete a course  based on informations provided by entity object and returns the deleted course
     * @function
     * @memberof courseRepository
     * @param {object} entity
     * @returns {object}
     */
  async remove(entity){
    const courses = await Course.relatedQuery('scores').for(entity.id);
    if (courses.length > 0) {
      throw new Error('Cannot delete this course  because it is associated with existing scores.');
    }
    return Course.query().where(entity)
      .delete().returning('*');
  },

  /**
     * Update a course  with information based on condition
     * @function
     * @memberof courseRepository
     * @param {object} information
     * @param {object} condition
     * @returns {object}
     */
  updateBy(information,condition){
    return Course.query().patch(information).where(condition).returning('*');
  },
};

module.exports=courseRepository;
