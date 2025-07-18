const {EvaluationType}=require('../models');


/**
 * @namespace
 */
const evaluationTypeRepository={

    /**
     * This function returns list of all evaluation types
     * @function 
     * @memberof evaluationRepository
     * @returns {Array}
     */
    findAll(){
       return EvaluationType.query();
   },

    /**
    * This function returns one evaluation type based on informations provided by entity object
    * @function
    * @memberof evaluationTypeRepository
    * @param {object} entity 
    * @returns { object}
    */
    async findBy(entity){
       const type=await EvaluationType.query().where(entity).first();
       return type;
   },

    /** Create a evaluation based on informations provided by entity object and returns the created evaluation type
     * @function 
     * @memberof evaluationTypeRepository
     * @param {object} entity
     * @returns {object}
     */
    create(entity) {
       return EvaluationType.query().insert(entity).returning('*') 
     },

   /**
    * Delete a evaluation type based on informations provided by entity object and returns the deleted evaluation type
    * @function 
    * @memberof evaluationTypeRepository
    * @param {object} entity 
    * @returns {object}
    */
   async remove(entity){
       const evaluations = await EvaluationType.relatedQuery('scores').for(entity.id);
       if (evaluations.length > 0) {
           throw new Error('Cannot delete this evaluation type because it is associated with existing scores.');
       }
       return EvaluationType.query().where(entity)
               .delete().returning('*');
   },

      /**
    * Update a evaluation type with information based on condition
    * @function
    * @memberof evaluationTypeRepository
    * @param {object} information
    * @param {object} condition 
    * @returns {object}
    */
      updateBy(information,condition){
       return EvaluationType.query().patch(information).where(condition).returning('*');
    }
}

module.exports=evaluationTypeRepository;