const {AcademicSubdivision}=require('../models');
const {Model}=require("objection");

/**
 * @namespace
 */

const academicSubdivisionRepository={

      /**
      * This function returns list of all academic subdivisions
      * @function 
      * @memberof academicSubdivisionRepository
      * @returns {Array}
      */
      findAll(){
        return AcademicSubdivision.query();
    },

      /**
     * This function returns one academic subdivision  based on informations provided by entity object
     * @function
     * @memberof academicSubdivisionRepository
     * @param {object} entity 
     * @returns { object}
     */
      async findBy(entity){
        const subdivision =await AcademicSubdivision.query().where(entity).first();
        return subdivision ;
     },

     /** Create an academic subdivision based on informations provided by entity object and returns the created subdibvision
      * @function 
      * @memberof academicSubdivisionRepository
      * @param {object} entity
      * @returns {object}
      */
     create(entity) {
        return AcademicSubdivision.query().insert(entity).returning('*') 
    },

     /**
     * Delete an academic subdivision  based on informations provided by entity object and returns the deleted subdivision 
     * @function 
     * @memberof academicSubdivisionRepository
     * @param {object} entity 
     * @returns {object}
     */
     async remove(entity){
        const periods = await AcademicSubdivision.relatedQuery('academicPeriods').for(entity.id);
        if (periods.length > 0) {
            throw new Error('Cannot delete this academic subdivision  because it is associated with existing academic periods.');
        }
        return AcademicSubdivision.query().where(entity)
                .delete().returning('*');
    },

    /**
     * Update aa academic subdivision with information based on condition
     * @function
     * @memberof academicSubdivisionRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
       updateBy(information,condition){
        return AcademicSubdivision.query().patch(information).where(condition).returning('*');
     }
}

module.exports=academicSubdivisionRepository;