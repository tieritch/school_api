const {AcademicPeriod}=require('../models');
const {Model}=require("objection");

/**
 * @namespace
 */

const academicPeriodRepository={

  /**
      * This function returns list of all academic periods
      * @function
      * @memberof academicPeriodRepository
      * @returns {Array}
      */
  findAll(){
    return AcademicPeriod.query();
  },

  /**
     * This function returns one academic period  based on informations provided by entity object
     * @function
     * @memberof academicPeriodRepository
     * @param {object} entity
     * @returns { object}
     */
  async findBy(entity){
    const period =await AcademicPeriod.query().where(entity).first();
    return period ;
  },

  /** Create an academic period based on informations provided by entity object and returns the created period
      * @function
      * @memberof academicPeriodRepository
      * @param {object} entity
      * @returns {object}
      */
  create(entity) {
    return AcademicPeriod.query().insert(entity).returning('*');
  },

  /**
     * Delete an academic period  based on informations provided by entity object and returns the deleted period
     * @function
     * @memberof academicPeriodRepository
     * @param {object} entity
     * @returns {object}
     */
  async remove(entity){
    const scores = await AcademicPeriod.relatedQuery('scores').for(entity.id);
    if (scores.length > 0) {
      throw new Error('Cannot delete this academic period  because it is associated with existing scores.');
    }
    return AcademicPeriod.query().where(entity)
      .delete().returning('*');
  },

  /**
     * Update an academic period with information based on condition
     * @function
     * @memberof academicPeriodRepository
     * @param {object} information
     * @param {object} condition
     * @returns {object}
     */
  updateBy(information,condition){
    return AcademicPeriod.query().patch(information).where(condition).returning('*');
  },

};

module.exports=academicPeriodRepository;
