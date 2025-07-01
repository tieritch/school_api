
const {Permission}=require('../models')
/**
 * @namespace permissionRepository
 */
const permissionRepository={
    /**
      * This function returns list of all permissions
      * @function 
      * @memberof permissionRepository
      * @returns {Array}
      */
    findAll(){
        return Permission.query();
    },
   
 
   /**
     * This function returns one permission based on informations provided by entity object
     * @function
     * @memberof permissionRepository
     * @param {object} entity 
     * @returns { object}
     */
  async findBy(entity){
    const permission=await Permission.query().where(entity).first();
    return permission;
  },
}
module.exports= permissionRepository