const {Model}=require('objection');
const path=require('path');

module.exports=class CourseAssign extends Model{

    static get tableName(){
        return 'course_assignments';
    }

    static get relationMappings(){
         return {
            courses:{
                relation: Model.BelongsToOneRelation,
                modelClass: path.join(__dirname,'course'),
                join:{
                    from:'course_assignments.course_id',
                    to:'courses.id'
                }
            },
            schoolYears:{
                relation: Model.BelongsToOneRelation,
                modelClass: path.join(__dirname,'school_year'),
                join:{
                    from:'course_assignments.school_year_id',
                    to:'school_years.id'
                }
            },
            grades:{
                relation: Model.BelongsToOneRelation,
                modelClass: path.join(__dirname,'grade'),
                join:{
                    from:'course_assignments.grade_id',
                    to:'grades.id'
                }
            },
            scores:{
                relation: Model.HasManyRelation,
                modelClass:path.join(__dirname,'score'),
                join:{
                    from:'course_assignments.id',
                    to:'scores.course_assignment_id'
                }
            }

         }
    }
}