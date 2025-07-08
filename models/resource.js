const {Model}=require('objection');
const path=require('path');
module.exports=class Resource extends Model{
     
      static get tableName(){
        return 'resources';
      }
     
      $beforeInsert(){
       this.name=this.name.toLowerCase();
     }
}