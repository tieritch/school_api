const {User}=require('../models');
const {db_connect}=require('../db/db_connect');
const {Model}=require("objection");
//console.log(process.env.NODE_ENV)
db_connect(process.env.NODE_ENV);
 /**
  * setting connection to a DB
  */
//db_connect(process.env.NODE_ENV);

//Model.knex(db);
/**
 * @namespace
 */

const userRepository={
     /**
      * This function returns list of all users
      * @function 
      * @memberof userRepository
      * @returns {Array}
      */
    findAll(){
        return User.query();
    },
    
    /**
     * This function returns one user based on informations provided by entity object
     * @function
     * @memberof userRepository
     * @param {object} entity 
     * @returns { object}
     */
    async findBy(entity){
        const user=await User.query().where(entity).first();
        return user;
    },

     /** Create a user based on informations provided by entity object and returns the created user
      * @function 
      * @memberof userRepository
      * @param {object} entity
      * @returns {object}
      */
    async create(entity) {
       // console.log(`entity role_id:${entity.role_id}`)
        const trx=await User.startTransaction();
        try{
            let userEntity={...entity};
            delete userEntity.role_id;
            const user=await User.query(trx).insert(userEntity).returning('*');
            await user.$relatedQuery('roles',trx).relate(entity.role_id);
            await trx.commit();
            return user;
        }
        catch(err){
            await trx.rollback();
            console.log(err)
            throw new Error(`error on server side:${err}`);
        }
    },

    /**
     * Delete a user based on informations provided by entity object and returns the deleted user
     * @function 
     * @memberof userRepository
     * @param {object} entity 
     * @returns {object}
     */
    async remove(entity){
        await User.relatedQuery('roles').for(entity.id).unrelate();
        return User.query().where(entity)
                .delete().returning('*');
    },

    /**
     * Update a user with information based on condition
     * @function
     * @memberof userRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
    async updateBy(information,condition){
        const trx=await User.startTransaction();
        try{
            let userEntity={...information};
            delete userEntity.role_id;
            const user=await User.query(trx).patch(userEntity).where(condition).returning('*').returning('*');
            await user.$relatedQuery('roles',trx).relate(information.role_id);
            await trx.commit();
            return user;
        }
        catch(err){
            await trx.rollback();
           // console.log(err)
            throw new Error(`error on server side:${err}`);
        }
    }

}
//console.log(__dirname)
module.exports=userRepository;