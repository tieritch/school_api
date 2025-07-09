const { access } = require("../utils/gen_token")
const {userRepository,permissionRepository,roleRepository}=require('.././repositories');
const {Role,User}=require('.././models');

function accessByRole(actions,resources){
  /* actions and resources parameters are arrays
     actions and ids : READ     5      resources and ids: courses      5
                       CREATE   6                         students     6
                       UPDATE   7                         grades       7
                       DELETE   8                         school_years 8 
                                        here will be more as I progress
   */
    return async (req, res, next) => {
        const user = req.user;
        const userFound=await userRepository.findBy({id:user.id});
        const role=await userFound.$relatedQuery('roles').first();
        
        if(role.name!='admin'){
            const dbUser = await User.query()
            .findById(user.id)
            .withGraphFetched('roles.[permissions,resources]');     
            const allowed = dbUser.roles.some(role =>
            actions.every(action=>role.permissions.map(permission=>permission.name).includes(action))
              &&
            resources.every(resource=>role.resources.map(resource=>resource.name).includes(resource)));                     
          if (!allowed ) {
           return res.status(403).json({ message: 'Access denied' });
         }
      }
       return next();
    };
    
}
module.exports=accessByRole;