const {Score}=require('../models');
//const {User}=require('../models');
const {Model}=require("objection");
/**
 * @namespace
 */

const scoreRepository={

     /**
      * This function returns list of all scores
      * @function 
      * @memberof scoreRepository
      * @returns {Array}
      */
     findAll(){
        return Score.query();
    },
    
    /**
    * This function returns one score based on informations provided by entity object
    * @function
    * @memberof scoreRepository
    * @param {object} entity 
    * @returns { object}
    */
    async findBy(entity){
        const score=await Score.query().where(entity).first();
        return score;
    },

    /** Create a score based on informations provided by entity object and returns the created score
      * @function 
      * @memberof scoreRepository
      * @param {object} entity
      * @returns {object}
      */
    create(entity){
        return Score.query().insert(entity).returnin('*');
    },

    /**
     * Update a score with information based on condition
     * @function
     * @memberof scoreRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
    updateBy(information,condition){
        return Score.query().patch(information).where(condition).returning('*');
    },
   
    /**
     * Delete a score based on informations provided by entity object and returns the deleted score`
     * @function 
     * @memberof scoreRepository
     * @param {object} entity 
     * @returns {object}
     */
    remove(entity){
        return Score.query().where(entity)
        .delete().returning('*');
    }
    
    
}

module.exports=scoreRepository;