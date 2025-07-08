const {db_connect}=require('../db/db_connect');
const {Role}=require('../models');
//db_connect(process.env.NODE_ENV);
/**
 * @namespace roleRepository
 */
const roleRepository={
    /**
      * This function returns list of all roles
      * @function 
      * @memberof roleRepository
      * @returns {Array}
      */
   findAll(){
        return Role.query();
   },
   
   /**
     * This function returns one role based on informations provided by entity object
     * @function
     * @memberof roleRepository
     * @param {object} entity 
     * @returns { object}
     */
   async findBy(entity){
        const role=await Role.query().where(entity).first();
        return role;
    },

    /** Create a role based on informations provided by entity object and returns the created role
      * @function 
      * @memberof roleRepository
      * @param {object} entity
      * @returns {object}
      */
     /*  create(entity) {
      const trx=await Role.
        return Role.query().insert(entity).returning('*');
     },*/
     async create(entity) {
      // console.log(`entity role_id:${entity.role_id}`)
       const trx=await Role.startTransaction();
       try{
           let roleEntity={...entity};
           delete roleEntity.permission_ids;
           delete roleEntity.resource_ids;
           const role=await Role.query(trx).insert(roleEntity).returning('*');
           for (let permission_id of entity.permission_ids) {
            for (let resource_id of entity.resource_ids) {
              await trx('roles_permissions_resources').insert({
                role_id: role.id,
                permission_id,
                resource_id
              });
            }
           }          
           await trx.commit();
           return role;
       }
       catch(err){
           await trx.rollback();
           console.log(err)
           throw new Error(`error on server side:${err}`);
       }
   },

      /**
     * Delete a role based on informations provided by entity object and returns the deleted role
     * @function 
     * @memberof roleRepository
     * @param {object} entity 
     * @returns {object}
     */
    async remove(entity){
        const user=await Role.relatedQuery('users').for( Role.query().select('id').where(entity)).first();
        if(!user){
            await Role.relatedQuery('permissions').for(Role.query().select('id').where(entity)).unrelate();
            return Role.query().where(entity)
                .delete().returning('*');
        }
        else{
            throw new Error(' can\'t delete a role granted to a user')
        }        
    },

    /**
     * Update a role with information based on condition
     * @function
     * @memberof roleRepository
     * @param {object} information
     * @param {object} condition 
     * @returns {object}
     */
    async updateBy(information,condition){
        let roleInfo={...information};
        delete roleInfo.permission_ids;
        delete roleInfo.resource_ids;
        delete roleInfo.role_id;
        const trx=await Role.startTransaction();
        try{
        const role=await Role.query(trx)
            .patch(roleInfo).where(condition).returning('*');
            for (let permission_id of information.permission_ids) {
                for (let resource_id of information.resource_ids) {
                  await trx('roles_permissions_resources').insert({
                    role_id: information.role_id,
                    permission_id,
                    resource_id
                  });
                }
            }
            await trx.commit();
            return role; 
        }
        catch(err){
            await trx.rollback();
            console.log(err)
            throw new Error(`error on server side:${err}`);
        }
    }
}
module.exports=roleRepository;