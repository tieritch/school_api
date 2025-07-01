const {Model}=require('objection');
const path=require('path');
module.exports=class Role extends Model{
        static get tableName(){
            return 'roles'
        }
        static get relationMappings(){
            return {
                users:{
                    relation:Model.ManyToManyRelation,
                    modelClass:path.join(__dirname,'user'),
                    join:{
                        from:'roles.id',
                        through:{
                            from:'users_roles.role_id',
                            to:'users_roles.user_id'
                        },
                        to:'users.id'
                    }
                },
                permissions:{
                    relation:Model.ManyToManyRelation,
                    modelClass:path.join(__dirname,'permission'),
                    join:{
                        from:'roles.id',
                        through:{
                            from:'roles_permissions.role_id',
                            to:'roles_permissions.permission_id'
                        },
                        to:'permissions.id'
                    }
                }
            }
        }
        $beforeInsert(){
            if(this.name){
                this.name=this.name.trim().toLowerCase()
            }
        }
        $beforeUpdate(){
            if(this.name){
                this.name=this.name.trim().toLowerCase()
            }
        }
}