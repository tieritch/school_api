const {Model}=require('objection');
const path=require('path');
module.exports=class Permission extends Model{

  static get tableName(){
    return 'permissions';
  }
  static get relationMappings(){
    return {
      roles:{
        relation:Model.ManyToManyRelation,
        modelClass:path.join(__dirname,'role'),
        join:{
          from:'permissions.id',
          through:{
            from:'roles_permissions.permission_id',
            to:'roles_permissions.role_id',
          },
          to:'roles.id',
        },
      },
    };
  }
};
