const { Model } = require('objection');
const path=require('path');

module.exports=class Course extends Model{

  static get tableName(){
    return 'courses';
  }

  static get relationMappings(){

    return {
      courseTypes:{
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname,'course_type'),
        join:{
          from:'courses.course_types_id',
          to:'course_types.id',
        },
      },
      courseAssigns:{
        relation: Model.BelongsToOneRelation,
        modelClass:path.join(__dirname,'course_assignments'),
        join:{
          from:'courses.id',
          to:'course_assignments.course_id',
        },
      },
    };
  }
  $beforeInsert(){
    if(this.name)
    {this.name=this.name.trim().toLowerCase();}
  }
  $beforeUpdate(){
    if(this.name)
    {this.name=this.name.trim().toLowerCase();}
  }
};
