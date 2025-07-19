const{Model}=require('objection');
const path=require('path');
const AcademicSubdivision = require('./academic_subdivision');

module.exports=class AcademicPeriod extends Model{

    static get tableName(){
        return 'academic_periods'
    }

    static get relationMappings(){
        return {
            AcademicSubdivisions:{
                relation:Model.BelongsToOneRelation,
                modelClass:path.join(__dirname,'academic_subdivision'),
                join:{
                    from:'academic_periods.academic_subdivision_id',
                    to:'academic_subdivisions.id'
                }
            },
            scores:{
                relation: Model.HasManyRelation,
                modelClass:path.join(__dirname,'score'),
                join:{
                    from:'academic_periods.id',
                    to:'scores.academic_period_id'
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