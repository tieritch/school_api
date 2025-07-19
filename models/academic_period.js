const{Model}=require('objection');
const path=require('path');
const AcademicSubdivision = require('./academic_subdivision');

module.exports=class academicPeriod extends Model{

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