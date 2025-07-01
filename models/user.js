const {Model}=require('objection');
//const Role=require('./role');
const bcrypt=require('bcrypt');
const path=require('path')
module.exports=class User extends Model {
   static get tableName(){  
        return 'users'
   };
   static get relationMappings(){
        return {
            roles:{
                relation:Model.ManyToManyRelation,
                modelClass:path.join(__dirname,'role'),
                join:{
                    from:'users.id',
                        through:{
                            from:'users_roles.user_id',
                            to:'users_roles.role_id'     
                    },
                    to:'roles.id'
                }
            },
        }
   }
   /*static get jsonSchema(){
       // console.log('firstname:'+this.firstname)
      //  console.log('lasttname:'+this.lastname)
       // console.log('email:'+this.email)
        return {
            type:'object',
            required:['username','firstname','lastname','email','password'],
            properties:{
                //id:{ type:'integer'},
                username:{type:'string', minLength:4},
                email:{type:'string',format:'email'},
                firstname:{type:'string', minLength:2},
                lastname:{type:'string', minLength:2},
                //phone:{type:'string'},
                password:{
                    type:'string', 
                    pattern:'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)', //chiffre, majuscule,muniscule
                    minLength:8
                },
                newPassword:{
                    type:'string', 
                    pattern:'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)', //chiffre, majuscule,muniscule
                    minLength:8
                }                         
            },
        }
    }
    $formatJson(json){
       // console.log('_______________________________ FORMANT JSON');
       // console.log(json);
        json=super.$formatJson(json);
        delete json.password;
        delete json.created_at;
        delete json.updated_at;
        return json;
    }
    $parseJson(json,opt){
        let parsed=super.$parseJson(json,opt);
        if(parsed.email){
            parsed.email=parsed.email.toLowerCase();
        }
        return parsed
    }
    */
   $beforeInsert(){
        this.username=this.username.trim();
        this.email=this.email.trim().toLowerCase();
   }
   $beforeUpdate(){
        this.username=this.username.trim();
        this.email=this.email.trim().toLowerCase();
   }
}