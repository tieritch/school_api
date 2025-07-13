const { Model } = require('objection');
const path=require('path');

module.exports=class Course extends Model{

    static get tableName(){
        return 'courses'
    }

    static get relationMappings(){

        return {
            courseTypes:{
             relation: Model.BelongsToOneRelation,
             modelClass: path.join(__dirname,'course_type'),
             join:{
                from:'courses.course_types_id',
                to:'course_types.id'
             }
            },
            scores:{
                relation: Model.HasManyRelation,
                modelClass: path.join(__dirname,'score'),
                join:{
                    from:'courses.id',
                    to:'scores.course_id'
                }
            }
        }
    }
    $beforeInsert(){
        if(this.name)
        this.name=this.name.trim().toLowerCase();
    }
    $beforeUpdate(){
        if(this.name)
        this.name=this.name.trim().toLowerCase();
    }
}