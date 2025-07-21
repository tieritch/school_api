// SchoolYear.js
const { Model } = require('objection');
const path=require('path');

module.exports=class SchoolYear extends Model {
  static get tableName() {
    return 'school_years';
  }

  static get relationMappings() {

    return {
      enrollments: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname,'enrollment'),//Enrollment,
        join: {
          from: 'school_years.id',
          to: 'enrollments.school_year_id',
        },
      },
      students: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname,'student'),//Student,
        join: {
          from: 'school_years.id',
          through: {
            from: 'enrollments.school_year_id',
            to: 'enrollments.student_id',
          },
          to: 'students.id',
        },
      },
      grades: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname,'grade'),//Grade,
        join: {
          from: 'school_years.id',
          through: {
            from: 'enrollments.school_year_id',
            to: 'enrollments.grade_id',
          },
          to: 'grades.id',
        },
      },
      subdivisions:{
        relation:Model.HasOneRelation,
        modelClass: path.join(__dirname,'academic_subdivision'),
        join:{
          from:'school_years.id',
          to:'academic_subdivisions.school_year_id',
        },
      },
    };
  }

  $beforeInsert(){
    this.name=this.name.toLowerCase().trim();
  }
  $beforeUpdate(){
    this.name=this.name.toLowerCase().trim();
  }
};

