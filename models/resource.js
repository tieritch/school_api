const {Model}=require('objection');
const path=require('path');
module.exports=class Resource extends Model{

  static get tableName(){
    return 'resources';
  }

  static get relationMappings(){
    return {
      permissions:{
        relation:Model.ManyToManyRelation,
        modelClass:path.join(__dirname,'permission'),
        join:{
          from :'resources.id',
          through:{
            from:'roles_permissions_resources.resource_id',
            to:'roles_permissions_resources.permission_id',
          },
          to:'permissions.id',
        },
      },
    };
  }

  $beforeInsert(){
    this.name=this.name.toLowerCase();
  }
};
