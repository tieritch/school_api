const { Model } = require('objection');
const path=require('path');
module.exports= class Score extends Model{
    
    static get tableName(){
        return 'scores'
    }
    static get relationMappings(){
        return {
            courseAssigns:{
                relation:Model.BelongsToOneRelation,
                modelClass: path.join(__dirname,'course_assignments'),
                join:{
                    from: 'scores.course_assignment_id',
                    to:'course_assignments.id'
                }
            },
            students:{
                relation:Model.BelongsToOneRelation,
                modelClass:path.join(__dirname,'student'),
                join:{
                    from:'scores.student_id',
                    to:'students.id'
                }
            },
            evaluationTypes:{
                relation: Model.BelongsToOneRelation,
                modelClass:path.join(__dirname,'evaluation_types'),
                join:{
                    from: 'scores.evaluation_type_id',
                    to:'evaluation_types.id'
                }
            }
        }
    }
}