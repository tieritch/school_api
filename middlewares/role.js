const { access } = require("../utils/gen_token")
const {userRepository,permissionRepository,roleRepository}=require('.././repositories');
const {Role,User}=require('.././models');

function accessByRole(role,permission){
   
  return async(req,res,next)=>{
        
        const {username,password}=req.user;
        const permissionFound=await permissionRepository.findBy({name:permission.trim().toUpperCase()});//['read','create','update','delete']   
        const userFound=await userRepository.findBy({username,password});
        
        if(!permissionFound){
            return res.status(401).json({error:'Permission does not exist'})
        }
        if(!userFound){
            return res.status(401).json({error:'user does not exist'})
        }
       
        const rolesOfUser=await userFound.$relatedQuery('roles');
        if(!rolesOfUser.map(role=>role.name).includes(role)){
            return res.status(401).json({error:` The user does not have ${role} role `})
        }
        
        const roleFound=await roleRepository.findBy({name:role.trim().toLowerCase()});       
        const permissionsOfRole=await roleFound.$relatedQuery('permissions');
        
        // permissions are for e.g:'create','read','update'
        // admin role is supposed to have all permissions, that's why we check only for other roles
        if(!permissionsOfRole.map(permission=>permission.name).includes(permission)
          && role.trim().toLowerCase()!='admin'){ 
            return res.status(401).json({
                error:`${role} role does not have a ${permission} permission `
            })
        }    
        next();
    }

}
module.exports=accessByRole;