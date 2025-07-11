const { Model } = require('objection');
const path=require('path');

module.exports=class CourseType extends Model{

    static get tableName(){
        return 'course_types'
    }
    static get relationMappings(){

        return {
            courses:{
                relation: Model.HasManyRelation,
                modelClass: path.join(__dirname,'courses'),
                join:{
                    from:'course_types.id',
                    to:'courses.course_type.id'
                }
            }
        }
    }

    $beforeInsert(){
        this.name=this.name.trim().toLowerCase();
    }

    $beforeUpdate(){
        this.name=this.name.trim().toLowerCase();
    }
}