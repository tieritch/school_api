const{Model}=require('objection');
const path=require('path');

module.exports=class AcademicSubdivision extends Model{

  static get tableName(){
    return 'academic_subdivisions';
  }

  static get relationMappings(){

    return {
      schoolYears:{
        relation: Model.belongsToOneRelation,
        modelClass:path.join(__dirname,'school_year'),
        join:{
          from:'academic_subdivisions.school_year_id',
          to:'school_years.id',
        },
      },
      academicPeriods:{
        relation:Model.HasManyRelation,
        modelClass:path.join(__dirname,'academic_period'),
        join:{
          from:'academic_subdivisions.id',
          to:'academic_periods.academic_subdivision_id',
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
